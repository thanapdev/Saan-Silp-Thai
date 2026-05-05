// Utility function for Linear Interpolation (Lerp)
const lerp = (a, b, n) => (1 - n) * a + n * b;

document.addEventListener('DOMContentLoaded', () => {

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // --- 1. Custom Premium Cursor ---
    const cursorDot = document.querySelector('.cursor-dot-premium');
    const cursorFollower = document.querySelector('.cursor-follower-premium');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    if (!isTouchDevice && cursorDot && cursorFollower) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        });

        const renderCursor = () => {
            followerX = lerp(followerX, mouseX, 0.12);
            followerY = lerp(followerY, mouseY, 0.12);
            cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);

        const viewElements = document.querySelectorAll('.cursor-view, .card-image-box');
        viewElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover-view'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover-view'));
        });

        const activeElements = document.querySelectorAll('a, button, .hamburger');
        activeElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover-active'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover-active'));
        });
    }

    // --- 2. Magnetic Elements ---
    if (!isTouchDevice) {
        // Magnetic Inner (moves inner element when hovering container, used for masterpiece grid)
        document.querySelectorAll('.magnetic-container').forEach(container => {
            const inner = container.querySelector('.magnetic-inner');
            if(inner) {
                container.addEventListener('mousemove', (e) => {
                    const rect = container.getBoundingClientRect();
                    const strength = inner.getAttribute('data-strength') || 15;
                    const x = e.clientX - (rect.left + rect.width / 2);
                    const y = e.clientY - (rect.top + rect.height / 2);
                    inner.style.transform = `translate3d(${x / rect.width * strength}px, ${y / rect.height * strength}px, 0) scale(1.05)`;
                });
                container.addEventListener('mouseleave', () => {
                    inner.style.transition = 'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
                    inner.style.transform = `translate3d(0px, 0px, 0) scale(1)`;
                    setTimeout(() => inner.style.transition = 'transform 0.1s linear', 800);
                });
            }
        });
    }

    // --- 3. Scroll Reveals (Intersection Observer) ---
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -10% 0px" });

    document.querySelectorAll('.reveal-up, .reveal-fade, .scroll-reveal-up, .scroll-reveal-fade, .scroll-mask-reveal, .scroll-scale-down').forEach(el => scrollObserver.observe(el));

    setTimeout(() => {
        document.querySelectorAll('#hero-premium .reveal-up, #hero-premium .reveal-fade, #hero-premium .scroll-scale-down').forEach(el => el.classList.add('is-revealed'));
    }, 1500);


    // --- 4. Smooth Scroll & Animation Loop ---
    const smoothWrapper = document.getElementById('smooth-scroll-wrapper');
    const header = document.getElementById('main-header');
    const horizontalSection = document.getElementById('horizontal-scroll-section');
    const horizontalTrack = document.querySelector('.horizontal-track');
    const marqueeTrack = document.querySelector('.scroll-marquee-track');
    const parallaxImgs = document.querySelectorAll('.parallax-img');
    const scatterImgs = document.querySelectorAll('.scatter-img');

    // Virtual Scroll Setup
    let targetScroll = window.scrollY;
    let currentScroll = targetScroll;
    
    // Set body height to match the absolute wrapper height so native scrollbar works
    const setBodyHeight = () => {
        if(!isTouchDevice && smoothWrapper) {
            document.body.style.height = `${smoothWrapper.getBoundingClientRect().height}px`;
        }
    };
    
    // Call on load and resize
    setTimeout(setBodyHeight, 500);
    window.addEventListener('resize', setBodyHeight);

    window.addEventListener('scroll', () => {
        targetScroll = window.scrollY;
    });

    const renderScroll = () => {
        // Lerp scroll
        if (!isTouchDevice && smoothWrapper) {
            currentScroll = lerp(currentScroll, targetScroll, 0.08); // 0.08 controls smoothness
            
            // Translate the wrapper
            smoothWrapper.style.transform = `translate3d(0, -${currentScroll}px, 0)`;
        } else {
            // Fallback for touch devices
            currentScroll = window.scrollY;
        }

        // --- Animations dependent on currentScroll ---

        // Header Scrolled
        if (header) {
            if (currentScroll > window.innerHeight - 100) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }

        // Hero Inner Parallax
        const heroInner = document.querySelector('.hero-bg-img');
        if (heroInner && currentScroll < window.innerHeight) {
            heroInner.style.transform = `translate3d(0, ${currentScroll * -0.3}px, 0) scale(1.1)`;
        }

        // Marquee
        if (marqueeTrack) {
            const speed = marqueeTrack.getAttribute('data-speed') || 1;
            const dir = marqueeTrack.getAttribute('data-direction') === 'left' ? -1 : 1;
            // Constant move + scroll speed boost
            marqueeTrack.style.transform = `translate3d(${currentScroll * dir * speed * 0.5}px, 0, 0)`;
        }

        // Image Mask Inner Parallax
        maskContainers.forEach(container => {
            // Need to calculate rect based on the translated wrapper
            const containerTop = container.offsetTop; 
            // Approximation for demo, true offset needs recursive parent calculation, but offsetTop works if parent is relative
            let offset = container.getBoundingClientRect().top; 
            if(!isTouchDevice) {
               // Since smoothWrapper is translated, getBoundingClientRect gets the translated position.
            }

            const rect = container.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const img = container.querySelector('.parallax-img');
                if (img) {
                    const speed = img.getAttribute('data-speed') || 0.15;
                    const relativeScroll = (window.innerHeight - rect.top) * speed;
                    img.style.transform = `translate3d(0, ${relativeScroll}px, 0) scale(1.1)`;
                }
            }
        });

        // Scattered Gallery Parallax
        scatterImgs.forEach(img => {
            const rect = img.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = img.getAttribute('data-speed') || 0.2;
                const relativeScroll = (window.innerHeight - rect.top) * speed;
                img.style.transform = `translate3d(0, ${relativeScroll}px, 0)`;
            }
        });

        // Horizontal Scroll
        if (horizontalSection && horizontalTrack && !isTouchDevice) {
            const rect = horizontalSection.getBoundingClientRect();
            const stickyWrapper = horizontalSection.querySelector('.horizontal-sticky-wrapper');
            
            if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                // Section is active (pinned)
                const scrollProgress = Math.abs(rect.top) / (rect.height - window.innerHeight);
                const maxScroll = horizontalTrack.scrollWidth - window.innerWidth;
                const translateValue = scrollProgress * maxScroll;
                
                horizontalTrack.style.transform = `translate3d(-${translateValue}px, 0, 0)`;
                
                // Polyfill for sticky: counter-translate the wrapper downwards
                if (stickyWrapper) {
                    stickyWrapper.style.transform = `translate3d(0, ${Math.abs(rect.top)}px, 0)`;
                }
            } else if (rect.top > 0) {
                // Before section
                horizontalTrack.style.transform = `translate3d(0, 0, 0)`;
                if (stickyWrapper) stickyWrapper.style.transform = `translate3d(0, 0, 0)`;
            } else if (rect.bottom < window.innerHeight) {
                // After section
                const maxScroll = horizontalTrack.scrollWidth - window.innerWidth;
                horizontalTrack.style.transform = `translate3d(-${maxScroll}px, 0, 0)`;
                if (stickyWrapper) stickyWrapper.style.transform = `translate3d(0, ${rect.height - window.innerHeight}px, 0)`;
            }
        }

        requestAnimationFrame(renderScroll);
    };

    // Store mask containers for use in render loop
    const maskContainers = document.querySelectorAll('.mask-image-container');
    
    // Start loop
    requestAnimationFrame(renderScroll);

});
