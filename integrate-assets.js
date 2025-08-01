#!/usr/bin/env node

/**
 * Asset Integration Script
 * Integrates generated video/image assets into the website
 */

import fs from 'fs/promises';
import path from 'path';

// Define assets locally to avoid API key checks
const CAPABILITY_ICONS = [
  { id: 'full-stack', name: 'Full-Stack Development', emoji: '🚀' },
  { id: 'ai-integration', name: 'AI Integration', emoji: '🤖' },
  { id: 'premium-ui', name: 'Premium UI/UX', emoji: '💎' },
  { id: 'data-viz', name: 'Data Visualization', emoji: '📊' },
  { id: 'performance', name: 'Performance Optimization', emoji: '⚡' },
  { id: 'security', name: 'Security & Architecture', emoji: '🔐' },
];

const VIDEO_LOOPS = [
  { id: 'shared-panorama', name: 'Shared Window Panorama' },
  { id: 'footer-horizon', name: 'Digital Horizon Footer' },
];

const ASSETS_DIR = './assets/generated';
const INDEX_PATH = './index.html';

// CSS to be injected
const VIDEO_STYLES = `
    /* Video Asset Styles */
    .video-icon {
        width: 48px;
        height: 48px;
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--space-md);
    }
    
    .video-icon video,
    .video-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    
    .video-icon video {
        mix-blend-mode: screen;
    }
    
    /* Panorama Background */
    .panorama-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
    }
    
    .panorama-video {
        width: 100%;
        height: 200%;
        object-fit: cover;
        animation: panoramaScroll 30s linear infinite;
        opacity: 0.3;
    }
    
    @keyframes panoramaScroll {
        0% { transform: translateY(0); }
        100% { transform: translateY(-50%); }
    }
    
    /* Project cards with window effect */
    .project-window {
        position: relative;
        height: 200px;
        overflow: hidden;
        margin: -2rem -2rem 1rem -2rem;
        border-radius: 16px 16px 0 0;
    }
    
    .project-window::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(ellipse at center, transparent 50%, var(--bg-secondary) 100%);
        z-index: 1;
        pointer-events: none;
    }
    
    /* Footer video */
    .footer-video-container {
        position: relative;
        height: 400px;
        overflow: hidden;
        margin-top: var(--space-2xl);
        border-radius: 24px;
        background: var(--bg-secondary);
    }
    
    .footer-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.6;
    }
    
    /* Performance: Pause videos when not visible */
    .video-icon video:not(.playing) {
        display: none;
    }
    
    /* Loading states */
    .asset-loading {
        background: linear-gradient(135deg, var(--blue-primary) 0%, var(--blue-light) 100%);
        opacity: 0.2;
        animation: pulse 2s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.4; }
    }
`;

// JavaScript for video management
const VIDEO_SCRIPT = `
    // Video Asset Management
    (function() {
        // Intersection Observer for video playback
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video');
                if (video) {
                    if (entry.isIntersecting) {
                        video.play().catch(() => {});
                        video.classList.add('playing');
                    } else {
                        video.pause();
                        video.classList.remove('playing');
                    }
                }
            });
        }, { threshold: 0.1 });
        
        // Observe all video containers
        document.querySelectorAll('.video-icon, .footer-video-container').forEach(container => {
            videoObserver.observe(container);
        });
        
        // Fallback for video load errors
        document.querySelectorAll('video').forEach(video => {
            video.addEventListener('error', function() {
                const fallback = this.dataset.fallback;
                if (fallback) {
                    const img = document.createElement('img');
                    img.src = fallback;
                    img.alt = this.dataset.alt || '';
                    this.parentNode.replaceChild(img, this);
                }
            });
        });
        
        // Reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('video').forEach(video => {
                video.pause();
                video.controls = true;
            });
        }
    })();
`;

async function checkAssetExists(assetPath) {
    try {
        await fs.access(assetPath);
        return true;
    } catch {
        return false;
    }
}

