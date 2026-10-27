import { expect, test, type Page } from "@playwright/test";

/** Navigate and wait until React has hydrated (RevealObserver sets html.js). */
async function gotoHydrated(page: Page, url: string) {
  await page.goto(url);
  await page.waitForFunction(() => document.documentElement.classList.contains("js"));
}

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 1024;

function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test("home page renders every section without console errors", async ({ page }) => {
  const errors = collectConsoleErrors(page);
  await gotoHydrated(page, "/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Engineering Digital Experiences");
  for (const id of ["services", "work", "why-adtech", "process", "solutions", "about", "contact"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  // Let the 3D scene load and render a few frames.
  await page.waitForTimeout(1500);
  expect(errors).toEqual([]);
});

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await gotoHydrated(page, "/");
    await page.waitForTimeout(500);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

/** Every route reachable from the main and footer navigation, with text expected in its <h1>. */
const ROUTES: [path: string, h1: RegExp][] = [
  ["/", /Engineering Digital Experiences/],
  ["/services", /End-to-end engineering/],
  ["/solutions", /Solutions across the full stack/],
  ["/work", /The kind of products we build/],
  ["/about", /Thoughtful engineering/],
  ["/contact", /Have an Idea\?/],
  ["/privacy-policy", /Privacy Policy/],
  ["/terms", /Terms & Conditions/],
];

test("desktop navigation opens inner pages and marks the current one", async ({ page }) => {
  test.skip(isMobile(page), "desktop nav only");
  await gotoHydrated(page, "/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const [label, path, h1] of [
    ["Services", "/services", /End-to-end engineering/],
    ["Solutions", "/solutions", /Solutions across the full stack/],
    ["Work", "/work", /The kind of products we build/],
    ["About", "/about", /Thoughtful engineering/],
    ["Contact", "/contact", /Have an Idea\?/],
    ["Home", "/", /Engineering Digital Experiences/],
  ] as const) {
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path === "/" ? "/" : path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toContainText(h1);
    await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
  }
});

for (const [path, h1] of ROUTES) {
  test(`${path} loads directly with a single h1`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(h1);
    // A refresh must work too (no client-only routing).
    expect((await page.reload())?.status()).toBe(200);
  });
}

