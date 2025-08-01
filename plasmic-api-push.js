const fs = require('fs');

// Your Plasmic credentials
const PROJECT_ID = 'xfLZfGGmVxgqZrJoXmd1sY';
const API_TOKEN = 'PYy6hoybRCJx1ysP4SxRKgR68Qkokc8B0Iz7i1UtPDQJ8wXgQiLtzLi7XlrXA3le19Ikd8LEFwqNIyPtA';
const COMPONENT_ID = 'igsxWILZbzOs'; // Homepage component

// Read your HTML
const htmlContent = fs.readFileSync('index.html', 'utf8');

// Extract just the styles we need
const styles = `
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
`;

// Create the component structure for Plasmic
const plasmicComponent = {
  "tree": {
    "type": "vbox",
    "styles": {
      "root": {
        "minHeight": "100vh",
        "background": "#0a0a0f"
      }
    },
    "children": [
      {
        "type": "component",
        "component": "plasmic-embed",
        "props": {
          "code": styles + `
            <div style="min-height: 100vh; background: #0a0a0f; color: #f0f0f0; font-family: 'Inter', sans-serif;">
              <!-- Hero Section -->
              <section style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem;">
                <div style="text-align: center; max-width: 1200px;">
                  <h1 style="font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; margin-bottom: 1.5rem; line-height: 1.2;">
                    Building <span class="gradient-text">Premium Digital Experiences</span><br/>
                    with AI & Modern Tech
                  </h1>
                  <p class="ai-tagline" style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1.5rem; color: #60a5fa;">
                    AI-Native Builder • Will turn 2025 into 1995
                  </p>
                  <p style="font-size: 1.125rem; color: #a8a8b3; max-width: 700px; margin: 0 auto 3rem;">
                    Full-stack architect specializing in TypeScript, React, and AI-powered solutions. 
                    Creating beautiful, performant applications with a focus on glassmorphic design 
                    and exceptional user experiences.
                  </p>
                  
                  <!-- Stats -->
                  <div style="display: flex; gap: 3rem; justify-content: center; flex-wrap: wrap;">
                    <div class="glass" style="padding: 1.5rem 2rem;">
                      <div style="font-size: 2rem; font-weight: 700; color: #3b82f6;">10+</div>
                      <div style="color: #a8a8b3;">Years Experience</div>
                    </div>
                    <div class="glass" style="padding: 1.5rem 2rem;">
                      <div style="font-size: 2rem; font-weight: 700; color: #60a5fa;">50+</div>
                      <div style="color: #a8a8b3;">Projects Delivered</div>
                    </div>
                    <div class="glass" style="padding: 1.5rem 2rem;">
                      <div style="font-size: 2rem; font-weight: 700; color: #f97316;">15+</div>
                      <div style="color: #a8a8b3;">Happy Clients</div>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Quick Expertise Preview -->
              <section style="padding: 4rem 2rem;">
                <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem;">
                  <span class="gradient-text">Core Expertise</span>
                </h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto;">
                  <div class="glass">
                    <h3 style="color: #3b82f6; margin-bottom: 1rem;">React & TypeScript</h3>
                    <p style="color: #a8a8b3;">Building scalable, type-safe applications with modern React patterns</p>
                  </div>
                  <div class="glass">
                    <h3 style="color: #60a5fa; margin-bottom: 1rem;">AI Integration</h3>
                    <p style="color: #a8a8b3;">Implementing cutting-edge AI solutions and intelligent automation</p>
                  </div>
                  <div class="glass">
                    <h3 style="color: #f97316; margin-bottom: 1rem;">System Architecture</h3>
                    <p style="color: #a8a8b3;">Designing robust, scalable systems for enterprise applications</p>
                  </div>
                </div>
              </section>
            </div>
          `
        }
      }
    ]
  }
};

// Push to Plasmic API
async function pushToPlasmic() {
  console.log('🚀 Pushing your website to Plasmic...');
  
  try {
    const response = await fetch(`https://studio.plasmic.app/api/v1/projects/${PROJECT_ID}/components/${COMPONENT_ID}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        componentBundle: plasmicComponent,
        name: "Homepage",
        isPage: true
      })
    });
    
    if (response.ok) {
      console.log('✅ Successfully pushed to Plasmic!');
      console.log('🎨 Open Plasmic Studio to see your website');
      console.log(`📎 https://studio.plasmic.app/projects/${PROJECT_ID}`);
    } else {
      const error = await response.text();
      console.error('❌ Error:', error);
    }
  } catch (error) {
    console.error('❌ Failed:', error);
  }
}

// Alternative: Create via CLI
console.log('Attempting to update Homepage component via CLI...');
const { exec } = require('child_process');

// First, let's create a temporary component file
const componentContent = `
import React from 'react';

export default function DarkPortfolioHero() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f0f0f0' }}>
      ${styles}
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
`;

// Write the component
fs.writeFileSync('components/DarkPortfolioHero.jsx', componentContent);

console.log('✅ Created DarkPortfolioHero component');
console.log('📝 Next: Import this in Plasmic Studio as a code component');

// Try the API push
pushToPlasmic();