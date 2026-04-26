"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  depth: number;
  phase: number;
  tspeed: number;
  blue: boolean;
};

type Shooter = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
};

export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const stars: Star[] = [];
    const shooters: Shooter[] = [];
    let raf = 0;
    let lastTime = performance.now();
    let nextShooterAt = performance.now() + 8000 + Math.random() * 12000;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      stars.length = 0;
      const density = Math.min(1, (width * height) / (1440 * 900));
      const count = Math.floor(220 * density);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.1 + 0.25,
          depth: Math.random(),
          phase: Math.random() * Math.PI * 2,
          tspeed: 0.4 + Math.random() * 1.4,
          blue: Math.random() < 0.18,
        });
      }
    }

    function maybeSpawnShooter(now: number) {
      if (reduce) return;
      if (now < nextShooterAt) return;
      const fromLeft = Math.random() < 0.5;
      const x = fromLeft ? -40 : width + 40;
      const y = Math.random() * height * 0.6;
      const speed = 380 + Math.random() * 240;
      const angle = (fromLeft ? 1 : -1) * (0.18 + Math.random() * 0.12);
      shooters.push({
        x,
        y,
        vx: (fromLeft ? 1 : -1) * speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        life: 0,
        ttl: 0.9 + Math.random() * 0.6,
      });
      nextShooterAt = now + 14000 + Math.random() * 22000;
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      ctx!.clearRect(0, 0, width, height);

      // Stars
      for (const s of stars) {
        if (!reduce) {
          s.x -= dt * (0.4 + s.depth * 1.6);
          if (s.x < -2) s.x = width + 2;
          s.phase += dt * s.tspeed;
        }
        const tw = reduce ? 1 : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(s.phase));
        const opacity = tw * (0.35 + 0.65 * s.depth);
        ctx!.fillStyle = s.blue
          ? `rgba(125, 165, 220, ${opacity})`
          : `rgba(245, 248, 255, ${opacity})`;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r * (0.6 + s.depth), 0, Math.PI * 2);
        ctx!.fill();

        if (s.r > 0.95 && s.depth > 0.6) {
          const grad = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
          grad.addColorStop(
            0,
            s.blue
              ? `rgba(125, 165, 220, ${opacity * 0.35})`
              : `rgba(220, 232, 255, ${opacity * 0.25})`
          );
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx!.fillStyle = grad;
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.r * 6, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      // Shooting stars
      maybeSpawnShooter(now);
      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i];
        sh.life += dt;
        sh.x += sh.vx * dt;
        sh.y += sh.vy * dt;
        const t = sh.life / sh.ttl;
        if (t >= 1 || sh.x < -80 || sh.x > width + 80 || sh.y > height + 80) {
          shooters.splice(i, 1);
          continue;
        }
        const headOpacity = (1 - Math.abs(t - 0.5) * 2) * 0.95;
        const tailLen = 90;
        const dx = -sh.vx;
        const dy = -sh.vy;
        const mag = Math.hypot(dx, dy) || 1;
        const ux = dx / mag;
        const uy = dy / mag;
        const tx = sh.x + ux * tailLen;
        const ty = sh.y + uy * tailLen;
        const grad = ctx!.createLinearGradient(sh.x, sh.y, tx, ty);
        grad.addColorStop(0, `rgba(160,195,235,${headOpacity})`);
        grad.addColorStop(1, "rgba(160,195,235,0)");
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.4;
        ctx!.beginPath();
        ctx!.moveTo(sh.x, sh.y);
        ctx!.lineTo(tx, ty);
        ctx!.stroke();

        ctx!.fillStyle = `rgba(245,250,255,${headOpacity})`;
        ctx!.beginPath();
        ctx!.arc(sh.x, sh.y, 1.3, 0, Math.PI * 2);
        ctx!.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    seed();
    raf = requestAnimationFrame(frame);

    function onResize() {
      resize();
      seed();
    }
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Deep space base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 80% -10%, rgba(63,119,194,0.13), transparent 60%)," +
            "radial-gradient(900px 600px at 10% 110%, rgba(123, 90, 200, 0.10), transparent 60%)," +
            "radial-gradient(700px 500px at 50% 30%, rgba(20, 30, 70, 0.45), transparent 70%)," +
            "linear-gradient(180deg, #050816 0%, #03050E 100%)",
        }}
      />
      {/* Slow-rotating nebula tint */}
      <div
        className="absolute inset-[-20%] opacity-50 motion-reduce:hidden animate-nebula"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, rgba(63,119,194,0.07), rgba(123,90,200,0.05), rgba(63,119,194,0.04), rgba(20,40,80,0.06), rgba(63,119,194,0.07))",
          filter: "blur(60px)",
        }}
      />
      <canvas ref={ref} className="absolute inset-0" />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(3,5,14,0.55) 100%)",
        }}
      />
    </div>
  );
}
