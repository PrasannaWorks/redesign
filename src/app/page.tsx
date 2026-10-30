import Starfield from "@/components/Starfield";
import Navbar from "@/components/Navbar";

const SECTIONS = [
  { id: "home", title: "Home" },
  { id: "about", title: "About" },
  { id: "skills", title: "Skills" },
  { id: "projects", title: "Projects" },
  { id: "contact", title: "Contact" },
] as const;

export default function Page() {
  return (
    <>
      <Starfield />
      <Navbar />

      <main className="relative z-10 flex flex-col">
        {SECTIONS.map((section, idx) => (
          <section
            key={section.id}
            id={section.id}
            className={`min-h-screen flex flex-col items-center justify-center px-4 py-24 ${
              idx === 0 ? "pt-28" : ""
            } border-b border-white/[0.04]`}
          >
            <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
              <span className="font-heading text-xs tracking-widest uppercase text-[#6366F1] font-semibold">
                Section #{idx + 1}
              </span>
              <h2 className="text-3xl font-heading font-semibold mt-2 text-white">
                {section.title}
              </h2>
              <p className="mt-3 text-sm text-[#94A3B8] font-serif">
                Placeholder for <code className="text-white/80">#{section.id}</code>. Content will be built here in subsequent steps.
              </p>
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
