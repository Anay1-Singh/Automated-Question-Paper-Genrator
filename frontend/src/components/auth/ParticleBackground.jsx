"use client";

import React, { useEffect, useRef } from "react";
import { useAuthTheme } from "./ThemeTransition";

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const { isDark } = useAuthTheme();
  
  // Track current color and target color for smooth theme transitions
  const themeColors = useRef({
    // Starting color (RGB values)
    r: isDark ? 255 : 0,
    g: isDark ? 255 : 0,
    b: isDark ? 255 : 0,
  });

  // Track mouse coordinates and activity
  const mouseRef = useRef({
    x: 0,
    y: 0,
    isActive: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let width = 0;
    let height = 0;

    // Configuration
    const baseSpeed = 0.25;
    const maxConnectDistance = 110;
    const attractionRadius = 160;
    const attractionStrength = 0.45; // Subtle steering speed toward mouse
    
    // Class representing a single particle node
    class Particle {
      constructor(w, h) {
        this.reset(w, h, true);
      }

      reset(w, h, startRandomly = false) {
        if (startRandomly) {
          this.x = Math.random() * w;
          this.y = Math.random() * h;
        } else {
          // Re-spawn on borders if moving off-screen
          const side = Math.floor(Math.random() * 4);
          if (side === 0) { // Top
            this.x = Math.random() * w;
            this.y = -5;
          } else if (side === 1) { // Right
            this.x = w + 5;
            this.y = Math.random() * h;
          } else if (side === 2) { // Bottom
            this.x = Math.random() * w;
            this.y = h + 5;
          } else { // Left
            this.x = -5;
            this.y = Math.random() * h;
          }
        }

        // Base floating velocities
        const angle = Math.random() * Math.PI * 2;
        this.baseVx = Math.cos(angle) * baseSpeed * (0.4 + Math.random() * 0.6);
        this.baseVy = Math.sin(angle) * baseSpeed * (0.4 + Math.random() * 0.6);
        
        // Active velocities
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        
        // Very tiny particles: 0.6px to 1.3px
        this.radius = 0.6 + Math.random() * 0.7;
        
        // Random opacity offset for organic breathing/glowing effect
        this.alpha = 0.15 + Math.random() * 0.4;
        this.pulseSpeed = 0.005 + Math.random() * 0.01;
        this.pulseDir = Math.random() > 0.5 ? 1 : -1;
      }

      update(w, h, mouse) {
        // Slow float logic
        let targetVx = this.baseVx;
        let targetVy = this.baseVy;

        // Interaction logic (Attraction to cursor)
        if (mouse.isActive) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < attractionRadius) {
            const force = (attractionRadius - dist) / attractionRadius;
            // Guide towards the cursor with gentle force
            targetVx += (dx / dist) * force * attractionStrength;
            targetVy += (dy / dist) * force * attractionStrength;
          }
        }

        // Smooth velocity interpolation for fluid feel
        this.vx += (targetVx - this.vx) * 0.05;
        this.vy += (targetVy - this.vy) * 0.05;

        this.x += this.vx;
        this.y += this.vy;

        // Boundary checks
        if (this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10) {
          this.reset(w, h, false);
        }

        // Subtly animate particle alpha for a cinematic breathing feel
        this.alpha += this.pulseSpeed * this.pulseDir;
        if (this.alpha > 0.65 || this.alpha < 0.15) {
          this.pulseDir *= -1;
        }
      }

      draw(cContext, colorString) {
        cContext.beginPath();
        cContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        cContext.fillStyle = colorString.replace("ALPHA", this.alpha.toFixed(2));
        cContext.fill();
      }
    }

    // Handle viewport resizing and responsive particle counts
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      // Responsive density: less particles on small screens
      let targetCount = Math.floor((width * height) / 10000);
      if (width < 768) {
        targetCount = Math.min(35, targetCount); // Mobile cap
      } else {
        targetCount = Math.min(110, Math.max(60, targetCount)); // Desktop boundary
      }

      // Smoothly update particle array length to prevent visual flash on resize
      if (particles.length < targetCount) {
        const toAdd = targetCount - particles.length;
        for (let i = 0; i < toAdd; i++) {
          particles.push(new Particle(width, height));
        }
      } else if (particles.length > targetCount) {
        particles.length = targetCount;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Mouse events
    const onMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isActive = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    // Animation loop
    const animate = () => {
      // Clear canvas (transparent, container div transitions background color)
      ctx.clearRect(0, 0, width, height);

      // 1. Interpolate particle color towards target color
      const targetR = isDark ? 255 : 0;
      const targetG = isDark ? 255 : 0;
      const targetB = isDark ? 255 : 0;

      const colors = themeColors.current;
      colors.r += (targetR - colors.r) * 0.04;
      colors.g += (targetG - colors.g) * 0.04;
      colors.b += (targetB - colors.b) * 0.04;

      const r = Math.round(colors.r);
      const g = Math.round(colors.g);
      const b = Math.round(colors.b);

      const colorString = `rgba(${r}, ${g}, ${b}, ALPHA)`;

      // Update particle positions
      const currentMouse = mouseRef.current;
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(width, height, currentMouse);
      }

      // Draw connecting lines (first to render behind nodes)
      ctx.lineWidth = 0.55;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDistance) {
            // Fades line opacity based on distance
            const alpha = ((maxConnectDistance - dist) / maxConnectDistance) * 0.14;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw(ctx, colorString);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanups
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
