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
  glint: boolean;
};

type Shooter = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
};

type Sparkle = {
  x: number;
  y: number;
  life: number;
  ttl: number;
  size: number;
  blue: boolean;
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
    const sparkles: Sparkle[] = [];
    let raf = 0;
    let lastTime = performance.now();
    let nextShooterAt = performance.now() + 6000 + Math.random() * 9000;
    let nextSparkleAt = performance.now() + 1500;

    function resize() {
      width = window.innerWidth;
      height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      stars.length = 0;
      // Density much higher than before — we want it to feel like a galaxy.
      const area = width * height;
      const baseDensity = Math.min(1.6, area / (1440 * 900));
      const count = Math.floor(560 * baseDensity);

      // Diagonal galactic band parameters
      const bandAngle = Math.PI * 0.18; // gentle tilt
      const bandCenterY = height * (0.45 + Math.random() * 0.1);
      const bandWidth = height * 0.32;

      for (let i = 0; i < count; i++) {
        // 60% of stars cluster around the galactic band; 40% scattered
        let x: number;
        let y: number;
        if (Math.random() < 0.6) {
          x = Math.random() * width;
          // Distance from band center (gaussian-ish via two random samples)
          const u1 = Math.random();
          const u2 = Math.random();
          const g = Math.sqrt(-2 * Math.log(u1 || 0.0001)) * Math.cos(2 * Math.PI * u2);
          const offsetY = g * (bandWidth / 3);
          y =
            bandCenterY +
            offsetY +
            (x - width / 2) * Math.tan(bandAngle) * 0.15;
          y = Math.max(0, Math.min(height, y));
        } else {
          x = Math.random() * width;
          y = Math.random() * height;
        }

        const depth = Math.random();
        const r = Math.random() * 1.2 + 0.2 + (depth > 0.85 ? Math.random() * 0.6 : 0);
        stars.push({
          x,
          y,
          r,
          depth,
          phase: Math.random() * Math.PI * 2,
          tspeed: 0.8 + Math.random() * 2.4,
          blue: Math.random() < 0.22,
          glint: Math.random() < 0.04 && depth > 0.6,
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
      nextShooterAt = now + 9000 + Math.random() * 14000;
    }

    function maybeSpawnSparkle(now: number) {
      if (reduce) return;
      if (now < nextSparkleAt) return;
      // Burst of 1–3 sparkles
      const burst = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < burst; i++) {
        sparkles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          life: 0,
          ttl: 0.9 + Math.random() * 0.9,
          size: 5 + Math.random() * 5,
          blue: Math.random() < 0.55,
        });
      }
      nextSparkleAt = now + 600 + Math.random() * 1400;
    }

    function drawCross(
      x: number,
      y: number,
      size: number,
      alpha: number,
      blue: boolean
    ) {
      ctx!.save();
      ctx!.translate(x, y);
      const color = blue ? "180, 210, 245" : "255, 255, 255";
      ctx!.strokeStyle = `rgba(${color}, ${alpha})`;
      ctx!.lineCap = "round";
      ctx!.lineWidth = 0.9;
      ctx!.beginPath();
      ctx!.moveTo(-size, 0);
      ctx!.lineTo(size, 0);
      ctx!.moveTo(0, -size);
      ctx!.lineTo(0, size);
      ctx!.stroke();
      // Inner glow dot
      const grad = ctx!.createRadialGradient(0, 0, 0, 0, 0, size * 0.6);
      grad.addColorStop(0, `rgba(${color}, ${alpha})`);
      grad.addColorStop(1, `rgba(${color}, 0)`);
      ctx!.fillStyle = grad;
      ctx!.beginPath();
      ctx!.arc(0, 0, size * 0.6, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
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
        const tw = reduce ? 1 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(s.phase));
        const opacity = tw * (0.4 + 0.7 * s.depth);
        const color = s.blue ? "125, 165, 220" : "245, 248, 255";

        // Core
        ctx!.fillStyle = `rgba(${color}, ${opacity})`;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r * (0.6 + s.depth), 0, Math.PI * 2);
        ctx!.fill();

        // Bloom
        if (s.r > 0.9 && s.depth > 0.55) {
          const grad = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 7);
          grad.addColorStop(0, `rgba(${color}, ${opacity * 0.40})`);
          grad.addColorStop(1, `rgba(${color}, 0)`);
          ctx!.fillStyle = grad;
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.r * 7, 0, Math.PI * 2);
          ctx!.fill();
        }

        // Diffraction cross on glint stars during bright twinkle peaks
        if (s.glint && tw > 0.85) {
          drawCross(s.x, s.y, s.r * 5, opacity * 0.85, s.blue);
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
        const tailLen = 110;
        const dx = -sh.vx;
        const dy = -sh.vy;
        const mag = Math.hypot(dx, dy) || 1;
        const ux = dx / mag;
        const uy = dy / mag;
        const tx = sh.x + ux * tailLen;
        const ty = sh.y + uy * tailLen;
        const grad = ctx!.createLinearGradient(sh.x, sh.y, tx, ty);
        grad.addColorStop(0, `rgba(190, 215, 245, ${headOpacity})`);
        grad.addColorStop(1, "rgba(190, 215, 245, 0)");
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.moveTo(sh.x, sh.y);
        ctx!.lineTo(tx, ty);
        ctx!.stroke();

        ctx!.fillStyle = `rgba(245,250,255,${headOpacity})`;
        ctx!.beginPath();
        ctx!.arc(sh.x, sh.y, 1.5, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Sparkle bursts (random little crosses fading in/out)
      maybeSpawnSparkle(now);
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sp = sparkles[i];
        sp.life += dt;
        const t = sp.life / sp.ttl;
        if (t >= 1) {
          sparkles.splice(i, 1);
          continue;
        }
        // Fade in then out
        const alpha = Math.sin(t * Math.PI) * 0.95;
        drawCross(sp.x, sp.y, sp.size, alpha, sp.blue);
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
            "radial-gradient(1200px 800px at 80% -10%, rgba(63,119,194,0.18), transparent 60%)," +
            "radial-gradient(1100px 700px at 5% 110%, rgba(123, 90, 200, 0.16), transparent 60%)," +
            "radial-gradient(700px 500px at 50% 30%, rgba(20, 30, 70, 0.55), transparent 70%)," +
            "linear-gradient(180deg, #050816 0%, #03050E 100%)",
        }}
      />
      {/* Slow-rotating nebula tint */}
      <div
        className="absolute inset-[-20%] opacity-70 motion-reduce:hidden animate-nebula"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, rgba(63,119,194,0.10), rgba(123,90,200,0.07), rgba(63,119,194,0.05), rgba(20,40,80,0.10), rgba(63,119,194,0.10))",
          filter: "blur(60px)",
        }}
      />
      {/* Soft galactic band glow */}
      <div
        className="absolute inset-0 opacity-40 motion-reduce:hidden"
        style={{
          background:
            "linear-gradient(110deg, transparent 30%, rgba(120, 160, 220, 0.08) 50%, transparent 70%)",
          filter: "blur(40px)",
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
