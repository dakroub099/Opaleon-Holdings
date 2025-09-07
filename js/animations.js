// Enhanced animations combining best of both approaches
document.addEventListener('DOMContentLoaded', function() {
    
    // Set current year
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Navigation scroll effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, index * 100); // Stagger animations
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for aura (throttled)
    const aura = document.querySelector('.opal-aura');
    let ticking = false;
    let lastScrollY = 0;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        if (Math.abs(scrolled - lastScrollY) > 5) { // Only update if significant scroll
            const speed = 0.05;
            aura.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
            lastScrollY = scrolled;
        }
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateParallax);
        }
    }
    
    // Throttle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(requestTick, 10);
    }, { passive: true });
    
    // Counter animation for metrics
    const counters = document.querySelectorAll('.metric-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseFloat(entry.target.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.textContent = current.toFixed(1);
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.textContent = target % 1 === 0 ? target : target.toFixed(1);
                    }
                };
                
                updateCounter();
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Simplified mouse move effect for hero gem
    const heroGem = document.querySelector('.hero-opal');
    if (heroGem) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let isAnimating = false;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 10;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 10;
        });
        
        function animateGem() {
            if (!isAnimating) return;
            
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;
            
            heroGem.style.transform = `rotateX(${15 + currentY}deg) rotateY(${currentX}deg)`;
            requestAnimationFrame(animateGem);
        }
        
        // Only animate when hero is visible
        const heroObserver = new IntersectionObserver((entries) => {
            isAnimating = entries[0].isIntersecting;
            if (isAnimating) animateGem();
        });
        
        heroObserver.observe(heroGem);
    }
    
    // Simplified hover effects to cards
    const cards = document.querySelectorAll('.visual-card, .about-card, .metric-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02) translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
    
    // Performance optimization - removed redundant scroll handler
    
    // Initial animation trigger
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('loaded');
        }
    }, 100);
});
