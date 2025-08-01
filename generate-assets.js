#!/usr/bin/env node

/**
 * Asset Generation Script for Glassmorphic Website
 * Uses Leonardo AI for static icons and Sora for video loops
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const execAsync = promisify(exec);

// Configuration
const CONFIG = {
  leonardo: {
    apiKey: process.env.LEONARDO_API_KEY || '7cc2cecd-62ee-422d-9252-f9073c5d2b25',
    apiUrl: process.env.LEONARDO_API_URL || 'https://cloud.leonardo.ai/api/rest/v1',
  },
  sora: {
    apiKey: process.env.OPENAI_API_KEY || process.env.SORA_API_KEY, // Doppler provides OPENAI_API_KEY
    apiUrl: process.env.SORA_API_URL || 'https://api.openai.com/v1',
  },
  outputDir: './assets/generated',
  tempDir: './assets/temp',
};

// Check command line arguments
const args = process.argv.slice(2);
const iconsOnly = args.includes('--icons-only');
const videosOnly = args.includes('--videos-only');

// Validate API keys based on mode
if (!CONFIG.leonardo.apiKey && !videosOnly) {
  console.error('❌ Leonardo AI API key not found. Please set LEONARDO_API_KEY in .env');
  process.exit(1);
}

if (!CONFIG.sora.apiKey && !iconsOnly) {
  console.error('❌ OpenAI/Sora API key not found. Please run with Doppler: doppler run -- npm run generate-assets');
  console.error('   Or set OPENAI_API_KEY environment variable');
  process.exit(1);
}

// Asset Definitions
const CAPABILITY_ICONS = [
  {
    id: 'full-stack',
    name: 'Full-Stack Development',
    prompt: 'Simple minimalist rocket icon, transparent background, single blue color #3b82f6, flat design, no gradients, clean lines, geometric shape',
    emoji: '🚀',
  },
  {
    id: 'ai-integration',
    name: 'AI Integration',
    prompt: 'Simple minimalist brain circuit icon, transparent background, single blue color #60a5fa, flat design, no gradients, clean lines, geometric shape',
    emoji: '🤖',
  },
  {
    id: 'premium-ui',
    name: 'Premium UI/UX',
    prompt: 'Simple minimalist diamond icon, transparent background, single blue color #3b82f6, flat design, no gradients, clean lines, geometric shape',
    emoji: '💎',
  },
  {
    id: 'data-viz',
    name: 'Data Visualization',
    prompt: 'Simple minimalist bar chart icon, transparent background, single blue color #60a5fa, flat design, no gradients, clean lines, geometric shape',
    emoji: '📊',
  },
  {
    id: 'performance',
    name: 'Performance Optimization',
    prompt: 'Simple minimalist lightning bolt icon, transparent background, single orange color #f97316, flat design, no gradients, clean lines, geometric shape',
    emoji: '⚡',
  },
  {
    id: 'security',
    name: 'Security & Architecture',
    prompt: 'Simple minimalist shield icon, transparent background, single blue color #3b82f6, flat design, no gradients, clean lines, geometric shape',
    emoji: '🔐',
  },
];

const VIDEO_LOOPS = [
  {
    id: 'shared-panorama',
    name: 'Shared Window Panorama',
    prompt: `Generate a vertically-tiled, ultra-tall, seamless-loop video for parallax masking.
Resolution: 2160 × 4096 px (portrait), 30 fps, 8-second duration, opaque background.
Concept: dark-futuristic NEBULA CITYSCAPE shot from mid-altitude. Silky colored light streams (blue #1e90ff, violet #c084fc, emerald #00e388, amber #fbbf24) flow diagonally across the scene. Buildings are translucent glass monoliths with holographic facades. No prominent focal point.
Camera: static; motion from animated ambience only.
Background gradient: #0d1117 to #1b2230.
Loop point: frame 240 (8 seconds).`,
    duration: 8,
    resolution: { width: 2160, height: 4096 },
  },
  {
    id: 'footer-horizon',
    name: 'Digital Horizon Footer',
    prompt: `Produce a 100vw × 400px webm, 30 fps, 12-second seamless loop.
Scene: perspective grid receding into darkness (#0d1117 to #1b2230). Random nodes illuminate briefly in cyan #17e0ff or violet #c084fc and send ripples along grid lines. Slow-moving particle streams drift upward like data packets.
Style: retro-futurist meets glassmorphism, low-contrast glow, no lens flares.`,
    duration: 12,
    resolution: { width: 1920, height: 400 },
  },
];

// Leonardo AI Functions
async function generateWithLeonardo(prompt, id) {
  console.log(`🎨 Generating static icon: ${id}`);
  
  const response = await fetch(`${CONFIG.leonardo.apiUrl}/generations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.leonardo.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      num_images: 1,
      width: 1024,
      height: 1024,
      guidance_scale: 7,
      modelId: 'aa77f04e-3eec-4034-9c07-d0f619684628', // Leonardo Kino XL
      transparency: 'foreground_only', // Key for transparent background
      promptMagic: true, // Enable prompt enhancement
      alchemy: true, // Enable better quality
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
      `${CONFIG.leonardo.apiUrl}/generations/${generationId}`,
      {
        headers: {
          'Authorization': `Bearer ${CONFIG.leonardo.apiKey}`,
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

// Sora API Functions
async function generateWithSora(prompt, id, duration, resolution) {
  console.log(`🎬 Generating video loop: ${id}`);
  
  const response = await fetch(`${CONFIG.sora.apiUrl}/video/generations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.sora.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sora-1.0-turbo',
      prompt: prompt,
      duration: duration,
      resolution: `${resolution.width}x${resolution.height}`,
      fps: 30,
      loop: true, // Enable seamless looping
      format: 'webm',
      quality: 'high',
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Sora API error: ${data.error || response.statusText}`);
  }

  // Poll for completion
  return pollSoraGeneration(data.id);
}

async function pollSoraGeneration(generationId) {
  const maxAttempts = 120; // Longer for video
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const response = await fetch(
      `${CONFIG.sora.apiUrl}/video/generations/${generationId}`,
      {
        headers: {
          'Authorization': `Bearer ${CONFIG.sora.apiKey}`,
        },
      }
    );
    
    const data = await response.json();
    
    if (data.status === 'succeeded') {
      return data.url;
    } else if (data.status === 'failed') {
      throw new Error(`Sora generation failed: ${data.error}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    attempts++;
  }
  
  throw new Error('Sora generation timeout');
}

// Utility Functions
async function downloadFile(url, filepath) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  await fs.writeFile(filepath, Buffer.from(buffer));
  console.log(`✅ Downloaded: ${path.basename(filepath)}`);
}

async function ensureDirectories() {
  const dirs = [
    CONFIG.outputDir,
    `${CONFIG.outputDir}/icons`,
    `${CONFIG.outputDir}/videos`,
    CONFIG.tempDir,
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function optimizeVideo(inputPath, outputPath) {
  console.log(`🔧 Optimizing video: ${path.basename(outputPath)}`);
  
  // Convert to optimized WebM with VP9
  const command = `ffmpeg -i "${inputPath}" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 30 -an "${outputPath}"`;
  
  try {
    await execAsync(command);
    console.log(`✅ Optimized: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ FFmpeg error: ${error.message}`);
  }
}

async function generateFallbackImage(videoPath, imagePath) {
  // Extract first frame as fallback
  const command = `ffmpeg -i "${videoPath}" -ss 00:00:00 -vframes 1 "${imagePath}"`;
  
  try {
    await execAsync(command);
    console.log(`✅ Generated fallback: ${path.basename(imagePath)}`);
  } catch (error) {
    console.error(`❌ Fallback generation error: ${error.message}`);
  }
}

// Main Generation Flow
async function generateAllAssets() {
  console.log('🚀 Starting asset generation...\n');
  
  await ensureDirectories();
  
  // Generate static icons with Leonardo
  if (!videosOnly) {
    console.log('═══ GENERATING STATIC ICONS ═══\n');
    for (const icon of CAPABILITY_ICONS) {
    try {
      const imageUrl = await generateWithLeonardo(icon.prompt, icon.id);
      const outputPath = `${CONFIG.outputDir}/icons/${icon.id}.png`;
      await downloadFile(imageUrl, outputPath);
      
      // Also generate a smaller version for performance
      const command = `ffmpeg -i "${outputPath}" -vf scale=256:256 "${CONFIG.outputDir}/icons/${icon.id}-small.png"`;
      await execAsync(command);
      
    } catch (error) {
      console.error(`❌ Failed to generate ${icon.id}: ${error.message}`);
      console.log(`   Using emoji fallback: ${icon.emoji}`);
    }
    }
  }
  
  // Generate video loops with Sora
  if (!iconsOnly) {
    console.log('\n═══ GENERATING VIDEO LOOPS ═══\n');
    for (const video of VIDEO_LOOPS) {
    try {
      const videoUrl = await generateWithSora(
        video.prompt,
        video.id,
        video.duration,
        video.resolution
      );
      
      const tempPath = `${CONFIG.tempDir}/${video.id}.webm`;
      const outputPath = `${CONFIG.outputDir}/videos/${video.id}.webm`;
      
      await downloadFile(videoUrl, tempPath);
      await optimizeVideo(tempPath, outputPath);
      
      // Generate fallback image
      const fallbackPath = `${CONFIG.outputDir}/videos/${video.id}-poster.jpg`;
      await generateFallbackImage(outputPath, fallbackPath);
      
    } catch (error) {
      console.error(`❌ Failed to generate ${video.id}: ${error.message}`);
    }
    }
    
    // Generate additional 1-second loops for each capability
    console.log('\n═══ GENERATING 1-SECOND LOOPS ═══\n');
    for (const icon of CAPABILITY_ICONS) {
    try {
      const videoPrompt = `${icon.prompt}. Animate with subtle glow pulsing and gentle floating motion. 1-second seamless loop, 30fps, 1024x1024px, transparent background.`;
      
      const videoUrl = await generateWithSora(
        videoPrompt,
        `${icon.id}-loop`,
        1,
        { width: 1024, height: 1024 }
      );
      
      const tempPath = `${CONFIG.tempDir}/${icon.id}-loop.webm`;
      const outputPath = `${CONFIG.outputDir}/videos/${icon.id}-loop.webm`;
      
      await downloadFile(videoUrl, tempPath);
      await optimizeVideo(tempPath, outputPath);
      
    } catch (error) {
      console.error(`❌ Failed to generate ${icon.id} loop: ${error.message}`);
    }
    }
  }
  
  // Clean up temp directory
  await fs.rm(CONFIG.tempDir, { recursive: true, force: true });
  
  console.log('\n✨ Asset generation complete!');
  console.log(`📁 Assets saved to: ${CONFIG.outputDir}`);
}

// Create package.json for the script
async function createPackageJson() {
  const packageJson = {
    name: "glassmorphic-asset-generator",
    version: "1.0.0",
    type: "module",
    scripts: {
      "generate": "node generate-assets.js",
      "generate:icons": "node generate-assets.js --icons-only",
      "generate:videos": "node generate-assets.js --videos-only"
    },
    dependencies: {
      "node-fetch": "^3.3.2",
      "dotenv": "^16.3.1"
    }
  };
  
  await fs.writeFile(
    path.join(path.dirname(CONFIG.outputDir), 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}

// Environment setup file
async function createEnvExample() {
  const envExample = `# Leonardo AI API Key
LEONARDO_API_KEY=your_leonardo_api_key_here

# Sora API Key (from Doppler)
SORA_API_KEY=your_sora_api_key_here

# Optional: Custom API endpoints
# LEONARDO_API_URL=https://cloud.leonardo.ai/api/rest/v1
# SORA_API_URL=https://api.openai.com/v1
`;
  
  await fs.writeFile(
    path.join(path.dirname(CONFIG.outputDir), '.env.example'),
    envExample
  );
}

// Run the generator
if (import.meta.url === `file://${process.argv[1]}`) {
  createPackageJson();
  createEnvExample();
  generateAllAssets().catch(console.error);
}

export { generateWithLeonardo, generateWithSora, CAPABILITY_ICONS, VIDEO_LOOPS };