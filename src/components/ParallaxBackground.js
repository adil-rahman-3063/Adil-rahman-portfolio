'use client';
import React, { useEffect, useRef } from 'react';

export default function ParallaxBackground({ scrollOffset }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    const draw = () => {
      if (!ctx) return;
      const width = canvas.width;
      const height = canvas.height;

      // Clear with background gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#1E100E'); // Extra dark espresso
      grad.addColorStop(0.5, '#281816'); // Warm coffee brown
      grad.addColorStop(1, '#1A0E0D'); // Shadow/dark edge
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 1. Grid layer (scrollOffset * 0.4)
      ctx.strokeStyle = 'rgba(59, 37, 33, 0.20)';
      ctx.lineWidth = 1.0;
      const gridSize = 40;
      const yOffsetGrid = -(scrollOffset * 0.4) % gridSize;

      // Draw vertical lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = yOffsetGrid; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Blueprint shape layer (scrollOffset * 0.15)
      ctx.strokeStyle = 'rgba(140, 115, 85, 0.04)';
      ctx.lineWidth = 2.0;

      const shape1Y = 300 - scrollOffset * 0.15;
      const shape2Y = 1200 - scrollOffset * 0.15;

      const shape1X = width * 0.15;
      const shape2X = width * 0.85;

      // Draw blueprint circle 1
      ctx.beginPath();
      ctx.arc(shape1X, shape1Y, 120, 0, 2 * Math.PI);
      ctx.stroke();

      // Cross-hairs 1
      ctx.beginPath();
      ctx.moveTo(shape1X - 140, shape1Y);
      ctx.lineTo(shape1X + 140, shape1Y);
      ctx.moveTo(shape1X, shape1Y - 140);
      ctx.lineTo(shape1X, shape1Y + 140);
      ctx.stroke();

      // Draw blueprint circle 2
      ctx.beginPath();
      ctx.arc(shape2X, shape2Y, 180, 0, 2 * Math.PI);
      ctx.stroke();

      // Cross-hairs 2
      ctx.beginPath();
      ctx.moveTo(shape2X - 200, shape2Y);
      ctx.lineTo(shape2X + 200, shape2Y);
      ctx.moveTo(shape2X, shape2Y - 200);
      ctx.lineTo(shape2X, shape2Y + 200);
      ctx.stroke();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // initial sizing

    // Redraw whenever scrollOffset changes
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollOffset]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
