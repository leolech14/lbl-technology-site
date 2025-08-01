#!/usr/bin/env node

import fs from 'fs/promises';
import fetch from 'node-fetch';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);
const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY || '7cc2cecd-62ee-422d-9252-f9073c5d2b25';

// Updated simpler icons matching website palette
const ICONS = [
  {
    id: 'full-stack',
    name: 'Full-Stack Development',
    prompt: 'Simple minimalist rocket icon, transparent background, single blue color #3b82f6, flat design, no gradients, clean lines, geometric shape, centered composition',
    emoji: '🚀',
  },
  {
    id: 'ai-integration', 
    name: 'AI Integration',
    prompt: 'Simple minimalist brain circuit icon, transparent background, single light blue color #60a5fa, flat design, no gradients, clean lines, geometric shape, centered composition',
    emoji: '🤖',
  },
  {
    id: 'premium-ui',
    name: 'Premium UI/UX',
    prompt: 'Simple minimalist diamond icon, transparent background, single blue color #3b82f6, flat design, no gradients, clean lines, geometric shape, centered composition',
    emoji: '💎',
  },
  {
    id: 'data-viz',
    name: 'Data Visualization',
    prompt: 'Simple minimalist bar chart icon, transparent background, single light blue color #60a5fa, flat design, no gradients, clean lines, geometric shape, centered composition',
    emoji: '📊',
  },
  {
    id: 'performance',
    name: 'Performance Optimization',
    prompt: 'Simple minimalist lightning bolt icon, transparent background, single orange color #f97316, flat design, no gradients, clean lines, geometric shape, centered composition',
    emoji: '⚡',
  },
  {
    id: 'security',
    name: 'Security & Architecture', 
    prompt: 'Simple minimalist shield icon, transparent background, single blue color #3b82f6, flat design, no gradients, clean lines, geometric shape, centered composition',
    emoji: '🔐',
  },
];

async function generateIcon(icon) {
  console.log(`\n🎨 Generating ${icon.id}...`);
  
  try {
    // Call Leonardo AI
    const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LEONARDO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: icon.prompt,
        num_images: 1,
        width: 512, // Smaller for faster generation
        height: 512,
        guidance_scale: 7,
        modelId: 'aa77f04e-3eec-4034-9c07-d0f619684628',
        transparency: 'foreground_only',
        promptMagic: false, // Disable for simpler results
        alchemy: false, // Disable for faster generation
        highResolution: false,
        expandedDomain: false,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Leonardo API error: ${JSON.stringify(data)}`);
    }

    // Wait for generation
    const generationId = data.sdGenerationJob.generationId;
    console.log(`  Generation ID: ${generationId}`);
    
    // Poll for completion
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds
      
      const statusResponse = await fetch(
        `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
        {
          headers: {
            'Authorization': `Bearer ${LEONARDO_API_KEY}`,
          },
        }
      );
      
      const statusData = await statusResponse.json();
      
      if (statusData.generations_by_pk.status === 'COMPLETE') {
        const imageUrl = statusData.generations_by_pk.generated_images[0].url;
        
        // Download image
        const imageResponse = await fetch(imageUrl);
        const buffer = await imageResponse.arrayBuffer();
        const outputPath = `./assets/generated/icons/${icon.id}.png`;
        await fs.writeFile(outputPath, Buffer.from(buffer));
        
        console.log(`✅ Downloaded: ${outputPath}`);
        
        // Create small version
        await execAsync(`ffmpeg -i "${outputPath}" -vf scale=256:256 "./assets/generated/icons/${icon.id}-small.png"`);
        console.log(`✅ Created small version`);
        
        return true;
      }
      
      console.log(`  Status: ${statusData.generations_by_pk.status} (attempt ${attempts + 1}/${maxAttempts})`);
      attempts++;
    }
    
    throw new Error('Generation timeout');
    
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Regenerating simpler icons...\n');
  console.log('Using colors:');
  console.log('  Blue: #3b82f6');
  console.log('  Light Blue: #60a5fa');
  console.log('  Orange: #f97316');
  
  for (const icon of ICONS) {
    await generateIcon(icon);
    
    // Small delay between generations
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n✨ Done!');
}

main().catch(console.error);