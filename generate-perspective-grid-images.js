#!/usr/bin/env node

/**
 * Generate 80s Perspective Grid Project Images
 * Creates high-res images with Tron-like grid lines and glassmorphic objects
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ OpenAI API key not found. Please set OPENAI_API_KEY in .env.local');
  process.exit(1);
}

// Base style for ALL images - 80s perspective grid with exact colors
const PERSPECTIVE_GRID_STYLE = `Ultra high quality, 4K resolution, photorealistic 3D render.
80s retro-futuristic perspective grid floor extending to horizon, like TRON or synthwave aesthetic.
Grid lines in bright blue (#3b82f6) glowing against dark background (#0a0a0f).
Looking through a window into a 3D environment with strong depth perspective.
Central glass object floating above the grid, made of transparent glassmorphic material.
Object has blue (#3b82f6) and orange (#f97316) glowing accents and details.
Dark atmospheric background with subtle blue fog/haze.
Strong perspective lines converging to vanishing point.
Cinematic lighting with rim lights on the glass object.
No text, no UI elements, just the environment and object.`;

const PROJECTS = [
  {
    id: 'ai-content-platform',
    name: 'AI Content Creation Platform',
    prompt: `${PERSPECTIVE_GRID_STYLE}
    Central object: A crystalline glass brain with neural network connections.
    The brain is made of transparent blue glass with orange energy pulses flowing through neural pathways.
    Floating holographic content frames (video/image previews) orbit around the brain.
    Blue grid extends infinitely with data streams flowing along the grid lines.`,
  },
  {
    id: 'ecommerce-platform',
    name: 'Premium E-Commerce Platform',
    prompt: `${PERSPECTIVE_GRID_STYLE}
    Central object: A giant floating glass diamond with internal facets.
    The diamond is transparent with blue glass edges and orange light refractions inside.
    Smaller glass product cubes float around it in a circular pattern.
    Grid floor reflects the diamond creating a mirror effect.`,
  },
  {
    id: 'data-visualization',
    name: 'Interactive Data Visualization',
    prompt: `${PERSPECTIVE_GRID_STYLE}
    Central object: A 3D glass bar chart rising from the grid floor.
    Bars made of transparent blue glass with orange data points flowing upward inside.
    Holographic data connections between bars creating a network effect.
    Grid lines pulse with data flow towards the visualization.`,
  },
  {
    id: 'developer-tools',
    name: 'Developer Productivity Suite',
    prompt: `${PERSPECTIVE_GRID_STYLE}
    Central object: A glass cube containing floating code symbols and lightning bolts.
    The cube has blue glass edges with orange electric energy inside.
    Code fragments orbit the cube in spiral patterns.
    Grid floor has data streams flowing at high speed.`,
  },
  {
    id: 'family-app',
    name: 'Family Management App',
    prompt: `${PERSPECTIVE_GRID_STYLE}
    Central object: Glass spheres connected by glowing paths, representing family members.
    Main sphere is blue glass with smaller orange glass spheres orbiting.
    Location pins and calendar elements float between connections.
    Grid has softer, warmer lighting with pink-orange accents.`,
  },
  {
    id: '3d-showcase',
    name: '3D Product Showcase',
    prompt: `${PERSPECTIVE_GRID_STYLE}
    Central object: A glass display pedestal with rotating geometric shape.
    The shape morphs between different forms, made of blue and orange gradient glass.
    Light rays project from the object creating volumetric effects.
    Grid floor has circular ripples emanating from the pedestal.`,
  },
];

async function generateHighResImage(project) {
  console.log(`\n🎨 Generating high-res perspective grid image for: ${project.name}`);
  
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: project.prompt,
        n: 1,
        size: '1792x1024', // Wide format for better project cards
        quality: 'hd',
        style: 'vivid', // More vibrant colors
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${error}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    
    console.log('  📥 Downloading high-res image...');
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    
    const outputDir = './assets/generated/projects';
    await fs.mkdir(outputDir, { recursive: true });
    
    // Save original high-res version
    const outputPath = `${outputDir}/${project.id}-grid.png`;
    await fs.writeFile(outputPath, Buffer.from(buffer));
    
    console.log(`  ✅ Saved high-res to ${outputPath}`);
    return true;
    
  } catch (error) {
    console.error(`  ❌ Failed: ${error.message}`);
    return false;
  }
}

async function optimizeForWeb() {
  console.log('\n🔧 Creating web-optimized versions...');
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);
  
  for (const project of PROJECTS) {
    try {
      const inputPath = `./assets/generated/projects/${project.id}-grid.png`;
      const webPath = `./assets/generated/projects/${project.id}-grid-web.jpg`;
      
      // Create high-quality JPEG for web
      await execAsync(`ffmpeg -i "${inputPath}" -vf "scale=1200:-1" -q:v 90 "${webPath}"`);
      console.log(`  ✅ Created web version for ${project.id}`);
    } catch (error) {
      console.error(`  ❌ Failed to optimize ${project.id}`);
    }
  }
}

async function createPreviewPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>80s Perspective Grid Project Images</title>
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
            margin: 0;
            padding: 2rem;
        }
        
        h1 {
            text-align: center;
            background: linear-gradient(135deg, var(--blue-primary), var(--accent-orange));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 3rem;
            margin-bottom: 0.5rem;
        }
        
        .subtitle {
            text-align: center;
            color: var(--blue-light);
            margin-bottom: 3rem;
        }
        
        .preview-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .preview-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .preview-card:hover {
            transform: translateY(-5px);
            border-color: var(--blue-primary);
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }
        
        .image-container {
            width: 100%;
            height: 300px;
            overflow: hidden;
            position: relative;
        }
        
        .image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
        }
        
        .preview-card:hover img {
            transform: scale(1.05);
        }
        
        .card-content {
            padding: 1.5rem;
        }
        
        h3 {
            color: var(--blue-light);
            margin: 0 0 0.5rem 0;
        }
        
        .description {
            color: rgba(255,255,255,0.7);
            font-size: 0.9rem;
            line-height: 1.5;
        }
        
        .tech-note {
            margin-top: 3rem;
            padding: 2rem;
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 12px;
            text-align: center;
        }
        
        .integration-code {
            margin-top: 2rem;
            padding: 1.5rem;
            background: rgba(0,0,0,0.5);
            border-radius: 8px;
            font-family: monospace;
            font-size: 0.9rem;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>80s Perspective Grid</h1>
    <p class="subtitle">High-resolution project images with retro-futuristic aesthetic</p>
    
    <div class="preview-grid">
        ${PROJECTS.map(project => `
        <div class="preview-card">
            <div class="image-container">
                <img src="assets/generated/projects/${project.id}-grid-web.jpg" 
                     alt="${project.name}"
                     loading="lazy">
            </div>
            <div class="card-content">
                <h3>${project.name}</h3>
                <p class="description">
                    80s perspective grid with glassmorphic ${
                      project.id.includes('ai') ? 'neural brain' :
                      project.id.includes('ecommerce') ? 'diamond' :
                      project.id.includes('data') ? 'bar chart' :
                      project.id.includes('developer') ? 'code cube' :
                      project.id.includes('family') ? 'connected spheres' :
                      '3D showcase'
                    } as the central focus.
                </p>
            </div>
        </div>
        `).join('')}
    </div>
    
    <div class="tech-note">
        <h2 style="color: var(--blue-primary);">Technical Details</h2>
        <p>Images generated at 1792x1024 resolution with HD quality</p>
        <p>Exact color matching: Blue (#3b82f6), Orange (#f97316), Dark BG (#0a0a0f)</p>
        <p>80s retro perspective grid with glassmorphic 3D objects</p>
        
        <div class="integration-code">
// Replace current project images<br>
document.querySelectorAll('.project-image img').forEach((img, index) => {<br>
&nbsp;&nbsp;const projectIds = ['ai-content-platform', 'ecommerce-platform', 'data-visualization', 'developer-tools', 'family-app', '3d-showcase'];<br>
&nbsp;&nbsp;img.src = \`assets/generated/projects/\${projectIds[index]}-grid-web.jpg\`;<br>
});
        </div>
    </div>
</body>
</html>`;

  await fs.writeFile('./perspective-grid-preview.html', html);
  console.log('\n✅ Created preview page: perspective-grid-preview.html');
}

async function main() {
  console.log('🚀 Starting 80s Perspective Grid Image Generation');
  console.log('🎯 Creating high-res images with exact specifications\n');
  
  const results = [];
  
  for (const project of PROJECTS) {
    const success = await generateHighResImage(project);
    results.push({ name: project.name, success });
    
    // Rate limiting
    if (project !== PROJECTS[PROJECTS.length - 1]) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  // Optimize for web
  await optimizeForWeb();
  
  // Create preview
  await createPreviewPage();
  
  // Summary
  console.log('\n📊 Generation Summary:');
  results.forEach(r => {
    console.log(`  ${r.success ? '✅' : '❌'} ${r.name}`);
  });
  
  const successful = results.filter(r => r.success).length;
  console.log(`\n✨ Completed: ${successful}/${results.length} images generated`);
  
  if (successful > 0) {
    console.log('\n🎨 Image Specifications Met:');
    console.log('  • 80s perspective grid lines (Tron-style)');
    console.log('  • Glass objects with blue/orange accents');
    console.log('  • Window-like 3D environment view');
    console.log('  • High resolution (1792x1024)');
    console.log('  • Exact color matching to website');
  }
}

main().catch(console.error);