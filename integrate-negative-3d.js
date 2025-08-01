#!/usr/bin/env node

/**
 * Integrate Negative 3D Space CSS Effects into index.html
 */

import fs from 'fs/promises';

async function integrateNegative3D() {
  console.log('🎨 Integrating negative 3D space effects...');
  
  const indexPath = './index.html';
  const html = await fs.readFile(indexPath, 'utf-8');
  
  // Add negative 3D styles after the existing icon styles
  const negative3DStyles = `
        
        /* Negative 3D Space Effects for Feature Icons */
        .feature-icon {
            transform-style: preserve-3d;
            perspective: 200px;
        }
        
        .icon-3d-wrapper {
            width: 48px;
            height: 48px;
            position: relative;
            transform-style: preserve-3d;
            animation: rotate3DSubtle 20s linear infinite;
        }
        
        @keyframes rotate3DSubtle {
            0% { transform: rotateY(0deg) rotateX(5deg); }
            100% { transform: rotateY(360deg) rotateX(5deg); }
        }
        
        .feature-card:hover .icon-3d-wrapper {
            animation-duration: 3s;
        }
        
        /* Negative space base */
        .icon-negative {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Perspective grid overlay */
        .icon-grid {
            position: absolute;
            inset: -50%;
            background-image: 
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
            background-size: 10px 10px;
            transform: rotateX(60deg) translateZ(-20px);
            opacity: 0.3;
            animation: gridFlow 30s linear infinite;
        }
        
        @keyframes gridFlow {
            0% { background-position: 0 0; }
            100% { background-position: 10px 10px; }
        }
        
        /* Inset shadow for depth */
        .icon-rocket, .icon-ai, .icon-diamond, .icon-chart, .icon-lightning, .icon-shield {
            position: relative;
            z-index: 2;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }
        
        /* Rocket - Negative space enhancement */
        .icon-rocket {
            box-shadow: 
                inset 0 2px 8px rgba(59, 130, 246, 0.3),
                inset 0 -2px 8px rgba(59, 130, 246, 0.2);
        }
        
        .icon-rocket::after {
            content: '';
            position: absolute;
            inset: -20%;
            background: radial-gradient(circle at 50% 100%, 
                rgba(59, 130, 246, 0.2) 0%, 
                transparent 50%);
            z-index: -1;
            animation: rocketGlow 3s ease-in-out infinite;
        }
        
        @keyframes rocketGlow {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        /* AI Brain - Hollow effect */
        .icon-ai {
            background: transparent;
            box-shadow: 
                inset 0 0 12px rgba(96, 165, 250, 0.4),
                inset 0 0 24px rgba(96, 165, 250, 0.2);
        }
        
        /* Diamond - Faceted depth */
        .icon-diamond {
            box-shadow: 
                inset 2px 2px 8px rgba(59, 130, 246, 0.4),
                inset -2px -2px 8px rgba(59, 130, 246, 0.3);
        }
        
        .icon-diamond::after {
            content: '';
            position: absolute;
            inset: 30%;
            background: transparent;
            border: 1px solid rgba(59, 130, 246, 0.3);
            transform: rotate(45deg);
        }
        
        /* Chart - Hollow bars */
        .icon-chart span {
            box-shadow: 
                inset 0 2px 6px rgba(96, 165, 250, 0.3),
                inset 0 -2px 6px rgba(96, 165, 250, 0.2);
            background: linear-gradient(to top, 
                var(--blue-light), 
                transparent 50%, 
                var(--blue-light));
        }
        
        /* Lightning - Electric void */
        .icon-lightning {
            box-shadow: 
                inset 0 0 16px rgba(249, 115, 22, 0.4),
                inset 0 0 32px rgba(249, 115, 22, 0.2);
            filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.5));
        }
        
        /* Shield - Protective cavity */
        .icon-shield {
            box-shadow: 
                inset 0 4px 12px rgba(59, 130, 246, 0.4),
                inset 0 -4px 12px rgba(59, 130, 246, 0.2);
        }
        
        .icon-shield::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 1px;
            background: linear-gradient(90deg, 
                transparent, 
                var(--blue-primary), 
                transparent);
            top: 30%;
            left: 0;
            animation: shieldScan 4s linear infinite;
            opacity: 0.5;
        }
        
        @keyframes shieldScan {
            0%, 100% { transform: translateY(-10px); opacity: 0; }
            50% { transform: translateY(10px); opacity: 1; }
        }`;
  
  // Find where to insert the styles (after the icon definitions)
  const insertPoint = html.indexOf('/* Animated backgrounds for feature cards */');
  
  if (insertPoint === -1) {
    console.error('❌ Could not find insertion point for styles');
    return false;
  }
  
  // Insert the new styles
  const updatedHtml = html.slice(0, insertPoint) + negative3DStyles + '\n        ' + html.slice(insertPoint);
  
  // Update the feature card HTML structure to include 3D wrappers
  const featureCards = [
    { icon: 'icon-rocket', name: 'full-stack' },
    { icon: 'icon-ai', name: 'ai-integration' },
    { icon: 'icon-diamond', name: 'premium-ui' },
    { icon: 'icon-chart', name: 'data-viz', hasChildren: true },
    { icon: 'icon-lightning', name: 'performance' },
    { icon: 'icon-shield', name: 'security' }
  ];
  
  let finalHtml = updatedHtml;
  
  // Update each feature card to wrap icons in 3D container
  featureCards.forEach(card => {
    const oldPattern = card.hasChildren 
      ? `<div class="feature-icon">
                    <div class="${card.icon}">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>`
      : `<div class="feature-icon">
                    <div class="${card.icon}"></div>
                </div>`;
    
    const newPattern = card.hasChildren
      ? `<div class="feature-icon">
                    <div class="icon-3d-wrapper">
                        <div class="icon-grid"></div>
                        <div class="icon-negative">
                            <div class="${card.icon}">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>`
      : `<div class="feature-icon">
                    <div class="icon-3d-wrapper">
                        <div class="icon-grid"></div>
                        <div class="icon-negative">
                            <div class="${card.icon}"></div>
                        </div>
                    </div>
                </div>`;
    
    finalHtml = finalHtml.replace(oldPattern, newPattern);
  });
  
  // Write the updated file
  await fs.writeFile(indexPath, finalHtml);
  
  console.log('✅ Negative 3D space effects integrated successfully!');
  console.log('\n📋 Features added:');
  console.log('  • 3D rotation on all icons');
  console.log('  • Perspective grid backgrounds');
  console.log('  • Inset shadows for depth');
  console.log('  • Glow effects matching icon themes');
  console.log('  • Hover interactions speed up rotation');
  
  return true;
}

// Run the integration
integrateNegative3D().catch(console.error);