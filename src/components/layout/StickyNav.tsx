import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FOCUS_RING, NAV_SECTIONS } from "../../lib/constants";
import { useChat } from "../ai-chat/ChatContext";

function useActiveSection(sectionIds: readonly string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}

export default function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { openChat } = useChat();
  const isHome = location.pathname === "/";
  const activeSection = useActiveSection(NAV_SECTIONS.map((s) => s.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const visible = !isHome || scrolled;

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  const handleTalkWithAI = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    openChat({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      } ${
        visible
          ? "bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle"
          : ""
      }`}
    >
      <nav className="max-w-content mx-auto flex items-center justify-between px-6 md:px-20 py-4">
        <Link
          to="/"
          className={`font-display text-body font-medium tracking-tight text-text-primary ${FOCUS_RING}`}
        >
          HB
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 relative">
          {NAV_SECTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative text-caption uppercase tracking-wide transition-colors duration-150 ${FOCUS_RING} ${
                isHome && activeSection === item.id
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {item.label}
              {isHome && activeSection === item.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent-electric"
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          ))}
          <button
            onClick={handleTalkWithAI}
            className={`text-caption uppercase tracking-wide text-accent-electric hover:brightness-110 transition-all duration-150 ${FOCUS_RING}`}
          >
            Talk with my AI
          </button>
        </div>

        {/* Mobile trigger */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={handleTalkWithAI}
            className={`text-caption uppercase tracking-wide text-accent-electric ${FOCUS_RING}`}
          >
            AI
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="sticky-mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`relative w-6 h-5 flex flex-col justify-between ${FOCUS_RING}`}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block h-[1.5px] w-full bg-text-primary origin-center"
              transition={{ duration: 0.2 }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-[1.5px] w-full bg-text-primary"
              transition={{ duration: 0.15 }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block h-[1.5px] w-full bg-text-primary origin-center"
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="sticky-mobile-menu"
            role="dialog"
            aria-label="Site navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden mx-6 mb-4 rounded-xl border border-white/10 bg-bg-elevated/95 backdrop-blur-md p-6 flex flex-col gap-1"
          >
            {NAV_SECTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-left py-3 text-body text-text-primary hover:text-accent-electric transition-colors duration-150 ${FOCUS_RING}`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
