
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
