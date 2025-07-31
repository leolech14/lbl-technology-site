# Development Tools & Integration Stack

## 🎨 Visual UI Editors

### Installed CLI Tools
- ✅ **Builder.io CLI** (`@builder.io/cli`)
  - Status: Installed globally
  - Usage: `builder connect` to link project
  - Features: Drag & drop, real-time sync, API integration

- ✅ **Plasmic CLI** (`@plasmicapp/cli`)
  - Status: Installed globally
  - Usage: `plasmic sync` to sync designs
  - Features: Full visual editor, component library

### VS Code/Cursor Extensions

#### Currently Installed
- ✅ **Live Server** (ritwickdey.liveserver)
  - Real-time preview
  - Auto-reload on save

#### Recommended to Install
- 🔲 **Continue** - AI integration (best Claude bridge)
- 🔲 **Windsurf Editor** - Visual HTML/CSS editing
- 🔲 **Figma for VS Code** - Design integration
- 🔲 **CSS Peek** - Visual style editing
- 🔲 **Colorize** - Color visualization

## 🤖 AI Integration

### Active
- **Claude (via Cursor)** - Direct integration
  - Cmd+K: Inline edits
  - Cmd+L: Chat interface
  - Context-aware suggestions

### Communication Bridge
1. **Primary**: Cursor's built-in Claude integration
2. **Visual Feedback**: Screenshots + Live Server
3. **Code Sync**: Git commits visible to Claude

## 🛠️ Setup Instructions

### Builder.io Setup
```bash
# 1. Create account at builder.io
# 2. Initialize in project
cd /Users/lech/Outputs/github-pages-site
npm init -y
npm install @builder.io/react
builder connect

# 3. Import existing HTML
builder import ./index.html
```

### Plasmic Setup
```bash
# 1. Create account at plasmic.app
# 2. Initialize project
plasmic init
plasmic sync --yes

# 3. Configure for existing site
plasmic import-html ./index.html
```

### VS Code Extension Installation
```bash
# Install from command palette (Cmd+Shift+P)
# Search: "Extensions: Install Extensions"

# Or via terminal:
code --install-extension Continue.continue
code --install-extension windsurf-editor.windsurf
code --install-extension figma.figma-vscode-extension
```

## 📁 Project Structure Integration

```
github-pages-site/
├── index.html          # Main website
├── .builder/           # Builder.io config (after setup)
├── .plasmic/           # Plasmic config (after setup)
├── components/         # Extracted components
└── DEVELOPMENT_TOOLS.md # This file
```

## 🔄 Workflow

### Visual Editing Flow
1. **Edit visually** in Builder/Plasmic
2. **Sync changes** to codebase
3. **Claude reviews** via Cursor integration
4. **Test locally** with Live Server
5. **Deploy** via git push

### Component Modification
1. **Drag & Drop** in visual editor
2. **Adjust properties** (colors, sizes, spacing)
3. **Preview changes** in real-time
4. **Export code** to project
5. **Claude optimizes** the generated code

## 🎯 Quick Commands

```bash
# Start visual editing
builder open        # Open Builder.io editor
plasmic open       # Open Plasmic editor

# Sync changes
builder sync       # Pull Builder changes
plasmic sync      # Pull Plasmic changes

# Local preview
# Use VS Code Live Server or:
python -m http.server 8000

# Deploy
git add -A
git commit -m "Update from visual editor"
git push origin main
```

## 🔗 Useful Links

- [Builder.io Docs](https://www.builder.io/c/docs)
- [Plasmic Docs](https://docs.plasmic.app)
- [Continue (Claude integration)](https://continue.dev)
- [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

## 📝 Notes

- Both Builder.io and Plasmic offer free tiers
- Continue extension provides the best Claude integration
- Always commit before syncing from visual editors
- Use screenshots to share visual changes with Claude

---

Last Updated: July 31, 2025