"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Scroll spy logic
      const scrollPosition = window.scrollY + 140;

      // Check if near bottom of page -> activate contact
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50
      ) {
        setActiveSection("contact");
        return;
      }

      // Check sections in reverse to find current section in view
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(item.id);
            return;
          }
        }
      }

      setActiveSection("home");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
      setActiveSection(id);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        isScrolled
          ? "bg-[#030617]/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-[#030617]/60 backdrop-blur-sm border-b border-white/5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Avatar & Name */}
        <button
          onClick={() => scrollToSection("home")}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] rounded-full p-1"
          aria-label="Scroll to Home"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:border-[#6366F1]/60">
            <Image
              src="/avatar-placeholder.svg"
              alt="S Prasanna"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="font-serif text-lg font-semibold text-white tracking-wide group-hover:text-white/90 transition-colors">
            S Prasanna
          </span>
        </button>

        {/* Right: Desktop Pill Navigation */}
        <nav
          className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-sm"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-heading font-medium tracking-wide uppercase transition-all duration-200 ${
                  isActive
                    ? "bg-[#6366F1]/20 text-white border border-[#6366F1]/60 shadow-[0_0_15px_rgba(99,102,241,0.35)]"
                    : "text-[#94A3B8] hover:text-white hover:bg-white/[0.06] border border-transparent"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile: Hamburger Menu via shadcn Sheet */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] bg-[#030617]/95 border-l border-white/10 backdrop-blur-xl text-white p-6 flex flex-col gap-6"
            >
              <SheetHeader className="p-0 text-left">
                <SheetTitle className="font-serif text-lg text-white flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                    <Image
                      src="/avatar-placeholder.svg"
                      alt="S Prasanna"
                      fill
                      className="object-cover"
                    />
                  </div>
                  S Prasanna
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-2 mt-4" aria-label="Mobile Navigation">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-heading font-medium uppercase tracking-wider transition-all duration-200 ${
                        isActive
                          ? "bg-[#6366F1]/20 text-white border border-[#6366F1]/60 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                          : "text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
