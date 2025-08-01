#!/usr/bin/env node

/**
 * Integrate DALL-E 3 Generated Icons
 * Replaces CSS icons with AI-generated negative 3D space icons
 */

import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const ICON_MAPPING = [
  { dalle: 'rocket-3d', feature: 'full-stack', name: 'Full-Stack Development' },
  { dalle: 'brain-3d', feature: 'ai-integration', name: 'AI Integration' },
  { dalle: 'diamond-3d', feature: 'premium-ui', name: 'Premium UI/UX' },
  { dalle: 'chart-3d', feature: 'data-viz', name: 'Data Visualization' },
  { dalle: 'lightning-3d', feature: 'performance', name: 'Performance Optimization' },
  { dalle: 'shield-3d', feature: 'security', name: 'Security & Architecture' },
];

async function optimizeImages() {
  console.log('🖼️  Optimizing DALL-E images for web...\n');
  
  for (const icon of ICON_MAPPING) {
    const inputPath = `./assets/generated/dalle/${icon.dalle}.png`;
    const outputPath = `./assets/generated/dalle/${icon.dalle}-optimized.png`;
    const smallPath = `./assets/generated/dalle/${icon.dalle}-48.png`;
    
    try {
      // Create optimized version
      await execAsync(`ffmpeg -i "${inputPath}" -vf "scale=256:256" -pix_fmt yuv420p "${outputPath}"`);
      console.log(`✅ Optimized ${icon.dalle}`);
      
      // Create 48x48 version
      await execAsync(`ffmpeg -i "${inputPath}" -vf "scale=48:48" "${smallPath}"`);
      console.log(`✅ Created small version of ${icon.dalle}`);
    } catch (error) {
      console.error(`❌ Failed to optimize ${icon.dalle}: ${error.message}`);
    }
  }
}

async function updateHTML() {
  console.log('\n📝 Updating index.html...\n');
  
  const indexPath = './index.html';
  let html = await fs.readFile(indexPath, 'utf-8');
  
  // Add new styles for DALL-E icons
  const dalleStyles = `
        
        /* DALL-E 3 Negative Space Icons */
        .dalle-icon {
            width: 48px;
            height: 48px;
            position: relative;
            display: block;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }
        
        .dalle-icon img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            animation: float3D 6s ease-in-out infinite;
        }
        
        @keyframes float3D {
            0%, 100% { 
                transform: translateY(0) rotateY(0deg) scale(1);
            }
            25% {
                transform: translateY(-5px) rotateY(90deg) scale(1.05);
            }
            50% { 
                transform: translateY(-10px) rotateY(180deg) scale(1.1);
            }
            75% {
                transform: translateY(-5px) rotateY(270deg) scale(1.05);
            }
        }
        
        .feature-card:hover .dalle-icon {
            transform: scale(1.1);
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        
        .feature-card:hover .dalle-icon img {
            animation-duration: 2s;
        }`;
  
  // Insert styles after the negative 3D space styles
  const insertPoint = html.indexOf('/* Animated backgrounds for feature cards */');
  html = html.slice(0, insertPoint) + dalleStyles + '\n        ' + html.slice(insertPoint);
  
  // Replace each feature icon
  for (const icon of ICON_MAPPING) {
    // Find the feature card
    const featurePattern = new RegExp(
      `<div class="feature-icon">\\s*<div class="icon-3d-wrapper">\\s*<div class="icon-grid"></div>\\s*<div class="icon-negative">\\s*<div class="icon-[^"]+">.*?</div>\\s*</div>\\s*</div>\\s*</div>\\s*<h3>${icon.name}</h3>`,
      'gs'
    );
    
    const replacement = `<div class="feature-icon">
                    <div class="dalle-icon">
                        <img src="assets/generated/dalle/${icon.dalle}-48.png" 
                             alt="${icon.name}"
                             loading="lazy">
                    </div>
                </div>
                <h3>${icon.name}</h3>`;
    
    if (html.includes(icon.name)) {
      html = html.replace(featurePattern, replacement);
      console.log(`✅ Replaced icon for ${icon.name}`);
    }
  }
  
  await fs.writeFile(indexPath, html);
  console.log('\n✅ HTML updated successfully!');
}

