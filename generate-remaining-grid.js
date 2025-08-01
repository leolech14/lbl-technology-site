#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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

const REMAINING = [
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

async function generateImage(project) {
  console.log(`\n🎨 Generating: ${project.name}`);
  
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
      size: '1792x1024',
      quality: 'hd',
      style: 'vivid',
    }),
  });

  const data = await response.json();
  const imageUrl = data.data[0].url;
  
  console.log('  📥 Downloading...');
  const imageResponse = await fetch(imageUrl);
  const buffer = await imageResponse.arrayBuffer();
  
  await fs.writeFile(`./assets/generated/projects/${project.id}-grid.png`, Buffer.from(buffer));
  console.log(`  ✅ Saved!`);
}

async function main() {
  for (const project of REMAINING) {
    await generateImage(project);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Run optimization
  console.log('\n🔧 Optimizing all images...');
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);
  
  const allProjects = [
    'ai-content-platform', 'ecommerce-platform', 'data-visualization',
    'developer-tools', 'family-app', '3d-showcase'
  ];
  
  for (const id of allProjects) {
    await execAsync(`ffmpeg -i "./assets/generated/projects/${id}-grid.png" -vf "scale=1200:-1" -q:v 90 "./assets/generated/projects/${id}-grid-web.jpg"`);
    console.log(`  ✅ Optimized ${id}`);
  }
  
  console.log('\n✨ All done!');
}

main().catch(console.error);