test("unknown routes return a 404 page", async ({ page }) => {
  for (const path of ["/does-not-exist", "/services/unknown", "/about/team"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("could not be found");
  }
});

test("hero CTAs stay on the Home page and scroll to sections", async ({ page }) => {
  await gotoHydrated(page, "/");
  await page.getByRole("link", { name: "Let's Build Something" }).click();
  await expect(page).toHaveURL(/\/#contact$/);
  await expect(page.locator("#contact-title")).toBeInViewport();
});

test("mobile menu opens, traps Escape, and navigates", async ({ page }) => {
  test.skip(!isMobile(page), "mobile menu only");
  await gotoHydrated(page, "/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
  const menu = page.getByRole("navigation", { name: "Mobile" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

  await page.getByRole("button", { name: "Open menu" }).click();
  await menu.getByRole("link", { name: "Contact" }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Have an Idea?");
});

test("process tabs support keyboard navigation", async ({ page }) => {
  await gotoHydrated(page, "/#process");
  const first = page.getByRole("tab", { name: /Discover/ });
  await first.focus();
  await page.keyboard.press("ArrowDown");
  const second = page.getByRole("tab", { name: /Define/ });
  await expect(second).toHaveAttribute("aria-selected", "true");
  await expect(second).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("Define");
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: /Launch & Improve/ })).toHaveAttribute("aria-selected", "true");
});

test.describe("contact form", () => {
  test("validates required fields accessibly", async ({ page }) => {
    await gotoHydrated(page, "/#contact");
    await page.getByRole("button", { name: "Send project details" }).click();
    const name = page.getByLabel("Name");
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please choose a project type.")).toBeVisible();

    await page.getByLabel("Work email").fill("not-an-email");
    await page.getByLabel("Work email").blur();
    await expect(page.getByText(/valid email address/)).toBeVisible();
  });

  async function fillValid(page: Page) {
    await page.getByLabel("Name").fill("Jordan Lee");
    await page.getByLabel("Work email").fill("jordan@example.com");
    await page.getByLabel("Project type").selectOption("Web development");
    await page.getByLabel("Project details").fill("We need a new marketing site and customer portal for our product.");
  }

  test("is marked as a preview with a placeholder inbox before submitting", async ({ page }) => {
    await gotoHydrated(page, "/#contact");
    const contact = page.locator("#contact");
    await expect(contact.getByText("Preview form.")).toBeVisible();
    await expect(contact.getByText("won't reach us")).toBeVisible();
    // The address is labelled wherever it appears: contact section and footer.
    await expect(contact.locator('a[href^="mailto:"]').getByText("Placeholder")).toBeVisible();
    await expect(page.locator("footer").first().locator('a[href^="mailto:"]').getByText("Placeholder")).toBeVisible();
  });

  test("reports honestly when submissions are not configured", async ({ page }) => {
    await gotoHydrated(page, "/#contact");
    await fillValid(page);
    await page.getByRole("button", { name: "Send project details" }).click();
    await expect(page.locator("#contact").getByRole("alert")).toContainText("connected yet, so your message was not sent", {
      timeout: 15_000,
    });
    await expect(page.getByText("your message was sent")).toHaveCount(0);
    // The fallback address in the error is labelled too.
    await expect(page.locator("#contact").getByRole("alert").getByText("Placeholder")).toBeVisible();
  });

  test("shows success only after the API confirms delivery", async ({ page }) => {
    await page.route("**/api/contact", (route) => route.fulfill({ status: 200, json: { ok: true } }));
    await gotoHydrated(page, "/#contact");
    await fillValid(page);
    await page.getByRole("button", { name: "Send project details" }).click();
    await expect(page.locator("#contact").getByRole("status")).toContainText("your message was sent");
  });
});

test("contact API validates input and refuses to fake delivery", async ({ request }) => {
  const invalid = await request.post("/api/contact", { data: { name: "" } });
  expect(invalid.status()).toBe(422);
  expect((await invalid.json()).fields.email).toBeTruthy();

  const valid = await request.post("/api/contact", {
    data: {
      name: "Jordan Lee",
      email: "jordan@example.com",
      projectType: "Mobile apps",
      details: "An app for booking appointments with our clinics.",
    },
  });
  expect(valid.status()).toBe(503);
  expect((await valid.json()).error).toBe("not_configured");
});

test("case study pages render and are labelled as concepts", async ({ page }) => {
  await gotoHydrated(page, "/");
  await page.getByRole("link", { name: "Fleet Operations Platform" }).click();
  await expect(page).toHaveURL(/\/work\/fleet-operations-platform$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Fleet Operations Platform");
  await expect(page.getByText("Concept project.")).toBeVisible();

  const missing = await page.goto("/work/does-not-exist");
  expect(missing?.status()).toBe(404);
});

test("all internal links on every page resolve", async ({ page, request }) => {
  test.skip(isMobile(page), "link targets are the same on every viewport");
  const pages = [...ROUTES.map(([path]) => path), "/work/fleet-operations-platform"];
  const checked = new Set<string>();

  for (const source of pages) {
    await page.goto(source);
    const hrefs = await page.$$eval("a[href^='/'], a[href^='#']", (links) =>
      [...new Set(links.map((a) => a.getAttribute("href")!))],
    );
    for (const href of hrefs) {
      const [rawPath, hash] = href.split("#");
      const path = rawPath || source; // "#process" is relative to the current page
      const key = `${path}#${hash ?? ""}`;
      if (checked.has(key)) continue;
      checked.add(key);

      const response = await request.get(path);
      expect(response.status(), `${href} (on ${source})`).toBe(200);
      if (hash && hash !== "main") {
        // The target section must exist on the destination page.
        expect(await response.text(), `#${hash} missing on ${path} (linked from ${source})`).toContain(`id="${hash}"`);
      }
    }
  }
});

test("content stays visible with reduced motion", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await gotoHydrated(page, "/");
  await page.locator("#about").scrollIntoViewIfNeeded();
  const opacity = await page.locator("#about [data-reveal]").first().evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe("1");
  await context.close();
});

test("hero falls back gracefully without WebGL", async ({ page }) => {
  const errors = collectConsoleErrors(page);
  await page.addInitScript(() => {
    // Simulate a browser without WebGL; other context types pass through.
    const original = HTMLCanvasElement.prototype.getContext as (...args: unknown[]) => unknown;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value(this: HTMLCanvasElement, type: string, ...args: unknown[]) {
        return type.startsWith("webgl") ? null : original.apply(this, [type, ...args]);
      },
    });
  });
  await gotoHydrated(page, "/");
  await page.waitForTimeout(800);
  await expect(page.locator("#top canvas")).toHaveCount(0);
  await expect(page.locator("#top svg[viewBox='0 0 400 400']")).toBeVisible();
  expect(errors).toEqual([]);
});

test.describe("legal pages", () => {
  for (const [label, path, title] of [
    ["Privacy Policy", "/privacy-policy", "Privacy Policy"],
    ["Terms & Conditions", "/terms", "Terms & Conditions"],
  ] as const) {
    test(`${label} is linked from the footer and marked as a draft`, async ({ page }) => {
      await gotoHydrated(page, "/");
      await page.getByRole("navigation", { name: "Legal" }).getByRole("link", { name: label }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.getByRole("heading", { level: 1 })).toContainText(title);
      await expect(page).toHaveTitle(`${title} | Adtech`);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{40,}/);
      // Unknown business details are visibly flagged rather than invented.
      await expect(page.getByRole("note")).toContainText("Draft pending legal review");
      expect(await page.locator("[data-todo]").count()).toBeGreaterThan(0);
      // The table of contents jumps to sections on the same page.
      const toc = page.getByRole("navigation", { name: "On this page" });
      await toc.getByRole("link", { name: "Contact us" }).click();
      await expect(page).toHaveURL(new RegExp(`${path}#contact-us$`));
      await expect(page.locator("#contact-us")).toBeInViewport();
    });
  }

  test("the privacy policy describes the site's real storage use", async ({ page }) => {
    await page.goto("/privacy-policy");
    await expect(page.locator("#cookies")).toContainText("does not set cookies of its own");
    await expect(page.locator("#cookies")).toContainText("adtech:welcome-seen-at");
  });
});

