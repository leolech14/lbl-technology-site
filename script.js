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
});