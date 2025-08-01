#!/usr/bin/env node

/**
 * Sora Video Generation for Negative 3D Space Effects
 * Creates consistent glassmorphic videos for each feature card
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ OpenAI API key not found. Please run with Doppler or set OPENAI_API_KEY');
  process.exit(1);
}

// Base prompt template for negative 3D space
const BASE_PROMPT = `Create a 3-second seamless loop video with these exact specifications:

VISUAL STYLE:
- Negative 3D space effect (inverted depth, hollow/carved out appearance)
- Dark background matching #0a0a0f with subtle gradients to #0f1117
- Glassmorphic elements with transparency and blur effects
- Color palette: Primary blue #3b82f6, Light blue #60a5fa, Accent orange #f97316
- Perspective grid lines converging to center, creating depth illusion
- Subtle particle effects floating in the negative space
- Clean, minimalist, ultra-modern aesthetic

TECHNICAL:
- Resolution: 512x512px (will be displayed at 48x48px)
- Frame rate: 30fps
- Duration: 3 seconds exactly
- Perfect seamless loop at frame 90
- No text or logos
- Dark edges fading to transparency

ANIMATION:
- Slow rotation revealing the negative space depth
- Floating particles moving through the carved space
- Subtle glow pulses matching the theme color
- Perspective lines slowly shifting to enhance 3D effect

MAIN OBJECT:`;

// Feature-specific objects and details
const FEATURE_VIDEOS = [
  {
    id: 'full-stack-video',
    name: 'Full-Stack Development',
    object: 'A rocket ship carved as negative space, with glowing blue exhaust trails flowing through the hollow form. The rocket appears as an inverted 3D cavity with perspective lines converging at its tip.',
    primaryColor: '#3b82f6',
    particles: 'Blue light particles flowing upward like launch thrust'
  },
  {
    id: 'ai-integration-video',
    name: 'AI Integration',
    object: 'A brain made of interconnected neural pathways carved into negative space. Synapses pulse with light blue energy flowing through the hollow neural network structure.',
    primaryColor: '#60a5fa',
    particles: 'Data points flowing between neural connections'
  },
  {
    id: 'premium-ui-video',
    name: 'Premium UI/UX',
    object: 'A multifaceted diamond carved as negative space, with each facet catching and refracting light. The hollow gem rotates to reveal its inverted crystalline structure.',
    primaryColor: '#3b82f6',
    particles: 'Sparkles emanating from the facet edges'
  },
  {
    id: 'data-viz-video',
    name: 'Data Visualization',
    object: 'Bar charts and graphs carved into negative space, with data streams flowing through the hollow columns. The visualization morphs between different chart types.',
    primaryColor: '#60a5fa',
    particles: 'Data points flowing between chart elements'
  },
  {
    id: 'performance-video',
    name: 'Performance Optimization',
    object: 'A lightning bolt carved as negative space, with electric energy crackling through the hollow form. The bolt pulses with orange energy surges.',
    primaryColor: '#f97316',
    particles: 'Electric sparks jumping across the void'
  },
  {
    id: 'security-video',
    name: 'Security & Architecture',
    object: 'A shield carved into negative space, with scanning laser lines sweeping through the hollow form. The shield rotates to reveal its protective depth layers.',
    primaryColor: '#3b82f6',
    particles: 'Security scan lines moving through the cavity'
  }
];

async function generateVideo(feature) {
  console.log(`\n🎬 Generating ${feature.name} video...`);
  
  const fullPrompt = `${BASE_PROMPT} ${feature.object}
  
SPECIFIC DETAILS:
- Primary glow color: ${feature.primaryColor}
- Particle effect: ${feature.particles}
- The object should appear carved out/hollowed from the space
- Emphasis on the negative space (inverted 3D) aesthetic
- Smooth, hypnotic motion perfect for background loop`;

  try {
    const response = await fetch('https://api.openai.com/v1/videos/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        duration: 3,
        resolution: '512x512',
        fps: 30,
        style: 'digital_art',
        loop: true
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${error}`);
    }

    const data = await response.json();
    
    // Wait for video generation
    let videoUrl;
    if (data.status === 'pending') {
      console.log('  ⏳ Waiting for video generation...');
      videoUrl = await pollForCompletion(data.id);
    } else {
      videoUrl = data.video_url;
    }

    // Download video
    console.log('  📥 Downloading video...');
    const videoResponse = await fetch(videoUrl);
    const buffer = await videoResponse.arrayBuffer();
    
    const outputDir = './assets/generated/videos';
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputPath = `${outputDir}/${feature.id}.mp4`;
    await fs.writeFile(outputPath, Buffer.from(buffer));
    
    console.log(`  ✅ Saved to ${outputPath}`);
    
    // Convert to WebM for better web performance
    console.log('  🔄 Converting to WebM...');
    const webmPath = `${outputDir}/${feature.id}.webm`;
    await execAsync(`ffmpeg -i "${outputPath}" -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus "${webmPath}"`);
    
    console.log(`  ✅ Created WebM: ${webmPath}`);
    
    // Create a thumbnail
    const thumbnailPath = `${outputDir}/${feature.id}-thumb.png`;
    await execAsync(`ffmpeg -i "${outputPath}" -vf "select=eq(n\\,0)" -vframes 1 "${thumbnailPath}"`);
    
    console.log(`  ✅ Created thumbnail: ${thumbnailPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`  ❌ Failed: ${error.message}`);
    return false;
  }
}

async function pollForCompletion(videoId) {
  const maxAttempts = 60; // 5 minutes timeout
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds
    
    const response = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    });
    
    const data = await response.json();
    
    if (data.status === 'completed') {
      return data.video_url;
    } else if (data.status === 'failed') {
      throw new Error('Video generation failed');
    }
    
    console.log(`    Status: ${data.status} (${attempts + 1}/${maxAttempts})`);
    attempts++;
  }
  
  throw new Error('Video generation timeout');
}

async function createDemoHTML() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Negative 3D Space Videos - Preview</title>
    <style>
        :root {
            --blue-primary: #3b82f6;
            --blue-light: #60a5fa;
            --accent-orange: #f97316;
            --bg-primary: #0a0a0f;
            --bg-secondary: #0f1117;
        }

        body {
            margin: 0;
            padding: 2rem;
            background: var(--bg-primary);
            color: white;
            font-family: system-ui;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .video-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .video-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 1rem;
            text-align: center;
        }

        .video-container {
            width: 256px;
            height: 256px;
            margin: 0 auto 1rem;
            border-radius: 12px;
            overflow: hidden;
            background: var(--bg-secondary);
            position: relative;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .video-small {
            width: 48px;
            height: 48px;
            margin: 1rem auto;
        }

        h1 {
            text-align: center;
            background: linear-gradient(135deg, var(--blue-primary), var(--blue-light));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .description {
            color: rgba(255,255,255,0.7);
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }

        .integration-example {
            margin-top: 3rem;
            padding: 2rem;
            background: rgba(255,255,255,0.05);
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.1);
        }

        .code {
            background: rgba(0,0,0,0.5);
            padding: 1rem;
            border-radius: 8px;
            font-family: monospace;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Negative 3D Space Videos</h1>
        <p style="text-align: center; color: rgba(255,255,255,0.7);">
            Glassmorphic negative space effects for feature cards
        </p>

        <div class="video-grid">
            ${FEATURE_VIDEOS.map(feature => `
            <div class="video-card">
                <h3>${feature.name}</h3>
                <div class="video-container">
                    <video autoplay loop muted playsinline>
                        <source src="assets/generated/videos/${feature.id}.webm" type="video/webm">
                        <source src="assets/generated/videos/${feature.id}.mp4" type="video/mp4">
                    </video>
                </div>
                <div class="video-container video-small">
                    <video autoplay loop muted playsinline>
                        <source src="assets/generated/videos/${feature.id}.webm" type="video/webm">
                        <source src="assets/generated/videos/${feature.id}.mp4" type="video/mp4">
                    </video>
                </div>
                <p class="description">${feature.object}</p>
            </div>
            `).join('')}
        </div>

        <div class="integration-example">
            <h2>Integration Example</h2>
            <p>To use these videos in your feature cards:</p>
            <div class="code">
&lt;div class="feature-icon"&gt;<br>
&nbsp;&nbsp;&lt;video autoplay loop muted playsinline&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;source src="assets/generated/videos/full-stack-video.webm" type="video/webm"&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;source src="assets/generated/videos/full-stack-video.mp4" type="video/mp4"&gt;<br>
&nbsp;&nbsp;&lt;/video&gt;<br>
&lt;/div&gt;
            </div>
        </div>
    </div>
</body>
</html>`;

  await fs.writeFile('./sora-videos-preview.html', html);
  console.log('\n✅ Created preview page: sora-videos-preview.html');
}

async function main() {
  console.log('🚀 Starting Sora video generation...');
  console.log('📝 Creating negative 3D space effects with glassmorphic style\n');
  
  const results = [];
  
  for (const feature of FEATURE_VIDEOS) {
    const success = await generateVideo(feature);
    results.push({ feature: feature.name, success });
    
    // Add delay between API calls
    if (feature !== FEATURE_VIDEOS[FEATURE_VIDEOS.length - 1]) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Create preview HTML
  await createDemoHTML();
  
  // Summary
  console.log('\n📊 Generation Summary:');
  results.forEach(r => {
    console.log(`  ${r.success ? '✅' : '❌'} ${r.feature}`);
  });
  
  const successful = results.filter(r => r.success).length;
  console.log(`\n✨ Completed: ${successful}/${results.length} videos generated`);
  
  if (successful > 0) {
    console.log('\n🎯 Next steps:');
    console.log('1. Open sora-videos-preview.html to see all videos');
    console.log('2. Run integrate-assets.js to add videos to your site');
    console.log('3. Videos are optimized for 48x48px display size');
  }
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

main().catch(console.error);