// Plasmic Real-time Sync with Claude
const { exec } = require('child_process');
const fs = require('fs');

// Plasmic configuration
const PLASMIC_PROJECT = 'your-project-id'; // Get from Plasmic dashboard
const SYNC_INTERVAL = 5000; // Check every 5 seconds

// Watch for Plasmic changes
function watchPlasmic() {
    console.log('👁️  Watching Plasmic for changes...');
    
    setInterval(() => {
        exec('plasmic sync --yes --quiet', (error, stdout, stderr) => {
            if (stdout.includes('Synced')) {
                console.log('✅ Changes detected and synced!');
                notifyClaude();
            }
        });
    }, SYNC_INTERVAL);
}

// Notify Claude about changes
function notifyClaude() {
    const changes = {
        timestamp: new Date().toISOString(),
        files: ['components/PlasmicHome.tsx'],
        message: 'Plasmic components updated'
    };
    
    // Write changes for Claude to see
    fs.writeFileSync('.plasmic-changes.json', JSON.stringify(changes, null, 2));
    console.log('📢 Claude notified of changes');
}

// API endpoint to fetch latest
async function fetchLatestDesign() {
    const response = await fetch(`https://studio.plasmic.app/api/v1/projects/${PLASMIC_PROJECT}/preview`);
    return response.json();
}

// Start watching
watchPlasmic();

console.log(`
🔗 Plasmic + Claude Integration Active

1. Make changes in Plasmic Studio
2. Changes auto-sync to codebase
3. Claude sees updates immediately
4. Ask Claude to review/optimize

Quick commands:
- plasmic sync       # Manual sync
- plasmic open      # Open studio
- plasmic whoami    # Check auth
`);