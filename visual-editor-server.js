const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8080;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// CORS for local development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// API endpoint to save changes
app.post('/api/save', (req, res) => {
    const { html, css, components } = req.body;
    
    // Save to a file that Claude can read
    const content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visual Editor Output</title>
    <style>${css}</style>
</head>
<body>
    ${html}
</body>
</html>`;
    
    fs.writeFileSync('visual-edited-output.html', content);
    console.log('✅ Saved changes - Claude can now see them!');
    
    res.json({ success: true, message: 'Saved successfully' });
});

// API endpoint to get current content
app.get('/api/content', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf8');
    res.json({ content });
});

// Serve the enhanced editor
app.get('/editor', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Visual Editor with Real-time Sync</title>
    <link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet">
    <script src="https://unpkg.com/grapesjs"></script>
    <style>
        body, html { height: 100%; margin: 0; }
        #gjs { height: calc(100% - 50px); }
        .toolbar {
            background: #1a1a2e;
            color: white;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 50px;
        }
        .sync-status { color: #60a5fa; }
        button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin: 0 5px;
        }
        button:hover { background: #60a5fa; }
    </style>
</head>
<body>
    <div class="toolbar">
        <div>
            <button onclick="editor.runCommand('sw-visibility')">📱 Toggle panels</button>
            <button onclick="editor.runCommand('fullscreen')">🖥️ Fullscreen</button>
            <button onclick="editor.runCommand('core:undo')">↩️ Undo</button>
            <button onclick="editor.runCommand('core:redo')">↪️ Redo</button>
        </div>
        <div class="sync-status" id="status">Connected to Claude sync</div>
        <div>
            <button onclick="exportHTML()">📥 Export HTML</button>
            <button onclick="saveChanges()" style="background: #10b981;">💾 Save to Claude</button>
        </div>
    </div>
    
    <div id="gjs"></div>

    <script>
        // Your dark portfolio content
        const portfolioHTML = \`${fs.readFileSync('index.html', 'utf8')
            .replace(/`/g, '\\`')
            .replace(/\$/g, '\\$')}\`;
        
        // Initialize editor
        const editor = grapesjs.init({
            container: '#gjs',
            fromElement: false,
            height: '100%',
            width: 'auto',
            storageManager: false,
            canvas: {
                styles: ['https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap']
            }
        });
        
        // Load content
        editor.setComponents(portfolioHTML);
        
        // Real-time save function
        async function saveChanges() {
            const html = editor.getHtml();
            const css = editor.getCss();
            
            try {
                const response = await fetch('/api/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ html, css })
                });
                
                if (response.ok) {
                    document.getElementById('status').textContent = '✅ Synced with Claude at ' + new Date().toLocaleTimeString();
                }
            } catch (error) {
                console.error('Save error:', error);
            }
        }
        
        // Auto-save on changes
        let saveTimeout;
        editor.on('change:canvas', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveChanges, 2000); // Auto-save after 2 seconds
        });
        
        // Export function
        function exportHTML() {
            const html = editor.getHtml();
            const css = editor.getCss();
            const fullHTML = \`<!DOCTYPE html>
<html>
<head>
    <style>\${css}</style>
</head>
<body>\${html}</body>
</html>\`;
            
            const blob = new Blob([fullHTML], { type: 'text/html' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'edited-portfolio.html';
            a.click();
        }
        
        console.log('Visual Editor ready with Claude sync!');
    </script>
</body>
</html>
    `);
});

app.listen(PORT, () => {
    console.log(`
🎨 Visual Editor Server Running!
================================
📝 Editor: http://localhost:${PORT}/editor
🔄 Auto-saves to: visual-edited-output.html
🤖 Claude can read changes in real-time!

Instructions:
1. Open the editor URL above
2. Drag, drop, edit visually
3. Changes auto-save every 2 seconds
4. Claude sees updates in visual-edited-output.html
    `);
});