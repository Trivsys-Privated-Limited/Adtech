import { capabilities } from "@/content/company";

export function Capabilities() {
  return (
    <section aria-label="Core capabilities" className="border-y border-line bg-ink-900/50">
      <div className="container-site flex flex-col gap-5 py-7 lg:flex-row lg:items-center lg:gap-10">
        <p className="eyebrow shrink-0">What we engineer</p>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-3 min-[420px]:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-1 lg:items-center lg:justify-between">
          {capabilities.map((capability) => (
            <li key={capability} className="flex items-center gap-3 text-[0.9375rem] font-medium text-fg/90">
              <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-red-500" />
              {capability}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
