
// Update project cards with generated images
document.addEventListener('DOMContentLoaded', () => {
  const projectImages = {
    'AI Content Creation Platform': 'ai-content-platform',
    'Premium E-Commerce Platform': 'ecommerce-platform', 
    'Interactive Data Visualization': 'data-visualization',
    'Developer Productivity Suite': 'developer-tools',
    'Family Management App': 'family-app',
    '3D Product Showcase': '3d-showcase'
  };
  
  document.querySelectorAll('.project-card').forEach((card, index) => {
    const title = card.querySelector('h3')?.textContent;
    const imageId = projectImages[title];
    
    if (imageId) {
      const projectImage = card.querySelector('.project-image');
      if (projectImage) {
        // Replace emoji with actual image
        projectImage.innerHTML = `
          <img src="assets/generated/projects/${imageId}-optimized.jpg" 
               alt="${title}"
               loading="lazy"
               style="width: 100%; height: 100%; object-fit: cover;">
        `;
      }
    }
  });
});