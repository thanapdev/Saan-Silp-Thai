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

    /* 5. Product Showcase Carousel */
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const particles = document.querySelectorAll('.floating-particles .floating-element');

    if (track && slides.length > 0 && nextButton && prevButton) {
        let currentIndex = 0;
        let autoPlayInterval;

        const randomizeParticles = () => {
            // กำหนด 5 โซนพื้นที่ที่ "ไม่มีวันทับซ้อนกัน"
            const zones = [
                { lMin: 5, lMax: 20, tMin: 10, tMax: 35 }, // บน-ซ้าย
                { lMin: 5, lMax: 20, tMin: 65, tMax: 85 }, // ล่าง-ซ้าย
                { lMin: 75, lMax: 90, tMin: 10, tMax: 35 }, // บน-ขวา
                { lMin: 75, lMax: 90, tMin: 65, tMax: 85 }, // ล่าง-ขวา
                { lMin: 40, lMax: 60, tMin: 5, tMax: 15 }   // ตรงกลาง-บน (ช่วงหัวเว็บ ไม่โดนรูป)
            ];

            // สลับโซนเพื่อให้แน่ใจว่าไอเทมสลับที่กันอย่างอิสระ (Random Shuffle Zones)
            for (let i = zones.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [zones[i], zones[j]] = [zones[j], zones[i]];
            }

            particles.forEach((p, index) => {
                // แจกจ่ายโซนให้ 5 วัตถุดิบแบบ 1 ต่อ 1
                const zone = zones[index];
                const randomLeft = Math.floor(Math.random() * (zone.lMax - zone.lMin + 1)) + zone.lMin;
                const randomTop = Math.floor(Math.random() * (zone.tMax - zone.tMin + 1)) + zone.tMin;
                
                p.style.top = `${randomTop}%`;
                p.style.left = `${randomLeft}%`;
            });
        };

        const updateSlidePosition = () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = 'translateX(-' + (slideWidth * currentIndex) + 'px)';
            randomizeParticles(); // Shift particles around safely
        };

        const moveToNextSlide = () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to the first slide
            }
            updateSlidePosition();
        };

        const moveToPrevSlide = () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = slides.length - 1; // Loop back to the last slide
            }
            updateSlidePosition();
        };

        const startAutoPlay = () => {
            autoPlayInterval = setInterval(moveToNextSlide, 5000);
        };

        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        };

        // Window resize event to recalculate slide width
        window.addEventListener('resize', updateSlidePosition);

        nextButton.addEventListener('click', () => {
            moveToNextSlide();
            resetAutoPlay(); // Reset timer on manual click
        });

        prevButton.addEventListener('click', () => {
            moveToPrevSlide();
            resetAutoPlay(); // Reset timer on manual click
        });

        // Initialize particles & start auto play
        randomizeParticles();
        startAutoPlay();
    }
});
