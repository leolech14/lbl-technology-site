#!/usr/bin/env node

// Quick script to generate remaining icons
import fs from 'fs/promises';
import fetch from 'node-fetch';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);
const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY || '7cc2cecd-62ee-422d-9252-f9073c5d2b25';

// Leonardo generation function
async function generateWithLeonardo(prompt, id) {
  console.log(`  🎨 Calling Leonardo AI...`);
  
  const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LEONARDO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      num_images: 1,
      width: 1024,
      height: 1024,
      guidance_scale: 7,
      modelId: 'aa77f04e-3eec-4034-9c07-d0f619684628',
      transparency: 'foreground_only',
      promptMagic: true,
      alchemy: true,
      highResolution: true,
      expandedDomain: true,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Leonardo API error: ${data.error || response.statusText}`);
  }

  // Poll for completion
  const generationId = data.sdGenerationJob.generationId;
  return pollLeonardoGeneration(generationId);
}

async function pollLeonardoGeneration(generationId) {
  const maxAttempts = 60;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const response = await fetch(
      `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
      {
        headers: {
          'Authorization': `Bearer ${LEONARDO_API_KEY}`,
        },
      }
    );
    
    const data = await response.json();
    
    if (data.generations_by_pk.status === 'COMPLETE') {
      return data.generations_by_pk.generated_images[0].url;
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }
  
  throw new Error('Leonardo generation timeout');
}

const REMAINING_ICONS = [
  {
    id: 'data-viz',
    name: 'Data Visualization',
    prompt: 'Clear glass globe with orbiting 3D bar chart columns and glowing polyline around equator, transparent background, cool teal rim light #00d8ff, glassmorphic style, faint grid reflections',
    emoji: '📊',
  },
  {
    id: 'performance',
    name: 'Performance Optimization',
    prompt: 'Translucent electric thunderbolt made of folded glass plates, transparent background, splits into three shards with motion blur, lime-green glow #b4ff4e, glassmorphic style, subtle chromatic aberration',
    emoji: '⚡',
  },
  {
    id: 'security',
    name: 'Security & Architecture',
    prompt: 'Futuristic titanium vault door circular design with three concentric translucent rings, transparent background, TypeScript and security icons engraved, warm gold central lock glow #ffdd55, glassmorphic style',
    emoji: '🔐',
  },
];

async function downloadFile(url, filepath) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  await fs.writeFile(filepath, Buffer.from(buffer));
  console.log(`✅ Downloaded: ${filepath}`);
}

async function generateRemaining() {
  console.log('🎨 Generating remaining icons...\n');
  
  for (const icon of REMAINING_ICONS) {
    try {
      console.log(`Generating ${icon.id}...`);
      const imageUrl = await generateWithLeonardo(icon.prompt, icon.id);
      const outputPath = `./assets/generated/icons/${icon.id}.png`;
      await downloadFile(imageUrl, outputPath);
      
      // Generate smaller version
      const command = `ffmpeg -i "${outputPath}" -vf scale=256:256 "./assets/generated/icons/${icon.id}-small.png"`;
      await execAsync(command);
      console.log(`✅ Completed ${icon.id}\n`);
      
    } catch (error) {
      console.error(`❌ Failed to generate ${icon.id}: ${error.message}\n`);
    }
  }
  
  console.log('✨ Done!');
}

generateRemaining().catch(console.error);