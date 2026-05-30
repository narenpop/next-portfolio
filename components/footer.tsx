"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = {
  github:
    process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/narenpop",
  linkedin:
    process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://www.linkedin.com/in/narendar-senthilvelan-31aa29147/",
};

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    gsap.to(window, { duration: 1.2, scrollTo: 0, ease: "power4.inOut" });
  };

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      const items = footerRef.current!.querySelectorAll(".footer-animate");
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        }
      );

      footerRef.current!.querySelectorAll(".social-link").forEach((link) => {
        link.addEventListener("mouseenter", () => {
          gsap.to(link, { y: -4, duration: 0.3, ease: "power2.out" });
        });
        link.addEventListener("mouseleave", () => {
          gsap.to(link, { y: 0, duration: 0.3, ease: "power2.out" });
        });
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="site-footer border-t section-border">
      <div className="footer-glow" aria-hidden />
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="footer-animate flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-3">
              Connect
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Let&apos;s build
              <br />
              something great.
            </h2>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noreferrer noopener"
              className="social-link group"
              aria-label="GitHub profile"
            >
              <span className="social-link-icon">
                <GitHubIcon />
              </span>
              <span className="social-link-label">GitHub</span>
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="social-link group"
              aria-label="LinkedIn profile"
            >
              <span className="social-link-icon">
                <LinkedInIcon />
              </span>
              <span className="social-link-label">LinkedIn</span>
            </a>
          </div>
        </div>

        <div className="footer-animate footer-bottom flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 border-t section-border">
          <p className="text-sm text-muted">
            © {year} Naren. Crafted with Next.js & GSAP.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="footer-back-top text-xs uppercase tracking-[0.2em] cursor-pointer"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
