"use client";

import { useEffect, useRef, useState } from "react";
import { BallBackground } from "@/components/ball-background";
import { Footer } from "@/components/footer";
import { LazyImage } from "@/components/lazy-image";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const NAV_ITEMS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
] as const;

const SKILLS = [
  { name: "React.js", logo: "/skills/react.svg" },
  { name: "Next.js", logo: "/skills/nextjs.svg" },
  { name: "Tailwind CSS", logo: "/skills/tailwind.svg" },
  { name: "Node.js", logo: "/skills/nodejs.svg" },
  { name: "GSAP", logo: "/skills/gsap.svg" },
] as const;

type Theme = "light" | "dark";

export default function Home() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [activeNav, setActiveNav] = useState<string>("home");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [formError, setFormError] = useState("");

  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const navItemsRef = useRef<HTMLLIElement[]>([]);
  const heroRef = useRef<HTMLElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroLineRef = useRef<HTMLDivElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const skillCardsRef = useRef<HTMLDivElement[]>([]);
  const projectsRef = useRef<HTMLElement>(null);
  const projectCardsRef = useRef<HTMLElement[]>([]);
  const contactRef = useRef<HTMLElement>(null);
  const contactFormRef = useRef<HTMLFormElement>(null);
  const exploreButtonRef = useRef<HTMLButtonElement>(null);
  const touchButtonRef = useRef<HTMLButtonElement>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLElement | null>> = {
    home: heroRef,
    about: aboutRef,
    skills: skillsRef,
    projects: projectsRef,
    contact: contactRef,
  };

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") {
      setTheme(current);
    }
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const scrollToSection = (id: string) => {
    const ref = sectionRefs[id];
    setActiveNav(id);

    if (ref?.current) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: ref.current, offsetY: 72 },
        ease: "power4.inOut",
      });
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError("Name is required");
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setFormError("Please enter a valid email");
      return false;
    }
    if (!formData.message.trim()) {
      setFormError("Message is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) return;

    setFormStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
      gsap.fromTo(
        ".form-success",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
      setTimeout(() => setFormStatus("idle"), 5000);
    } catch (error) {
      setFormStatus("error");
      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again."
      );
      setTimeout(() => setFormStatus("idle"), 8000);
    }
  };

  const addButtonHover = (el: HTMLElement | null) => {
    if (!el) return;
    el.addEventListener("mouseenter", () => {
      gsap.to(el, { scale: 1.04, duration: 0.35, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { scale: 1, duration: 0.35, ease: "power2.out" });
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (logoRef.current) {
        gsap.fromTo(
          logoRef.current,
          { opacity: 0, x: -30, letterSpacing: "0.5em" },
          {
            opacity: 1,
            x: 0,
            letterSpacing: "-0.03em",
            duration: 1,
            ease: "power4.out",
          }
        );
      }

      if (navRef.current) {
        gsap.fromTo(
          navRef.current,
          { y: -100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
        );
      }

      navItemsRef.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, y: -24, scale: 0.85 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            delay: 0.15 + i * 0.08,
            ease: "back.out(1.4)",
          }
        );

        item.addEventListener("mouseenter", () => {
          gsap.to(item, { y: -2, duration: 0.25, ease: "power2.out" });
        });
        item.addEventListener("mouseleave", () => {
          gsap.to(item, { y: 0, duration: 0.25, ease: "power2.out" });
        });
      });

      if (heroTitleRef.current) {
        const chars = heroTitleRef.current.textContent?.split("") ?? [];
        heroTitleRef.current.innerHTML = chars
          .map((c) =>
            c === " "
              ? "<span>&nbsp;</span>"
              : `<span class="inline-block overflow-hidden"><span class="hero-char inline-block">${c}</span></span>`
          )
          .join("");

        gsap.fromTo(
          ".hero-char",
          { y: "110%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 0.9,
            stagger: 0.03,
            delay: 0.4,
            ease: "power4.out",
          }
        );
      }

      if (heroLineRef.current) {
        gsap.fromTo(
          heroLineRef.current,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.2,
            delay: 0.9,
            ease: "power3.inOut",
          }
        );
      }

      if (heroSubRef.current) {
        gsap.fromTo(
          heroSubRef.current,
          { opacity: 0, y: 30, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            delay: 1.1,
            ease: "power3.out",
          }
        );
      }

      if (exploreButtonRef.current) {
        gsap.fromTo(
          exploreButtonRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 1.3,
            ease: "power3.out",
          }
        );
        addButtonHover(exploreButtonRef.current);
      }

      [aboutRef, skillsRef, projectsRef, contactRef].forEach((ref) => {
        if (!ref.current) return;
        const title = ref.current.querySelector("h2");
        const desc = ref.current.querySelector(".section-desc");

        if (title) {
          gsap.fromTo(
            title,
            { opacity: 0, y: 60, clipPath: "inset(0 100% 0 0)" },
            {
              opacity: 1,
              y: 0,
              clipPath: "inset(0 0% 0 0)",
              duration: 1,
              ease: "power4.out",
              scrollTrigger: {
                trigger: title,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (desc) {
          gsap.fromTo(
            desc,
            { opacity: 0, x: -40 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: desc,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      const animateCards = (cards: HTMLElement[]) => {
        cards.forEach((card, index) => {
          if (!card) return;

          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 80,
              rotateY: -12,
              transformPerspective: 800,
            },
            {
              opacity: 1,
              y: 0,
              rotateY: 0,
              duration: 0.9,
              delay: index * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );

          const icon = card.querySelector(".card-icon");
          if (icon) {
            gsap.fromTo(
              icon,
              { scale: 0, rotation: -180 },
              {
                scale: 1,
                rotation: 0,
                duration: 0.8,
                delay: index * 0.1 + 0.2,
                ease: "back.out(1.7)",
                scrollTrigger: {
                  trigger: card,
                  start: "top 88%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              y: -12,
              scale: 1.02,
              duration: 0.4,
              ease: "power2.out",
            });
            if (icon) {
              gsap.to(icon, { scale: 1.1, duration: 0.35, ease: "power2.out" });
            }
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
            });
            if (icon) {
              gsap.to(icon, { scale: 1, duration: 0.35, ease: "power2.out" });
            }
          });
        });
      };

      animateCards(skillCardsRef.current);
      animateCards(projectCardsRef.current);

      if (touchButtonRef.current) {
        gsap.fromTo(
          touchButtonRef.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.6)",
            scrollTrigger: {
              trigger: touchButtonRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
        addButtonHover(touchButtonRef.current);
      }

      if (contactFormRef.current) {
        const fields = contactFormRef.current.querySelectorAll(
          "input, textarea, button"
        );
        gsap.fromTo(
          fields,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contactFormRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      NAV_ITEMS.forEach(({ id }) => {
        const ref = sectionRefs[id];
        if (!ref?.current) return;
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top 40%",
          end: "bottom 40%",
          onEnter: () => setActiveNav(id),
          onEnterBack: () => setActiveNav(id),
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      data-scroll-root
      className="relative flex flex-col min-h-screen text-foreground transition-colors duration-300"
    >
      <BallBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
      <nav
        ref={navRef}
        className="navbar fixed top-0 left-0 right-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4 md:px-10"
      >
        <button
          type="button"
          onClick={() => scrollToSection("home")}
          className="nav-logo justify-self-start text-left cursor-pointer"
          aria-label="Go to home"
        >
          <span ref={logoRef}>Naren</span>
        </button>

        <ul className="nav-links-center">
          {NAV_ITEMS.map((item, index) => (
            <li
              key={item.id}
              ref={(el) => {
                if (el) navItemsRef.current[index] = el;
              }}
              onClick={() => scrollToSection(item.id)}
              className={`nav-link ${
                activeNav === item.id ? "nav-link-active" : ""
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>

        <div className="col-start-3 justify-self-end flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <svg
              className="icon-sun"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
            <svg
              className="icon-moon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />
            </svg>
          </button>
        </div>
      </nav>

      <section
        ref={heroRef}
        id="home"
        className="min-h-screen flex items-center justify-center text-center px-6"
      >
        <div className="max-w-4xl">
          <h1
            ref={heroTitleRef}
            className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6 tracking-tight leading-[1.05]"
          >
            Frontend Developer
          </h1>
          <div
            ref={heroLineRef}
            className="hero-line w-full max-w-md mx-auto mb-8"
          />
          <p
            ref={heroSubRef}
            className="text-lg sm:text-xl text-muted mb-12 max-w-xl mx-auto leading-relaxed"
          >
            Building refined digital experiences with precision, motion, and
            monochrome clarity.
          </p>
          <button
            ref={exploreButtonRef}
            onClick={() => scrollToSection("projects")}
            className="btn-primary px-10 py-4 rounded-none cursor-pointer"
          >
            Explore Work
          </button>
        </div>
      </section>

      <section
        ref={aboutRef}
        id="about"
        className="lazy-section min-h-screen flex items-center py-24 px-6 border-t section-border"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
            About
          </h2>
          <p className="section-desc text-muted text-lg leading-relaxed">
            I&apos;m Naren — Frontend Developer focused on crafting modern, responsive, and visually engaging web experiences. I enjoy turning ideas into smooth, interactive interfaces using React.js, JavaScript, Tailwind CSS, and modern frontend practices.

            I care about clean UI, performance, reusable components, and creating products that feel intuitive to users. Always building, always learning, and constantly experimenting with better ways to create impactful digital experiences.
          </p>
        </div>
      </section>

      <section
        ref={skillsRef}
        id="skills"
        className="lazy-section min-h-screen py-24 px-6 border-t section-border"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-center tracking-tight">
            Skills
          </h2>
          <p className="section-desc text-muted text-center mb-16 max-w-lg mx-auto">
            Core technologies I use to design, build, and ship modern web
            applications.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {SKILLS.map((skill, index) => (
              <div
                key={skill.name}
                ref={(el) => {
                  if (el) skillCardsRef.current[index] = el;
                }}
                className="skill-card flex flex-col items-center justify-center gap-5 p-8 rounded-none"
              >
                <div className="card-icon w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                  <LazyImage
                    src={skill.logo}
                    alt={`${skill.name} logo`}
                    width={80}
                    height={80}
                    unoptimized
                    sizes="80px"
                    className="skill-logo w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm sm:text-base font-semibold tracking-wide text-center uppercase">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={projectsRef}
        id="projects"
        className="lazy-section min-h-screen py-24 px-6 border-t section-border"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-center tracking-tight">
            Projects
          </h2>
          <p className="section-desc text-muted text-center mb-16 max-w-lg mx-auto">
            Selected work spanning web apps, design systems, and performance-driven builds.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                emoji: "01",
                title: "Pets Gallery",
                desc: "Pets Gallery is a web application that allows you to view and share photos of pets.",
                link: "https://pets-gallery-91nn.vercel.app/",
                image: "/pets-card.svg",
              },
              {
                emoji: "02",
                title: "Minimalist ecommerce",
                desc: "Minimalist ecommerce is a web application that allows you to shop for products.",
                link: "https://minimalist-ecommerce-4sop.vercel.app/",
                image: "/ecommerce-card.svg",
              },
              {
                emoji: "03",
                title: "Vaasagar vattam",
                desc: "Book exploring website for Vaasagar vattam",
                link: "https://vaasagarvattam.com/",
                image: "/projects/vaasagar-vattam.jpg",
              },
            ].map((project, index) => (
                <a
                  key={project.title}
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  ref={(el: HTMLAnchorElement | null) => {
                    if (el) projectCardsRef.current[index] = el;
                  }}
                  className="project-card rounded-none overflow-hidden group transition-shadow"
                >
                  <div className="project-thumb relative aspect-[4/3] flex items-center justify-center overflow-hidden">
                    {project.image ? (
                      <LazyImage
                        src={project.image}
                        alt={`${project.title} preview`}
                        fill
                        unoptimized={project.image.endsWith(".svg")}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="project-index text-5xl font-bold tracking-widest">
                        {project.emoji}
                      </span>
                    )}
                  </div>
                  <div className="p-6 transition-colors">
                    <h3 className="font-bold text-lg mb-2 tracking-tight text-foreground">
                      {project.title}
                    </h3>
                    <p className="text-muted text-sm mb-4 leading-relaxed">
                      {project.desc}
                    </p>
                    <span className="text-sm uppercase tracking-widest text-foreground hover:text-muted transition-colors inline-block">
                      View →
                    </span>
                  </div>
                </a>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              ref={touchButtonRef}
              onClick={() => scrollToSection("contact")}
              className="btn-outline px-10 py-4 rounded-none cursor-pointer uppercase tracking-widest text-sm"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </section>

      <section
        ref={contactRef}
        id="contact"
        className="lazy-section min-h-screen flex items-center py-24 px-6 border-t section-border"
      >
        <div className="max-w-2xl mx-auto w-full">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-center tracking-tight">
            Contact
          </h2>
          <p className="section-desc text-muted text-center mb-12">
            Have a project in mind? Let&apos;s build something remarkable.
          </p>

          <form
            ref={contactFormRef}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {formStatus === "success" && (
              <div className="form-success form-alert p-4 text-center text-sm uppercase tracking-widest">
                Message sent successfully
              </div>
            )}
            {formStatus === "error" && (
              <div className="form-alert-error p-4 text-center text-sm">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 text-muted">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input-field w-full px-4 py-3 rounded-none"
                placeholder="Your name"
                disabled={formStatus === "loading"}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 text-muted">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input-field w-full px-4 py-3 rounded-none"
                placeholder="you@email.com"
                disabled={formStatus === "loading"}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 text-muted">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="input-field w-full px-4 py-3 rounded-none resize-none"
                placeholder="Your message..."
                rows={5}
                disabled={formStatus === "loading"}
              />
            </div>

            {formError && formStatus === "idle" && (
              <p className="text-muted text-sm">{formError}</p>
            )}

            <button
              type="submit"
              disabled={formStatus === "loading"}
              className="btn-primary w-full py-4 rounded-none cursor-pointer disabled:opacity-50"
            >
              {formStatus === "loading" ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
