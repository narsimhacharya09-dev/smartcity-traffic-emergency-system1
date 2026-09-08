import React, { useEffect, useRef } from 'react';

export default function CloudCanvas({ className = '', particleCount = 45 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    // Mouse tracker
    const mouse = {
      x: width / 2,
      y: height / 2,
      radius: 120
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    canvas.parentElement.addEventListener('mousemove', handleMouseMove);

    // Nodes array
    const nodes = [];
    for (let i = 0; i < particleCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1.5,
        baseAlpha: Math.random() * 0.5 + 0.3,
        pulse: Math.random() * Math.PI * 2
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint cloud circle ambient backings
      const time = Date.now() * 0.001;
      const cloudX = width * 0.5 + Math.sin(time * 0.5) * 20;
      const cloudY = height * 0.5 + Math.cos(time * 0.5) * 15;

      const radialGrad = ctx.createRadialGradient(
        cloudX, cloudY, 10,
        cloudX, cloudY, Math.min(width, height) * 0.45
      );
      radialGrad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
      radialGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.08)');
      radialGrad.addColorStop(1, 'rgba(7, 12, 24, 0)');

      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, Math.min(width, height) * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Update & Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Move node
        node.x += node.vx;
        node.y += node.vy;

        // Bounce bounds
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        node.pulse += 0.03;
        const currentRadius = node.radius + Math.sin(node.pulse) * 0.8;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, ' + (node.baseAlpha + Math.sin(node.pulse) * 0.2) + ')';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#06b6d4';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.35;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Mouse connection force
        const mdx = node.x - mouse.x;
        const mdy = node.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < mouse.radius) {
          const mAlpha = (1 - mdist / mouse.radius) * 0.5;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${mAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (canvas.parentElement) {
        canvas.parentElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [particleCount]);

  return <canvas ref={canvasRef} className={`cloud-canvas ${className}`} style={{ width: '100%', height: '100%', display: 'block' }} />;
}