async function updateFeatureCards(htmlContent) {
    console.log('🔄 Updating feature cards with video icons...');
    
    // Find each feature card and update with video icons
    for (const icon of CAPABILITY_ICONS) {
        const iconPath = `${ASSETS_DIR}/icons/${icon.id}.png`;
        const videoPath = `${ASSETS_DIR}/videos/${icon.id}-loop.webm`;
        
        const hasIcon = await checkAssetExists(iconPath);
        const hasVideo = await checkAssetExists(videoPath);
        
        // Create the video/image element
        let assetElement = '';
        
        if (hasVideo) {
            assetElement = `
                <div class="video-icon">
                    <video autoplay loop muted playsinline
                           data-fallback="assets/generated/icons/${icon.id}.png"
                           data-alt="${icon.name}">
                        <source src="assets/generated/videos/${icon.id}-loop.webm" type="video/webm">
                        ${hasIcon ? `<img src="assets/generated/icons/${icon.id}.png" alt="${icon.name}">` : ''}
                    </video>
                </div>`;
        } else if (hasIcon) {
            assetElement = `
                <div class="video-icon">
                    <img src="assets/generated/icons/${icon.id}.png" alt="${icon.name}">
                </div>`;
        } else {
            assetElement = `
                <div class="video-icon asset-loading">
                    ${icon.emoji}
                </div>`;
        }
        
        // Find and replace the feature icon div
        const iconRegex = new RegExp(`<div class="feature-icon">\\s*${icon.emoji}\\s*</div>`, 'g');
        htmlContent = htmlContent.replace(iconRegex, assetElement);
    }
    
    return htmlContent;
}

async function addPanoramaBackground(htmlContent) {
    console.log('🌆 Adding panorama background...');
    
    const panoramaPath = `${ASSETS_DIR}/videos/shared-panorama.webm`;
    const hasPanorama = await checkAssetExists(panoramaPath);
    
    if (hasPanorama) {
        // Add panorama container after body tag
        const panoramaHTML = `
    <!-- Panorama Background -->
    <div class="panorama-background">
        <video class="panorama-video" autoplay loop muted playsinline>
            <source src="assets/generated/videos/shared-panorama.webm" type="video/webm">
        </video>
    </div>
    `;
        
        htmlContent = htmlContent.replace(/<body[^>]*>/, (match) => match + panoramaHTML);
        
        // Update project cards to have window effect
        htmlContent = htmlContent.replace(
            /<div class="project-image">/g,
            '<div class="project-image project-window">'
        );
    }
    
    return htmlContent;
}

async function addFooterVideo(htmlContent) {
    console.log('🎬 Adding footer video...');
    
    const footerPath = `${ASSETS_DIR}/videos/footer-horizon.webm`;
    const hasFooter = await checkAssetExists(footerPath);
    
    if (hasFooter) {
        // Add video container before footer
        const footerVideoHTML = `
    <!-- Footer Video Animation -->
    <div class="footer-video-container">
        <video class="footer-video" autoplay loop muted playsinline>
            <source src="assets/generated/videos/footer-horizon.webm" type="video/webm">
        </video>
    </div>
    `;
        
        htmlContent = htmlContent.replace(/<footer/, footerVideoHTML + '\n    <footer');
    }
    
    return htmlContent;
}

async function injectStyles(htmlContent) {
    console.log('💉 Injecting video styles...');
    
    // Check if styles already exist
    if (htmlContent.includes('/* Video Asset Styles */')) {
        console.log('   Styles already present, updating...');
        // Replace existing video styles
        htmlContent = htmlContent.replace(
            /\/\* Video Asset Styles \*\/[\s\S]*?\/\* End Video Asset Styles \*\//,
            VIDEO_STYLES + '\n        /* End Video Asset Styles */'
        );
    } else {
        // Add new styles before closing style tag
        htmlContent = htmlContent.replace(
            '</style>',
            '\n        ' + VIDEO_STYLES + '\n        /* End Video Asset Styles */\n    </style>'
        );
    }
    
    return htmlContent;
}

