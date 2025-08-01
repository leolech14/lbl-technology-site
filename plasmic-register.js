// Register your dark portfolio as a code component in Plasmic

const { exec } = require('child_process');
const fs = require('fs');

console.log('📦 Registering your dark portfolio as a Plasmic code component...\n');

// Create a proper React component file
const darkPortfolioComponent = `
import React from 'react';
import './DarkPortfolio.css';

export function DarkPortfolio() {
  return (
    <div className="dark-portfolio">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Building <span className="gradient-text">Premium Digital Experiences</span>
            <br />with AI & Modern Tech
          </h1>
          <p className="ai-tagline">
            AI-Native Builder • Will turn 2025 into 1995
          </p>
          <p className="hero-description">
            Full-stack architect specializing in TypeScript, React, and AI-powered solutions.
          </p>
          
          <div className="stats-grid">
            <div className="stat-card glass">
              <div className="stat-number">10+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-card glass">
              <div className="stat-number">50+</div>
              <div className="stat-label">Projects Delivered</div>
            </div>
            <div className="stat-card glass">
              <div className="stat-number">15+</div>
              <div className="stat-label">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

DarkPortfolio.displayName = 'DarkPortfolio';

// Register with Plasmic
export const DarkPortfolioMeta = {
  name: 'DarkPortfolio',
  displayName: 'Dark Portfolio',
  props: {},
  importPath: './components/DarkPortfolio',
  importName: 'DarkPortfolio',
  isDefaultExport: false,
};
`;

const darkPortfolioCSS = `
.dark-portfolio {
  min-height: 100vh;
  background: #0a0a0f;
  color: #f0f0f0;
  font-family: 'Inter', -apple-system, sans-serif;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.3) 0%, transparent 50%);
  animation: float 20s infinite ease-in-out;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(30px, -30px) rotate(180deg); }
}

.hero-content {
  text-align: center;
  max-width: 1200px;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.ai-tagline {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #60a5fa;
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { text-shadow: 0 0 20px rgba(96, 165, 250, 0.5); }
  50% { text-shadow: 0 0 30px rgba(96, 165, 250, 0.8), 0 0 40px rgba(59, 130, 246, 0.5); }
}

.hero-description {
  font-size: 1.125rem;
  color: #a8a8b3;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.stats-grid {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.stat-card {
  padding: 1.5rem 2rem;
  text-align: center;
}

.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.glass:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #a8a8b3;
  font-size: 0.875rem;
}
`;

// Write the component files
fs.writeFileSync('components/DarkPortfolio.jsx', darkPortfolioComponent);
fs.writeFileSync('components/DarkPortfolio.css', darkPortfolioCSS);

console.log('✅ Created DarkPortfolio component files\n');

// Create a registration file for Plasmic
const plasmicRegister = `
// This file registers your component with Plasmic
export { DarkPortfolio, DarkPortfolioMeta } from './DarkPortfolio';
`;

fs.writeFileSync('components/plasmic-register.js', plasmicRegister);

console.log('📝 Component created! Now:\n');
console.log('1. In Plasmic Studio, click "Code Components" in the left sidebar');
console.log('2. Click "Register component"');
console.log('3. Import path: ./components/DarkPortfolio');
console.log('4. Component name: DarkPortfolio');
console.log('5. Save and use it in your design!\n');

// Alternative: Try to push via CLI
console.log('Attempting to sync with Plasmic...');
exec('plasmic sync --yes', (error, stdout, stderr) => {
  if (error) {
    console.error('Sync error:', error);
    return;
  }
  console.log(stdout);
});