test("sitemap lists the legal pages", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/privacy-policy", "/terms", "/services", "/work/fleet-operations-platform"]) {
    expect(xml).toContain(`${path}</loc>`);
  }
});

test.describe("newsletter sign-up", () => {
  const form = (page: Page) => page.getByRole("form", { name: "Newsletter sign-up" });

  test("validates the email address accessibly", async ({ page }) => {
    await gotoHydrated(page, "/");
    const email = form(page).getByLabel("Email address");
    await form(page).getByRole("button", { name: "Subscribe" }).click();
    await expect(email).toBeFocused();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(form(page).getByText("Please enter your email address.")).toBeVisible();

    await email.fill("not-an-email");
    await form(page).getByRole("button", { name: "Subscribe" }).click();
    await expect(form(page).getByText(/valid email address/)).toBeVisible();
    await expect(email).toHaveAttribute("aria-describedby", /newsletter-email-error/);

    await email.fill("jordan@example.com");
    await expect(email).toHaveAttribute("aria-invalid", "false");
  });

  test("is marked as a preview and never fakes a subscription", async ({ page }) => {
    await gotoHydrated(page, "/");
    await expect(form(page).getByText("Sign-up isn't connected yet")).toBeVisible();
    await form(page).getByLabel("Email address").fill("jordan@example.com");
    await form(page).getByRole("button", { name: "Subscribe" }).click();
    await expect(form(page).getByRole("alert")).toContainText("you have not been subscribed", { timeout: 15_000 });
    await expect(page.getByText("your sign-up was received")).toHaveCount(0);
  });

  test("shows success only after the API confirms", async ({ page }) => {
    await page.route("**/api/newsletter", (route) => route.fulfill({ status: 200, json: { ok: true } }));
    await gotoHydrated(page, "/services");
    await form(page).getByLabel("Email address").fill("jordan@example.com");
    await form(page).getByRole("button", { name: "Subscribe" }).click();
    await expect(page.locator("#newsletter").getByRole("status")).toContainText("your sign-up was received");
  });

  test("does not interfere with the contact form", async ({ page }) => {
    const newsletterRequests: string[] = [];
    page.on("request", (req) => req.url().includes("/api/newsletter") && newsletterRequests.push(req.url()));
    await gotoHydrated(page, "/contact");
    await form(page).getByLabel("Email address").fill("jordan@example.com");
    await page.getByRole("button", { name: "Send project details" }).click();
    // Only the contact form submits and validates; the newsletter keeps its value and stays quiet.
    await expect(page.getByLabel("Name")).toBeFocused();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(form(page).getByLabel("Email address")).toHaveValue("jordan@example.com");
    await expect(form(page).getByLabel("Email address")).toHaveAttribute("aria-invalid", "false");
    await expect(form(page).getByRole("alert")).toBeEmpty();
    expect(newsletterRequests).toEqual([]);
  });
});

