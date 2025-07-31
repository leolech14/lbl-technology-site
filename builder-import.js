// Builder.io Import Script
// This imports your existing HTML into Builder.io

const API_KEY = 'e19bb9554845477c84fa4345b2f84479';
const CONTENT_ID = 'ac89409dbd434299b6d9e85ae1891c3b';

// Read your existing HTML
const fs = require('fs');
const path = require('path');

async function importToBuilder() {
  console.log('🚀 Importing your website to Builder.io...\n');
  
  try {
    // Read the current index.html
    const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    
    // Extract sections from your HTML
    const heroMatch = htmlContent.match(/<section class="hero"[^>]*>([\s\S]*?)<\/section>/);
    const expertiseMatch = htmlContent.match(/<section class="expertise"[^>]*>([\s\S]*?)<\/section>/);
    const projectsMatch = htmlContent.match(/<section class="projects"[^>]*>([\s\S]*?)<\/section>/);
    
    // Create Builder.io content structure
    const builderContent = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element',
            component: {
              name: 'Hero Section',
              options: {
                html: heroMatch ? heroMatch[0] : '',
                css: getStyles()
              }
            }
          },
          {
            '@type': '@builder.io/sdk:Element',
            component: {
              name: 'Expertise Section',
              options: {
                html: expertiseMatch ? expertiseMatch[0] : '',
                css: getStyles()
              }
            }
          },
          {
            '@type': '@builder.io/sdk:Element',
            component: {
              name: 'Projects Section',
              options: {
                html: projectsMatch ? projectsMatch[0] : '',
                css: getStyles()
              }
            }
          }
        ]
      }
    };
    
    // Update via API
    const response = await fetch(`https://builder.io/api/v2/content/page/${CONTENT_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(builderContent)
    });
    
    if (response.ok) {
      console.log('✅ Content imported successfully!');
      console.log(`\n🎨 Edit your page at:`);
      console.log(`https://builder.io/content/${CONTENT_ID}/edit\n`);
    } else {
      console.error('❌ Import failed:', await response.text());
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

function getStyles() {
  // Extract the main styles from your site
  return `
    :root {
      --bg-primary: #0a0a0f;
      --bg-secondary: #1a1a2e;
      --blue-primary: #3b82f6;
      --blue-light: #60a5fa;
      --blue-dark: #2563eb;
      --accent-orange: #f97316;
      --accent-purple: #a855f7;
      --text-primary: rgba(255, 255, 255, 0.95);
      --text-secondary: rgba(255, 255, 255, 0.7);
      --glass-bg: rgba(255, 255, 255, 0.05);
      --glass-border: rgba(255, 255, 255, 0.1);
    }
    
    * {
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
  `;
}

// Run the import
importToBuilder();