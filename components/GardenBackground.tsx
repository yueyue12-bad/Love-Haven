'use client';

import React, { useEffect, useState, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  type: 'leaf' | 'petal' | 'sparkle' | 'butterfly';
  color: string;
  opacity: number;
}

interface GardenBackgroundProps {
  palette?: string;
  speed?: 'slow' | 'normal' | 'paused';
  butterflies?: boolean;
}

export default function GardenBackground({
  palette = 'sakura',
  speed = 'slow',
  butterflies = true,
}: GardenBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    if (reducedMotion || speed === 'paused') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = {
      leaf: ['#d4a373', '#e07a5f', '#ddbea9', '#cb997e', '#a3b18a'],
      petal: ['#f8b4d9', '#fcc2d7', '#ffdeeb', '#eebbc3', '#fae1dd'],
      sparkle: ['#fff1c5', '#ffedd8', '#ffffff', '#faedcd'],
      butterfly: ['#e2d4f0', '#d0f4de', '#fde2e4', '#ffcad4'],
    };

    const particleCount = width < 768 ? 24 : 45;
    const particles: Particle[] = [];

    const speedMultiplier = speed === 'slow' ? 0.6 : 1.1;

    for (let i = 0; i < particleCount; i++) {
      const rand = Math.random();
      let type: 'leaf' | 'petal' | 'sparkle' | 'butterfly' = 'petal';
      if (rand < 0.35) type = 'leaf';
      else if (rand < 0.7) type = 'petal';
      else if (rand < 0.9) type = 'sparkle';
      else if (butterflies) type = 'butterfly';

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: type === 'butterfly' ? 12 : type === 'sparkle' ? 2 + Math.random() * 3 : 8 + Math.random() * 10,
        speedY: (type === 'sparkle' ? -0.2 : 0.4 + Math.random() * 0.7) * speedMultiplier,
        speedX: (Math.random() - 0.5) * (type === 'butterfly' ? 1.2 : 0.6) * speedMultiplier,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        type,
        color:
          type === 'leaf'
            ? colors.leaf[Math.floor(Math.random() * colors.leaf.length)]
            : type === 'petal'
            ? colors.petal[Math.floor(Math.random() * colors.petal.length)]
            : type === 'sparkle'
            ? colors.sparkle[Math.floor(Math.random() * colors.sparkle.length)]
            : colors.butterfly[Math.floor(Math.random() * colors.butterfly.length)],
        opacity: type === 'sparkle' ? 0.4 + Math.random() * 0.5 : 0.3 + Math.random() * 0.45,
      });
    }

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick++;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Draw particle based on type
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'leaf') {
          // Leaf shape
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
          ctx.fill();
        } else if (p.type === 'petal') {
          // Soft petal shape
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(p.size * 0.6, -p.size, p.size, 0);
          ctx.quadraticCurveTo(p.size * 0.6, p.size, 0, 0);
          ctx.fill();
        } else if (p.type === 'sparkle') {
          // Glowing fairy dust
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'butterfly') {
          // Butterfly with fluttering wings
          const flap = Math.sin(tick * 0.08 + i) * 0.8 + 0.2;
          ctx.fillStyle = p.color;
          // Left wing
          ctx.beginPath();
          ctx.ellipse(-p.size * 0.5 * Math.abs(flap), 0, p.size * 0.6 * Math.abs(flap), p.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
          // Right wing
          ctx.beginPath();
          ctx.ellipse(p.size * 0.5 * Math.abs(flap), 0, p.size * 0.6 * Math.abs(flap), p.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
          // Body
          ctx.fillStyle = '#9c6644';
          ctx.beginPath();
          ctx.ellipse(0, 0, 1.5, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Update positions
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(tick * 0.02 + i) * 0.3;
        p.rotation += p.rotationSpeed;

        // Reset if out of screen
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        } else if (p.y < -30 && p.type === 'sparkle') {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion, speed, butterflies]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Soft botanical ambient gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-rose-100/35 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 left-1/4 w-[32rem] h-[32rem] bg-purple-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-50/40 rounded-full blur-3xl" />

      {/* Decorative corner florals */}
      <div className="absolute top-3 left-3 text-pink-300/40 text-2xl select-none">
        🌿 🌸
      </div>
      <div className="absolute top-3 right-3 text-rose-300/40 text-2xl select-none">
        🌸 🦋
      </div>

      {/* Canvas for dynamic leaves & petals */}
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
