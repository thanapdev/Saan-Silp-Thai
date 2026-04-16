// --- Preloader Script ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Ensure the animation is visible for at least 1.2 seconds, plus loading time.
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            document.body.classList.remove('loading');
        }, 1200);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    
    /* 1. Sticky Header */
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        /* 2. Parallax Effect for Hero Background */
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            let scrollPosition = window.pageYOffset;
            heroBg.style.transform = `translateY(${scrollPosition * 0.4}px) scale(1.05)`;
        }
    });

    /* 3. Mobile Navigation Menu */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animate Hamburger (Optional: change to cross)
            hamburger.classList.toggle('toggle');
        });
    }

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    /* 4. Intersection Observer for Scroll Animations */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                // Determine which animation to apply based on class
                if (entry.target.classList.contains('fade-in-up')) {
                    entry.target.style.animation = `fadeInUp 1s cubic-bezier(0.25, 1, 0.5, 1) forwards`;
                } else if (entry.target.classList.contains('fade-in-left')) {
                    entry.target.style.animation = `fadeInLeft 1s cubic-bezier(0.25, 1, 0.5, 1) forwards`;
                } else if (entry.target.classList.contains('fade-in-right')) {
                    entry.target.style.animation = `fadeInRight 1s cubic-bezier(0.25, 1, 0.5, 1) forwards`;
                } else {
                    entry.target.style.animation = `fadeIn 1s cubic-bezier(0.25, 1, 0.5, 1) forwards`;
                }
                
                // Add delay if specified
                if (entry.target.style.transitionDelay) {
                    entry.target.style.animationDelay = entry.target.style.transitionDelay;
                }

                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
});
