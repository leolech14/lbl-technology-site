
import React from 'react';

export default function DarkPortfolioHero() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f0f0f0' }}>
      
<style>
:root {
    --bg-primary: #0a0a0f;
    --bg-secondary: #0f1117;
    --bg-tertiary: #1a1a2e;
    --blue-primary: #3b82f6;
    --blue-light: #60a5fa;
    --blue-dark: #1e40af;
    --accent-orange: #f97316;
    --glass-bg: rgba(255, 255, 255, 0.05);
    --glass-border: rgba(255, 255, 255, 0.1);
    --text-primary: #f0f0f0;
    --text-secondary: #a8a8b3;
}

body {
    background: var(--bg-primary) !important;
    color: var(--text-primary) !important;
    font-family: 'Inter', sans-serif !important;
    margin: 0;
    padding: 0;
}

.glass {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 2rem;
}

.gradient-text {
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

@keyframes pulse-glow {
    0%, 100% { text-shadow: 0 0 20px rgba(96, 165, 250, 0.5); }
    50% { text-shadow: 0 0 30px rgba(96, 165, 250, 0.8), 0 0 40px rgba(59, 130, 246, 0.5); }
}

.ai-tagline {
    animation: pulse-glow 3s ease-in-out infinite;
}
</style>

      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            Building <span className="gradient-text">Premium Digital Experiences</span> with AI & Modern Tech
          </h1>
          <p className="ai-tagline" style={{ fontSize: '1.5rem', color: '#60a5fa', fontWeight: '600', marginBottom: '1rem' }}>
            AI-Native Builder • Will turn 2025 into 1995
          </p>
          <p style={{ fontSize: '1.125rem', color: '#a8a8b3', maxWidth: '600px', margin: '0 auto' }}>
            Full-stack architect specializing in TypeScript, React, and AI-powered solutions.
          </p>
        </div>
      </section>
    </div>
  );
}
