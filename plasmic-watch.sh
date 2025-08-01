#!/bin/bash

# Plasmic Real-time Sync Script
echo "🔄 Starting Plasmic real-time sync..."
echo "Project ID: xfLZfGGmVxgqZrJoXmd1sY"
echo ""
echo "👁️  Watching for changes in Plasmic Studio..."
echo "Make changes at: https://studio.plasmic.app/projects/xfLZfGGmVxgqZrJoXmd1sY"
echo ""
echo "Press Ctrl+C to stop"

# Run sync in loop
while true; do
    plasmic sync --projects xfLZfGGmVxgqZrJoXmd1sY --yes --quiet
    sleep 5
done