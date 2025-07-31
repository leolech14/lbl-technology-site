// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Lazy load images
            if (entry.target.dataset.src) {
                entry.target.src = entry.target.dataset.src;
                entry.target.removeAttribute('data-src');
                entry.target.classList.add('loaded');
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.animate-on-scroll, .lazy-load').forEach(el => {
    observer.observe(el);
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update focus for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus();
        }
    });
});

// Add Loading States to Buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('mailto:')) {
            this.classList.add('loading');
            
            // Remove loading state after animation
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        }
    });
});

// Enhance Service Cards with Hover Effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transitionDelay = '0s';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transitionDelay = '0.1s';
    });
});

// Performance: Reduce Motion for Users Who Prefer It
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function handleReducedMotionChange() {
    if (prefersReducedMotion.matches) {
        document.documentElement.classList.add('reduce-motion');
    } else {
        document.documentElement.classList.remove('reduce-motion');
    }
}

prefersReducedMotion.addListener(handleReducedMotionChange);
handleReducedMotionChange();

// Add Keyboard Navigation Enhancement
let lastFocusedElement = null;

document.addEventListener('keydown', (e) => {
    // Tab Navigation Enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Optimize Scroll Performance
let ticking = false;

function updateScrollProgress() {
    const scrolled = window.pageYOffset;
    const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (scrolled / maxHeight) * 100;
    
    // Update any scroll-based animations here
    document.documentElement.style.setProperty('--scroll-progress', scrollProgress + '%');
    
    ticking = false;
}

document.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add animate-on-scroll class to sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('animate-on-scroll');
    });
    
    // Initialize glow effects
    initializeGlowEffects();
});

// Glow Effects and Particle System
function initializeGlowEffects() {
    // Create floating particles
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);
    
    // Generate particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.setProperty('--delay', Math.random() * 20 + 's');
        particle.style.setProperty('--duration', Math.random() * 20 + 20 + 's');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particleContainer.appendChild(particle);
    }
}

// Tech Glow Cursor Effect
let mouseX = 0;
let mouseY = 0;
let cursorGlow = null;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!cursorGlow) {
        cursorGlow = document.createElement('div');
        cursorGlow.className = 'cursor-glow';
        document.body.appendChild(cursorGlow);
    }
    
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';
});

// Add glitch effect on hover for tech elements
document.querySelectorAll('.nav-brand h1, .hero-title').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.classList.add('glitch');
    });
    
    element.addEventListener('mouseleave', function() {
        setTimeout(() => {
            this.classList.remove('glitch');
        }, 300);
    });
});

// Parallax Effect for Background
let lastScrollY = window.scrollY;

function updateParallax() {
    const scrolled = window.scrollY;
    const rate = scrolled * -0.5;
    
    document.body.style.setProperty('background-position', `center ${rate}px`);
}

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Dynamic Gradient Animation
function animateGradients() {
    const gradientElements = document.querySelectorAll('.gradient-text');
    
    gradientElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            
            element.style.setProperty('--gradient-x', `${xPercent}%`);
            element.style.setProperty('--gradient-y', `${yPercent}%`);
        });
    });
}

animateGradients();

// Type Writer Effect for Hero Subtitle
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typewriter when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const subtitle = entry.target.querySelector('.hero-subtitle');
            if (subtitle && !subtitle.classList.contains('typed')) {
                subtitle.classList.add('typed');
                typeWriter(subtitle, subtitle.textContent);
            }
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Enhanced Card Tilt Effect
document.querySelectorAll('.service-card, .domain-item, .expertise-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Particle System Enhancement
function createAdvancedParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 6 + 2;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    const startX = Math.random() * window.innerWidth;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startX}px`;
    particle.style.setProperty('--duration', `${duration}s`);
    particle.style.setProperty('--delay', `${delay}s`);
    
    // Random color between cyan and gold
    const colors = ['var(--accent-cyan)', 'var(--accent-gold)', 'rgba(165, 180, 252, 0.8)'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    return particle;
}

// Replace basic particles with advanced ones
document.addEventListener('DOMContentLoaded', () => {
    const particleContainer = document.querySelector('.particle-container');
    if (particleContainer) {
        // Clear existing particles
        particleContainer.innerHTML = '';
        
        // Create new advanced particles
        for (let i = 0; i < 40; i++) {
            particleContainer.appendChild(createAdvancedParticle());
        }
    }
});