async function injectScript(htmlContent) {
    console.log('📜 Injecting video management script...');
    
    // Check if script already exists
    if (htmlContent.includes('// Video Asset Management')) {
        console.log('   Script already present, updating...');
        // Replace existing script
        htmlContent = htmlContent.replace(
            /\/\/ Video Asset Management[\s\S]*?\/\/ End Video Asset Management/,
            VIDEO_SCRIPT.trim() + '\n        // End Video Asset Management'
        );
    } else {
        // Add new script before closing body tag
        htmlContent = htmlContent.replace(
            '</body>',
            '\n    <script>\n        ' + VIDEO_SCRIPT + '\n        // End Video Asset Management\n    </script>\n</body>'
        );
    }
    
    return htmlContent;
}

async function createAssetManifest() {
    console.log('📋 Creating asset manifest...');
    
    const manifest = {
        generated: new Date().toISOString(),
        icons: {},
        videos: {},
    };
    
    // Check for generated assets
    for (const icon of CAPABILITY_ICONS) {
        manifest.icons[icon.id] = {
            name: icon.name,
            png: await checkAssetExists(`${ASSETS_DIR}/icons/${icon.id}.png`),
            pngSmall: await checkAssetExists(`${ASSETS_DIR}/icons/${icon.id}-small.png`),
            video: await checkAssetExists(`${ASSETS_DIR}/videos/${icon.id}-loop.webm`),
        };
    }
    
    for (const video of VIDEO_LOOPS) {
        manifest.videos[video.id] = {
            name: video.name,
            video: await checkAssetExists(`${ASSETS_DIR}/videos/${video.id}.webm`),
            poster: await checkAssetExists(`${ASSETS_DIR}/videos/${video.id}-poster.jpg`),
        };
    }
    
    await fs.writeFile(
        `${ASSETS_DIR}/manifest.json`,
        JSON.stringify(manifest, null, 2)
    );
    
    return manifest;
}

async function integrateAssets() {
    console.log('🚀 Starting asset integration...\n');
    
    try {
        // Read current index.html
        let htmlContent = await fs.readFile(INDEX_PATH, 'utf-8');
        
        // Create backup
        await fs.writeFile(`${INDEX_PATH}.backup`, htmlContent);
        console.log('✅ Created backup: index.html.backup');
        
        // Apply updates
        htmlContent = await updateFeatureCards(htmlContent);
        htmlContent = await addPanoramaBackground(htmlContent);
        htmlContent = await addFooterVideo(htmlContent);
        htmlContent = await injectStyles(htmlContent);
        htmlContent = await injectScript(htmlContent);
        
        // Write updated HTML
        await fs.writeFile(INDEX_PATH, htmlContent);
        console.log('✅ Updated index.html with video assets');
        
        // Create manifest
        const manifest = await createAssetManifest();
        console.log('\n📊 Asset Status:');
        console.log(JSON.stringify(manifest, null, 2));
        
        console.log('\n✨ Integration complete!');
        console.log('🌐 Run "git add . && git commit -m "Add video assets" && git push" to deploy');
        
    } catch (error) {
        console.error('❌ Integration failed:', error.message);
        console.log('💡 Restoring from backup...');
        
        try {
            const backup = await fs.readFile(`${INDEX_PATH}.backup`, 'utf-8');
            await fs.writeFile(INDEX_PATH, backup);
            console.log('✅ Restored from backup');
        } catch (restoreError) {
            console.error('❌ Restore failed:', restoreError.message);
        }
    }
}

// Run integration
if (import.meta.url === `file://${process.argv[1]}`) {
    integrateAssets().catch(console.error);
}

export { integrateAssets };