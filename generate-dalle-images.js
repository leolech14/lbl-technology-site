#!/usr/bin/env node

/**
 * DALL-E 3 Image Generation for Negative 3D Space Effects
 * Generates static images that can be animated with CSS
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

// Base prompt for consistent style
const BASE_PROMPT = `Create a minimalist icon with these specifications:
- Negative 3D space effect (object appears carved/hollowed from space)
- Dark background #0a0a0f
- Glassmorphic style with transparency
- Simple geometric shape
- Subtle glow in specified color
- Clean, modern, ultra-minimalist
- No text or labels
- Square format suitable for 48x48px display`;

const IMAGES = [
  {
    id: 'rocket-3d',
    prompt: `${BASE_PROMPT}
    Object: Rocket ship as negative space
    Primary color: #3b82f6 (blue)
    Shape: Triangular rocket carved into space with trailing lines`,
  },
  {
    id: 'brain-3d',
    prompt: `${BASE_PROMPT}
    Object: Brain/neural network as negative space
    Primary color: #60a5fa (light blue)
    Shape: Circular brain with interconnected nodes carved out`,
  },
  {
    id: 'diamond-3d',
    prompt: `${BASE_PROMPT}
    Object: Diamond as negative space
    Primary color: #3b82f6 (blue)
    Shape: Geometric diamond with facets carved into void`,
  },
  {
    id: 'chart-3d',
    prompt: `${BASE_PROMPT}
    Object: Bar chart as negative space
    Primary color: #60a5fa (light blue)
    Shape: Four vertical bars of different heights carved out`,
  },
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

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${error}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    
    console.log('  📥 Downloading image...');
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    
    const outputDir = './assets/generated/dalle';
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputPath = `${outputDir}/${imageConfig.id}.png`;
    await fs.writeFile(outputPath, Buffer.from(buffer));
    
    console.log(`  ✅ Saved to ${outputPath}`);
    return true;
    
  } catch (error) {
    console.error(`  ❌ Failed: ${error.message}`);
    return false;
  }
}

async function createPreviewHTML() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DALL-E 3 Negative 3D Space Images</title>
    <style>
        :root {
            --blue-primary: #3b82f6;
            --blue-light: #60a5fa;
            --accent-orange: #f97316;
            --bg-primary: #0a0a0f;
        }

        body {
            margin: 0;
            padding: 2rem;
            background: var(--bg-primary);
            color: white;
            font-family: system-ui;
        }

        h1 {
            text-align: center;
            background: linear-gradient(135deg, var(--blue-primary), var(--blue-light));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 2rem auto;
        }

        .image-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 1rem;
            text-align: center;
        }

        .image-container {
            width: 200px;
            height: 200px;
            margin: 0 auto 1rem;
            border-radius: 12px;
            overflow: hidden;
            background: var(--bg-primary);
            position: relative;
        }

        .image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-10px) scale(1.05); }
        }

        .small {
            width: 48px;
            height: 48px;
            margin: 1rem auto;
        }

        h3 {
            color: var(--blue-light);
            margin: 0.5rem 0;
        }

        .integration-code {
            margin-top: 3rem;
            padding: 2rem;
            background: rgba(255,255,255,0.05);
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.1);
        }

        code {
            background: rgba(0,0,0,0.5);
            padding: 1rem;
            border-radius: 8px;
            display: block;
            font-family: monospace;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>DALL-E 3 Negative 3D Space Icons</h1>
    <p style="text-align: center; color: rgba(255,255,255,0.7);">
        AI-generated icons with negative space effect
    </p>

    <div class="grid">
        ${IMAGES.map(img => `
        <div class="image-card">
            <h3>${img.id}</h3>
            <div class="image-container">
                <img src="assets/generated/dalle/${img.id}.png" alt="${img.id}">
            </div>
            <div class="image-container small">
                <img src="assets/generated/dalle/${img.id}.png" alt="${img.id} small">
            </div>
        </div>
        `).join('')}
    </div>

    <div class="integration-code">
        <h2>Integration Example</h2>
        <code>
&lt;div class="feature-icon"&gt;
  &lt;img src="assets/generated/dalle/rocket-3d.png" 
       alt="Full-Stack Development"
       class="negative-3d-icon"&gt;
&lt;/div&gt;

/* CSS */
.negative-3d-icon {
  width: 48px;
  height: 48px;
  animation: rotate3D 20s linear infinite;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
}

@keyframes rotate3D {
  0% { transform: perspective(200px) rotateY(0deg); }
  100% { transform: perspective(200px) rotateY(360deg); }
}
        </code>
    </div>
</body>
</html>`;

  await fs.writeFile('./dalle-preview.html', html);
  console.log('\n✅ Created preview page: dalle-preview.html');
}

async function main() {
  console.log('🚀 Starting DALL-E 3 image generation...');
  console.log('📝 Creating negative 3D space icons\n');
  
  const results = [];
  
  for (const image of IMAGES) {
    const success = await generateImage(image);
    results.push({ name: image.id, success });
    
    // Rate limiting - wait 2 seconds between requests
    if (image !== IMAGES[IMAGES.length - 1]) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Create preview
  await createPreviewHTML();
  
  // Summary
  console.log('\n📊 Generation Summary:');
  results.forEach(r => {
    console.log(`  ${r.success ? '✅' : '❌'} ${r.name}`);
  });
  
  const successful = results.filter(r => r.success).length;
  console.log(`\n✨ Completed: ${successful}/${results.length} images generated`);
}

main().catch(console.error);