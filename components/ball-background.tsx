"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BALLS = [
  { color: "rgba(255, 107, 107, 0.92)", size: 260, left: "8%", top: "14%", scrollY: 280, scrollX: -50 },
  { color: "rgba(78, 205, 196, 0.9)", size: 220, left: "78%", top: "10%", scrollY: -240, scrollX: 65 },
  { color: "rgba(255, 195, 113, 0.92)", size: 300, left: "52%", top: "42%", scrollY: 360, scrollX: 40 },
  { color: "rgba(162, 155, 254, 0.88)", size: 240, left: "14%", top: "55%", scrollY: -320, scrollX: -80 },
  { color: "rgba(255, 121, 198, 0.9)", size: 180, left: "86%", top: "60%", scrollY: 220, scrollX: 55 },
  { color: "rgba(69, 183, 209, 0.92)", size: 280, left: "36%", top: "75%", scrollY: -400, scrollX: -35 },
  { color: "rgba(150, 206, 180, 0.88)", size: 200, left: "6%", top: "82%", scrollY: 340, scrollX: 70 },
  { color: "rgba(253, 203, 110, 0.9)", size: 160, left: "90%", top: "30%", scrollY: -200, scrollX: -60 },
  { color: "rgba(116, 185, 255, 0.88)", size: 220, left: "58%", top: "90%", scrollY: 280, scrollX: 45 },
] as const;

export function BallBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    const scrollRoot =
      document.querySelector<HTMLElement>("[data-scroll-root]") ??
      document.documentElement;

    const ctx = gsap.context(() => {
      const wrappers = container.querySelectorAll<HTMLElement>(".ball-wrap");
      const balls = container.querySelectorAll<HTMLElement>(".ball");

      wrappers.forEach((wrap, index) => {
        const config = BALLS[index];

        gsap.to(wrap, {
          y: config.scrollY,
          x: config.scrollX,
          ease: "none",
          scrollTrigger: {
            trigger: scrollRoot,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6 + index * 0.15,
          },
        });
      });

      balls.forEach((ball, index) => {
        const floatX = gsap.utils.random(-55, 55);

        gsap.to(ball, {
          x: `+=${floatX}`,
          y: `+=${gsap.utils.random(-35, 35)}`,
          duration: 12 + index * 1.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: index * 0.35,
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, container);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="ball-bg" aria-hidden>
      <div className="ball-bg-veil" />
      {BALLS.map((ball, index) => (
        <div
          key={index}
          className="ball-wrap"
          style={{ left: ball.left, top: ball.top, color: ball.color }}
        >
          <span
            className="ball"
            style={{
              width: ball.size,
              height: ball.size,
              backgroundColor: ball.color,
            }}
          />
        </div>
      ))}
    </div>
  );
}