test("newsletter API validates input and refuses to fake a subscription", async ({ request }) => {
  const invalid = await request.post("/api/newsletter", { data: { email: "nope" } });
  expect(invalid.status()).toBe(422);
  expect((await invalid.json()).error).toBe("validation");

  const valid = await request.post("/api/newsletter", { data: { email: "jordan@example.com" } });
  expect(valid.status()).toBe(503);
  expect((await valid.json()).error).toBe("not_configured");

  // Honeypot submissions are dropped without being forwarded.
  const bot = await request.post("/api/newsletter", { data: { email: "bot@example.com", website: "spam.example" } });
  expect(bot.status()).toBe(200);

  const oversized = await request.post("/api/newsletter", { data: { email: "a".repeat(3000) } });
  expect(oversized.status()).toBe(413);
});

test.describe("welcome modal", () => {
  // A first-time visitor: nothing in storage.
  test.use({ storageState: { cookies: [], origins: [] } });
  const dialog = (page: Page) => page.getByRole("dialog", { name: /Software engineered for what.s next/ });

  test("appears once on the first visit and closes with Escape", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await gotoHydrated(page, "/");
    await expect(dialog(page)).toBeVisible();
    await expect(page.getByRole("button", { name: "Close welcome message" })).toBeFocused();

    // Fits the viewport on every screen size.
    const box = (await dialog(page).boundingBox())!;
    const viewport = page.viewportSize()!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();

    // Neither a reload nor client-side navigation brings it back.
    await gotoHydrated(page, "/");
    await page.waitForTimeout(2000);
    await expect(dialog(page)).toBeHidden();
    await page.locator("footer").getByRole("link", { name: "About", exact: true }).click();
    await expect(page).toHaveURL(/\/about$/);
    await page.waitForTimeout(2000);
    await expect(dialog(page)).toBeHidden();
    expect(errors).toEqual([]);
  });

  test("keeps focus inside and closes with the close button", async ({ page }) => {
    await gotoHydrated(page, "/");
    await expect(dialog(page)).toBeVisible();
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      // Focus may pass through the browser chrome, but never lands on the page behind.
      const behind = await page.evaluate(
        () => document.activeElement !== document.body && !document.activeElement?.closest("dialog"),
      );
      expect(behind).toBe(false);
    }
    await page.getByRole("button", { name: "Close welcome message" }).click();
    await expect(dialog(page)).toBeHidden();
  });

  test("CTA goes to the services page", async ({ page }) => {
    await gotoHydrated(page, "/about");
    await dialog(page).getByRole("link", { name: "Explore our services" }).click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(dialog(page)).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("End-to-end engineering");
  });

  test("never appears on the contact form or legal pages", async ({ page }) => {
    for (const path of ["/contact", "/privacy-policy", "/terms"]) {
      await gotoHydrated(page, path);
      await page.waitForTimeout(2000);
      await expect(dialog(page), path).toBeHidden();
    }
  });

  test("does not interrupt someone already typing", async ({ page }) => {
    await gotoHydrated(page, "/");
    await page.getByRole("form", { name: "Newsletter sign-up" }).getByLabel("Email address").focus();
    await page.waitForTimeout(2000);
    await expect(dialog(page)).toBeHidden();
  });

  test("stays closed without blocking the page when storage is unavailable", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new DOMException("Storage disabled", "SecurityError");
        },
      });
    });
    await gotoHydrated(page, "/");
    await page.waitForTimeout(2000);
    await expect(dialog(page)).toBeHidden();
    await page.getByRole("link", { name: "Let's Build Something" }).click();
    await expect(page).toHaveURL(/\/#contact$/);
    expect(errors).toEqual([]);
  });

  test("opens without animation under reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce", storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    await gotoHydrated(page, "/");
    await expect(dialog(page)).toBeVisible();
    expect(await page.locator("dialog").evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    await context.close();
  });
});
