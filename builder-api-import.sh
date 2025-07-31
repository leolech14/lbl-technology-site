#!/bin/bash

# Builder.io API Import Script
API_KEY="e19bb9554845477c84fa4345b2f84479"
CONTENT_ID="ac89409dbd434299b6d9e85ae1891c3b"

echo "🚀 Importing to Builder.io..."

# Create the import payload
cat > builder-payload.json << 'EOF'
{
  "name": "Premium Dark Portfolio",
  "data": {
    "title": "AI-Native Builder Portfolio",
    "blocks": [
      {
        "@type": "@builder.io/sdk:Element",
        "component": {
          "name": "Custom Code",
          "options": {
            "code": "<div style='background: #0a0a0f; color: white; padding: 40px; text-align: center;'><h1 style='font-size: 3rem; background: linear-gradient(135deg, #3b82f6, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>AI-Native Builder</h1><p style='font-size: 1.5rem; color: #60a5fa;'>Making 2025 look like 1995</p></div>",
            "styles": {
              "minHeight": "100vh",
              "display": "flex",
              "alignItems": "center",
              "justifyContent": "center"
            }
          }
        }
      },
      {
        "@type": "@builder.io/sdk:Element", 
        "component": {
          "name": "Text",
          "options": {
            "text": "Import your full HTML to start visual editing!"
          }
        }
      }
    ]
  }
}
EOF

# Make the API call
curl -X PATCH \
  "https://builder.io/api/v2/content/page/$CONTENT_ID" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d @builder-payload.json

echo -e "\n\n✅ Import initiated!"
echo "🎨 Edit your page at: https://builder.io/content/$CONTENT_ID/edit"
echo ""
echo "Next steps:"
echo "1. Open the Builder.io editor (link above)"
echo "2. You'll see the imported content"
echo "3. Use the visual tools to:"
echo "   - Drag components around"
echo "   - Change colors with picker"
echo "   - Add new sections"
echo "   - Export back to code"