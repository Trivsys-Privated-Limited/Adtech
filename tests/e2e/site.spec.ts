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

/** Every route reachable from the main navigation, with text expected in its <h1>. */
const ROUTES: [path: string, h1: RegExp][] = [
  ["/", /Engineering Digital Experiences/],
  ["/services", /End-to-end engineering/],
  ["/solutions", /Solutions across the full stack/],
  ["/work", /The kind of products we build/],
  ["/about", /Thoughtful engineering/],
  ["/contact", /Have an Idea\?/],
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
