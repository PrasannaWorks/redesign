"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  currentAlpha: number;
  vx: number;
  vy: number;
  isGlowing?: boolean;
  pulsePhase?: number;
  pulseSpeed?: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = mediaQuery.matches;

    const initStars = (width: number, height: number) => {
      const isMobile = width < 768;
      const count = isMobile ? 70 : 170;
      const centerX = width / 2;
      const centerY = height / 2;

      stars = [];

      for (let i = 0; i < count; i++) {
        // Distribute 15% in a denser central galactic cluster
        const isCenterCluster = i < Math.floor(count * 0.15);
        let x: number;
        let y: number;

        if (isCenterCluster) {
          // Box-Muller or Gaussian-like distribution around center
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.pow(Math.random(), 1.6) * Math.min(width, height) * 0.35;
          x = centerX + Math.cos(angle) * distance;
          y = centerY + Math.sin(angle) * distance;
        } else {
          x = Math.random() * width;
          y = Math.random() * height;
        }

        // About 10% are larger softly glowing stars
        const isGlowing = i % 10 === 0;

        let radius: number;
        if (isGlowing) {
          radius = 1.6 + Math.random() * 1.0;
        } else if (isCenterCluster) {
          radius = 0.5 + Math.random() * 0.7;
        } else {
          radius = 0.5 + Math.random() * 0.9;
        }

        const baseAlpha = isGlowing
          ? 0.75 + Math.random() * 0.25
          : isCenterCluster
          ? 0.35 + Math.random() * 0.45
          : 0.2 + Math.random() * 0.65;

        // Subtle, slow drift speeds
        const vx = (Math.random() - 0.5) * 0.06;
        const vy = (Math.random() - 0.65) * 0.08;

        stars.push({
          x,
          y,
          radius,
          baseAlpha,
          currentAlpha: baseAlpha,
          vx,
          vy,
          isGlowing,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.02,
        });
      }
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars(width, height);

      if (prefersReducedMotion) {
        drawFrame(width, height, false);
      }
    };

    const drawFrame = (width: number, height: number, animate: boolean) => {
      ctx.clearRect(0, 0, width, height);

      // Faint central nebula glow
      const radialGlow = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.min(width, height) * 0.5
      );
      radialGlow.addColorStop(0, "rgba(99, 102, 241, 0.06)");
      radialGlow.addColorStop(0.5, "rgba(67, 56, 202, 0.025)");
      radialGlow.addColorStop(1, "transparent");
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Render stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (animate) {
          star.x += star.vx;
          star.y += star.vy;

          // Wrap around edges
          if (star.x < -10) star.x = width + 10;
          if (star.x > width + 10) star.x = -10;
          if (star.y < -10) star.y = height + 10;
          if (star.y > height + 10) star.y = -10;

          if (star.isGlowing && star.pulsePhase !== undefined && star.pulseSpeed !== undefined) {
            star.pulsePhase += star.pulseSpeed;
            const wave = Math.sin(star.pulsePhase);
            star.currentAlpha = Math.max(0.3, star.baseAlpha + wave * 0.25);
          }
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

        if (star.isGlowing) {
          ctx.save();
          ctx.shadowColor = "rgba(165, 180, 252, 0.9)";
          ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(255, 255, 255, ${star.currentAlpha})`;
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.currentAlpha})`;
          ctx.fill();
        }
      }
    };

    const renderLoop = () => {
      drawFrame(window.innerWidth, window.innerHeight, true);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    const onMotionPreferenceChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      cancelAnimationFrame(animationFrameId);
      if (prefersReducedMotion) {
        drawFrame(window.innerWidth, window.innerHeight, false);
      } else {
        renderLoop();
      }
    };

    handleResize();

    if (!prefersReducedMotion) {
      renderLoop();
    }

    window.addEventListener("resize", handleResize);
    mediaQuery.addEventListener("change", onMotionPreferenceChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", onMotionPreferenceChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-50 w-full h-full bg-[#030617]"
      aria-hidden="true"
    />
  );
}
