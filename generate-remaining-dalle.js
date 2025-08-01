#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const BASE_PROMPT = `Create a minimalist icon with these specifications:
- Negative 3D space effect (object appears carved/hollowed from space)
- Dark background #0a0a0f
- Glassmorphic style with transparency
- Simple geometric shape
- Subtle glow in specified color
- Clean, modern, ultra-minimalist
- No text or labels
- Square format suitable for 48x48px display`;

const REMAINING_IMAGES = [
  {
    id: 'lightning-3d',
    prompt: `${BASE_PROMPT}
    Object: Lightning bolt as negative space
    Primary color: #f97316 (orange)
    Shape: Zigzag lightning bolt carved into space`,
  },
  {
    id: 'shield-3d',
    prompt: `${BASE_PROMPT}
    Object: Shield as negative space
    Primary color: #3b82f6 (blue)
    Shape: Shield outline with protective layers carved out`,
  },
];

async function generateImage(imageConfig) {
  console.log(`\n🎨 Generating ${imageConfig.id}...`);
  
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: imageConfig.prompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'natural',
      }),
    });

    const data = await response.json();
    const imageUrl = data.data[0].url;
    
    console.log('  📥 Downloading image...');
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    
    const outputPath = `./assets/generated/dalle/${imageConfig.id}.png`;
    await fs.writeFile(outputPath, Buffer.from(buffer));
    
    console.log(`  ✅ Saved to ${outputPath}`);
    return true;
    
  } catch (error) {
    console.error(`  ❌ Failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Generating remaining DALL-E images...\n');
  
  for (const image of REMAINING_IMAGES) {
    await generateImage(image);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n✨ Done!');
}

main().catch(console.error);