async function createComparison() {
  const comparisonHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Icon Comparison: CSS vs DALL-E 3</title>
    <style>
        :root {
            --blue-primary: #3b82f6;
            --blue-light: #60a5fa;
            --accent-orange: #f97316;
            --bg-primary: #0a0a0f;
        }
        
        body {
            background: var(--bg-primary);
            color: white;
            font-family: system-ui;
            padding: 2rem;
            margin: 0;
        }
        
        h1 {
            text-align: center;
            background: linear-gradient(135deg, var(--blue-primary), var(--blue-light));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .comparison-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            max-width: 1200px;
            margin: 2rem auto;
        }
        
        .comparison-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 1.5rem;
            text-align: center;
        }
        
        .icon-row {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 2rem;
            margin: 1rem 0;
        }
        
        .icon-container {
            background: rgba(255,255,255,0.05);
            border-radius: 12px;
            padding: 1rem;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .dalle-icon {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .dalle-icon img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        h3 {
            color: var(--blue-light);
            margin-bottom: 1rem;
        }
        
        .label {
            font-size: 0.875rem;
            color: rgba(255,255,255,0.6);
            margin-top: 0.5rem;
        }
        
        /* Copy CSS icons from main site */
        .icon-rocket {
            width: 24px;
            height: 36px;
            background: var(--blue-primary);
            clip-path: polygon(50% 0%, 80% 40%, 65% 100%, 35% 100%, 20% 40%);
            position: relative;
        }
        
        .icon-ai {
            width: 36px;
            height: 36px;
            border: 3px solid var(--blue-light);
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            position: relative;
        }
        
        .icon-diamond {
            width: 36px;
            height: 36px;
            background: var(--blue-primary);
            transform: rotate(45deg);
        }
        
        .icon-chart {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: flex-end;
            gap: 4px;
        }
        
        .icon-chart span {
            flex: 1;
            background: var(--blue-light);
            height: 70%;
        }
        
        .icon-lightning {
            width: 24px;
            height: 36px;
            background: var(--accent-orange);
            clip-path: polygon(70% 0%, 30% 45%, 50% 45%, 20% 100%, 60% 55%, 40% 55%);
        }
        
        .icon-shield {
            width: 32px;
            height: 36px;
            background: var(--blue-primary);
            clip-path: polygon(50% 0%, 100% 25%, 100% 70%, 50% 100%, 0% 70%, 0% 25%);
        }
    </style>
</head>
<body>
    <h1>Icon Comparison: CSS vs DALL-E 3</h1>
    <p style="text-align: center; color: rgba(255,255,255,0.7);">
        Compare the simple CSS icons with AI-generated negative 3D space icons
    </p>
    
    <div class="comparison-grid">
        ${ICON_MAPPING.map(icon => `
        <div class="comparison-card">
            <h3>${icon.name}</h3>
            <div class="icon-row">
                <div>
                    <div class="icon-container">
                        <div class="${icon.feature === 'data-viz' ? 'icon-chart' : 'icon-' + icon.feature.split('-')[0]}">
                            ${icon.feature === 'data-viz' ? '<span></span><span></span><span></span><span></span>' : ''}
                        </div>
                    </div>
                    <div class="label">CSS Icon</div>
                </div>
                <div>
                    <div class="icon-container">
                        <div class="dalle-icon">
                            <img src="assets/generated/dalle/${icon.dalle}-48.png" alt="${icon.name}">
                        </div>
                    </div>
                    <div class="label">DALL-E 3</div>
                </div>
            </div>
        </div>
        `).join('')}
    </div>
    
    <div style="text-align: center; margin-top: 3rem;">
        <a href="index.html" style="color: var(--blue-light); text-decoration: none; padding: 0.75rem 2rem; border: 1px solid var(--blue-light); border-radius: 8px; display: inline-block;">
            View Live Site
        </a>
    </div>
</body>
</html>`;
  
  await fs.writeFile('./icon-comparison.html', comparisonHTML);
  console.log('\n✅ Created comparison page: icon-comparison.html');
}

async function main() {
  console.log('🚀 Integrating DALL-E 3 icons...\n');
  
  try {
    // Step 1: Optimize images
    await optimizeImages();
    
    // Step 2: Update HTML
    await updateHTML();
    
    // Step 3: Create comparison page
    await createComparison();
    
    console.log('\n✨ Integration complete!');
    console.log('\n📋 Next steps:');
    console.log('1. View icon-comparison.html to compare CSS vs DALL-E icons');
    console.log('2. Commit and push changes to see live on GitHub Pages');
    console.log('3. Toggle between CSS and DALL-E versions as needed');
    
  } catch (error) {
    console.error('❌ Integration failed:', error);
  }
}

main().catch(console.error);