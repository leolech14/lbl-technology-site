#!/usr/bin/env node

/**
 * Generate Project Images using DALL-E 3
 * Creates glassmorphic project visuals matching website aesthetic
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import dotenv from 'dotenv';

// Load from .env.local first, then .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ OpenAI API key not found. Please set OPENAI_API_KEY in .env.local');
  process.exit(1);
}

// Base style for all project images
const BASE_STYLE = `Dark glassmorphic style, background color #0a0a0f to #0f1117 gradient,
Blue (#3b82f6) and light blue (#60a5fa) accents with subtle orange (#f97316) highlights,
Minimalist, modern, premium aesthetic, clean geometric shapes,
Transparent glass panels with blur effects, subtle glows and shadows,
No text or labels, abstract representation`;

const PROJECTS = [
  {
    id: 'ai-content-platform',
    name: 'AI Content Creation Platform',
    prompt: `${BASE_STYLE}
    Concept: AI-powered media generation interface
    Elements: Neural network visualization, floating content panels, video/image frames
    Colors: Dominant purple-blue gradient with AI energy flows
    Style: Futuristic dashboard with glassmorphic panels showing content generation`,
  },
  {
    id: 'ecommerce-platform',
    name: 'Premium E-Commerce Platform',
    prompt: `${BASE_STYLE}
    Concept: Luxury marketplace interface
    Elements: Floating product cards, diamond/gem motifs, shopping interface elements
    Colors: Blue glass panels with orange accent highlights
    Style: Premium shopping experience with glassmorphic product showcases`,
  },
  {
    id: 'data-visualization',
    name: 'Interactive Data Visualization',
    prompt: `${BASE_STYLE}
    Concept: Complex data analytics dashboard
    Elements: 3D charts, flowing data streams, interactive graph nodes
    Colors: Blue gradient with data points in various blue shades
    Style: Advanced analytics interface with floating visualization panels`,
  },
  {
    id: 'developer-tools',
    name: 'Developer Productivity Suite',
    prompt: `${BASE_STYLE}
    Concept: AI-enhanced coding environment
    Elements: Code editor panels, automation flows, lightning-fast processes
    Colors: Dark theme with green and blue syntax highlighting accents
    Style: Modern IDE interface with glassmorphic tool panels`,
  },
  {
    id: 'family-app',
    name: 'Family Management App',
    prompt: `${BASE_STYLE}
    Concept: Family organization mobile interface
    Elements: Location pins, calendar views, notification bubbles, family connections
    Colors: Warm blue tones with soft pink/orange family-friendly accents
    Style: Mobile app interface with glassmorphic cards and maps`,
  },
  {
    id: '3d-showcase',
    name: '3D Product Showcase',
    prompt: `${BASE_STYLE}
    Concept: Interactive 3D product viewer
    Elements: Rotating 3D object, lighting controls, material previews
    Colors: Purple-blue gradient with dynamic lighting effects
    Style: WebGL-powered interface with glassmorphic control panels`,
  },
];

async function generateProjectImage(project) {
  console.log(`\n🎨 Generating image for: ${project.name}`);
  
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
        size: '1024x1024',
        quality: 'hd',
        style: 'natural',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${error}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    
    console.log('  📥 Downloading image...');
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    
    const outputDir = './assets/generated/projects';
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputPath = `${outputDir}/${project.id}.png`;
    await fs.writeFile(outputPath, Buffer.from(buffer));
    
    console.log(`  ✅ Saved to ${outputPath}`);
    return true;
    
  } catch (error) {
    console.error(`  ❌ Failed: ${error.message}`);
    return false;
  }
}

async function optimizeImages() {
  console.log('\n🔧 Optimizing images for web...');
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);
  
  for (const project of PROJECTS) {
    try {
      const inputPath = `./assets/generated/projects/${project.id}.png`;
      const outputPath = `./assets/generated/projects/${project.id}-optimized.jpg`;
      
      // Convert to JPEG with optimization
      await execAsync(`ffmpeg -i "${inputPath}" -vf "scale=800:600" -q:v 85 "${outputPath}"`);
      console.log(`  ✅ Optimized ${project.id}`);
    } catch (error) {
      console.error(`  ❌ Failed to optimize ${project.id}`);
    }
  }
}

async function updateProjectCards() {
  console.log('\n📝 Creating integration script...');
  
  const integrationScript = `
// Update project cards with generated images
document.addEventListener('DOMContentLoaded', () => {
  const projectImages = {
    'AI Content Creation Platform': 'ai-content-platform',
    'Premium E-Commerce Platform': 'ecommerce-platform', 
    'Interactive Data Visualization': 'data-visualization',
    'Developer Productivity Suite': 'developer-tools',
    'Family Management App': 'family-app',
    '3D Product Showcase': '3d-showcase'
  };
  
  document.querySelectorAll('.project-card').forEach((card, index) => {
    const title = card.querySelector('h3')?.textContent;
    const imageId = projectImages[title];
    
    if (imageId) {
      const projectImage = card.querySelector('.project-image');
      if (projectImage) {
        // Replace emoji with actual image
        projectImage.innerHTML = \`
          <img src="assets/generated/projects/\${imageId}-optimized.jpg" 
               alt="\${title}"
               loading="lazy"
               style="width: 100%; height: 100%; object-fit: cover;">
        \`;
      }
    }
  });
});`;

  await fs.writeFile('./project-images-integration.js', integrationScript);
  console.log('  ✅ Created integration script');
}

async function main() {
  console.log('🚀 Starting project image generation...');
  console.log('📐 Creating glassmorphic project visuals\n');
  
  const results = [];
  
  for (const project of PROJECTS) {
    const success = await generateProjectImage(project);
    results.push({ name: project.name, success });
    
    // Rate limiting - wait between requests
    if (project !== PROJECTS[PROJECTS.length - 1]) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  // Optimize images
  await optimizeImages();
  
  // Create integration script
  await updateProjectCards();
  
  // Summary
  console.log('\n📊 Generation Summary:');
  results.forEach(r => {
    console.log(`  ${r.success ? '✅' : '❌'} ${r.name}`);
  });
  
  const successful = results.filter(r => r.success).length;
  console.log(`\n✨ Completed: ${successful}/${results.length} project images generated`);
  
  if (successful > 0) {
    console.log('\n📋 Next steps:');
    console.log('1. Add <script src="project-images-integration.js"></script> to index.html');
    console.log('2. Or manually update project cards with the generated images');
    console.log('3. Images are in assets/generated/projects/');
  }
}

main().catch(console.error);