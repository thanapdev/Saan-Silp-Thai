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
    const introScrollDuration = 2000;
    let isIntroFinished = false;
    let introCompletelyDone = false;
    
    // Set body height to match the absolute wrapper height so native scrollbar works
    const setBodyHeight = () => {
        if (introCompletelyDone) {
            if(!isTouchDevice && smoothWrapper) {
                document.body.style.height = `${smoothWrapper.getBoundingClientRect().height}px`;
            } else if (isTouchDevice && smoothWrapper) {
                document.body.style.paddingTop = `0px`;
                smoothWrapper.style.position = 'relative';
                smoothWrapper.style.top = `0px`;
            }
            return;
        }

        if(!isTouchDevice && smoothWrapper) {
            document.body.style.height = `${smoothWrapper.getBoundingClientRect().height + introScrollDuration}px`;
        } else if (isTouchDevice && smoothWrapper) {
            // Ensure touch devices also get the extra scroll height
            document.body.style.paddingTop = `${introScrollDuration}px`;
            smoothWrapper.style.position = 'absolute';
            smoothWrapper.style.top = `${introScrollDuration}px`;
            smoothWrapper.style.width = '100%';
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
            if (introCompletelyDone) {
                currentScroll = lerp(currentScroll, targetScroll, 0.08);
                smoothWrapper.style.transform = `translate3d(0, -${currentScroll}px, 0)`;
            } else {
                currentScroll = lerp(currentScroll, targetScroll, 0.08); // 0.08 controls smoothness
                
                let siteScroll = 0;
                let introProgress = 0;

                if (currentScroll < introScrollDuration) {
                    siteScroll = 0;
                    introProgress = currentScroll / introScrollDuration;
                } else {
                    siteScroll = currentScroll - introScrollDuration;
                    introProgress = 1;
                    if (!isIntroFinished) {
                        isIntroFinished = true;
                        
                        // Eject Intro!
                        introCompletelyDone = true;
                        const overlay = document.getElementById('intro-weave-overlay');
                        if(overlay) {
                            overlay.style.pointerEvents = 'none';
                            overlay.style.display = 'none'; // Completely hide
                        }
                        
                        // Instantly adjust scroll coordinates to match the new body height
                        window.scrollTo(0, targetScroll - introScrollDuration);
                        targetScroll = targetScroll - introScrollDuration;
                        currentScroll = currentScroll - introScrollDuration;
                        siteScroll = currentScroll;
                        
                        setBodyHeight(); // Re-evaluate body height without the intro buffer
                    }
                }

                // Translate the wrapper
                if (!introCompletelyDone) {
                    smoothWrapper.style.transform = `translate3d(0, -${siteScroll}px, 0)`;
                    
                    // Intro Animations
                    const overlay = document.getElementById('intro-weave-overlay');
                    if (overlay && introProgress < 1) {
                        const instruction = document.querySelector('.scroll-instruction');
                        const weaveContainer = document.querySelector('.weave-container');
                        
                        // Dynamically generate strips if not exists
                        const numStrips = 20;
                        const bambooColors = ['#D3B89E', '#C8AA8F', '#E2C8AE', '#B6967A'];
                        const blueColor = '#1A3C5A';
                        
                        if (weaveContainer && weaveContainer.children.length === 0) {
                            for(let i=0; i<numStrips; i++) {
                                // Horizontal Strip (Front Layer, Patterned Bamboo)
                                let hStrip = document.createElement('div');
                                hStrip.className = 'w-strip h-strip';
                                hStrip.style.top = `${(i/numStrips)*100}%`;
                                hStrip.style.height = `${100/numStrips}%`;
                                hStrip.style.zIndex = "2";
                                
                                let gradientParts = [];
                                const bColor = bambooColors[Math.floor(Math.random() * bambooColors.length)];
                                for (let x = 0; x < numStrips; x++) {
                                    // Diamond pattern (concentric rings)
                                    const d = Math.abs(x - 9.5) + Math.abs(i - 9.5);
                                    const isBamboo = (d % 8 < 4); 
                                    const color = isBamboo ? bColor : 'transparent';
                                    const startPct = (x / numStrips) * 100;
                                    const endPct = ((x + 1) / numStrips) * 100;
                                    gradientParts.push(`${color} ${startPct}%`);
                                    gradientParts.push(`${color} ${endPct}%`);
                                }
                                const gradient = `linear-gradient(to right, ${gradientParts.join(', ')})`;
                                hStrip.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.2) 100%), ${gradient}`;
                                hStrip.setAttribute('data-index', i);
                                weaveContainer.appendChild(hStrip);
                                
                                // Vertical Strip (Back Layer, Solid Blue)
                                let vStrip = document.createElement('div');
                                vStrip.className = 'w-strip v-strip';
                                vStrip.style.left = `${(i/numStrips)*100}%`;
                                vStrip.style.width = `${100/numStrips}%`;
                                vStrip.style.zIndex = "1";
                                vStrip.style.backgroundColor = blueColor;
                                vStrip.setAttribute('data-index', i);
                                weaveContainer.appendChild(vStrip);
                            }
                        }

                        const hStrips = document.querySelectorAll('.h-strip');
                        const vStrips = document.querySelectorAll('.v-strip');
                        const welcomeTitle = document.querySelector('.intro-welcome-title');

                        if (instruction) instruction.style.opacity = introProgress > 0.05 ? 0 : 1;
                        if (welcomeTitle) {
                            welcomeTitle.style.opacity = Math.max(0, 1 - (introProgress * 5)); // Fade out fast
                            welcomeTitle.style.transform = `translate(-50%, calc(-50% - ${introProgress * 50}px))`;
                        }

                        // Phase 1: Weave together (0 to 0.4)
                        let weaveProgress = Math.min(1, introProgress / 0.4);
                        
                        hStrips.forEach((strip, i) => {
                            const dir = i % 2 === 0 ? 1 : -1;
                            const delay = (i / numStrips) * 0.3; // Staggered weaving
                            let localProgress = Math.max(0, Math.min(1, (weaveProgress - delay) / 0.7));
                            localProgress = 1 - Math.pow(1 - localProgress, 3); // Ease out
                            const clipAmt = 100 - (localProgress * 100);
                            if (dir === 1) {
                                strip.style.clipPath = `inset(0 ${clipAmt}% 0 0)`; // Slide right
                            } else {
                                strip.style.clipPath = `inset(0 0 0 ${clipAmt}%)`; // Slide left
                            }
                        });

                        vStrips.forEach((strip, i) => {
                            const dir = i % 2 === 0 ? 1 : -1;
                            const delay = (i / numStrips) * 0.3;
                            let localProgress = Math.max(0, Math.min(1, (weaveProgress - delay) / 0.7));
                            localProgress = 1 - Math.pow(1 - localProgress, 3);
                            const clipAmt = 100 - (localProgress * 100);
                            if (dir === 1) {
                                strip.style.clipPath = `inset(0 0 ${clipAmt}% 0)`; // Slide down
                            } else {
                                strip.style.clipPath = `inset(${clipAmt}% 0 0 0)`; // Slide up
                            }
                        });

                        // Phase 2: Open Portal (0.6 to 1.0)
                        if (introProgress > 0.6) {
                            let openProgress = (introProgress - 0.6) / 0.4;
                            openProgress = openProgress * openProgress * openProgress; // Ease in cubic
                            overlay.style.opacity = 1 - openProgress;
                            weaveContainer.style.transform = `scale(${1 + (openProgress * 3)})`;
                        } else {
                            overlay.style.opacity = 1;
                            weaveContainer.style.transform = `scale(1)`;
                        }
                    } else if (overlay) {
                        overlay.style.opacity = 0;
                    }
                }
            }

        } else {
            // Fallback for touch devices
            if (introCompletelyDone) {
                currentScroll = window.scrollY;
                // No virtual transforms needed on native scroll
            } else {
                currentScroll = window.scrollY;
                
                let introProgress = 0;
                if (currentScroll < introScrollDuration) {
                    introProgress = currentScroll / introScrollDuration;
                } else {
                    introProgress = 1;
                    if (!isIntroFinished) {
                        isIntroFinished = true;
                        
                        // Eject Intro!
                        introCompletelyDone = true;
                        const overlay = document.getElementById('intro-weave-overlay');
                        if(overlay) {
                            overlay.style.pointerEvents = 'none';
                            overlay.style.display = 'none'; // Completely hide
                        }
                        
                        window.scrollTo(0, currentScroll - introScrollDuration);
                        setBodyHeight();
                    }
                }
                
                // Touch Device Intro Animations
                if (!introCompletelyDone) {
                    const overlay = document.getElementById('intro-weave-overlay');
                    if (overlay && introProgress < 1) {
                        const instruction = document.querySelector('.scroll-instruction');
                        const weaveContainer = document.querySelector('.weave-container');
                        
                        // Dynamically generate strips if not exists
                        const numStrips = 20;
                        const bambooColors = ['#D3B89E', '#C8AA8F', '#E2C8AE', '#B6967A'];
                        const blueColor = '#1A3C5A';
                        
                        if (weaveContainer && weaveContainer.children.length === 0) {
                            for(let i=0; i<numStrips; i++) {
                                let hStrip = document.createElement('div');
                                hStrip.className = 'w-strip h-strip';
                                hStrip.style.top = `${(i/numStrips)*100}%`;
                                hStrip.style.height = `${100/numStrips}%`;
                                hStrip.style.zIndex = "2";
                                
                                let gradientParts = [];
                                const bColor = bambooColors[Math.floor(Math.random() * bambooColors.length)];
                                for (let x = 0; x < numStrips; x++) {
                                    const d = Math.abs(x - 9.5) + Math.abs(i - 9.5);
                                    const isBamboo = (d % 8 < 4); 
                                    const color = isBamboo ? bColor : 'transparent';
                                    const startPct = (x / numStrips) * 100;
                                    const endPct = ((x + 1) / numStrips) * 100;
                                    gradientParts.push(`${color} ${startPct}%`);
                                    gradientParts.push(`${color} ${endPct}%`);
                                }
                                const gradient = `linear-gradient(to right, ${gradientParts.join(', ')})`;
                                hStrip.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.2) 100%), ${gradient}`;
                                hStrip.setAttribute('data-index', i);
                                weaveContainer.appendChild(hStrip);
                                
                                let vStrip = document.createElement('div');
                                vStrip.className = 'w-strip v-strip';
                                vStrip.style.left = `${(i/numStrips)*100}%`;
                                vStrip.style.width = `${100/numStrips}%`;
                                vStrip.style.zIndex = "1";
                                vStrip.style.backgroundColor = blueColor;
                                vStrip.setAttribute('data-index', i);
                                weaveContainer.appendChild(vStrip);
                            }
                        }

                        const hStrips = document.querySelectorAll('.h-strip');
                        const vStrips = document.querySelectorAll('.v-strip');
                        const welcomeTitle = document.querySelector('.intro-welcome-title');

                        if (instruction) instruction.style.opacity = introProgress > 0.05 ? 0 : 1;
                        if (welcomeTitle) {
                            welcomeTitle.style.opacity = Math.max(0, 1 - (introProgress * 5)); // Fade out fast
                            welcomeTitle.style.transform = `translate(-50%, calc(-50% - ${introProgress * 50}px))`;
                        }

                        let weaveProgress = Math.min(1, introProgress / 0.4);
                        
                        hStrips.forEach((strip, i) => {
                            const dir = i % 2 === 0 ? 1 : -1;
                            const delay = (i / numStrips) * 0.3;
                            let localProgress = Math.max(0, Math.min(1, (weaveProgress - delay) / 0.7));
                            localProgress = 1 - Math.pow(1 - localProgress, 3);
                            const clipAmt = 100 - (localProgress * 100);
                            if (dir === 1) {
                                strip.style.clipPath = `inset(0 ${clipAmt}% 0 0)`;
                            } else {
                                strip.style.clipPath = `inset(0 0 0 ${clipAmt}%)`;
                            }
                        });

                        vStrips.forEach((strip, i) => {
                            const dir = i % 2 === 0 ? 1 : -1;
                            const delay = (i / numStrips) * 0.3;
                            let localProgress = Math.max(0, Math.min(1, (weaveProgress - delay) / 0.7));
                            localProgress = 1 - Math.pow(1 - localProgress, 3);
                            const clipAmt = 100 - (localProgress * 100);
                            if (dir === 1) {
                                strip.style.clipPath = `inset(0 0 ${clipAmt}% 0)`;
                            } else {
                                strip.style.clipPath = `inset(${clipAmt}% 0 0 0)`;
                            }
                        });

                        if (introProgress > 0.6) {
                            let openProgress = (introProgress - 0.6) / 0.4;
                            overlay.style.opacity = 1 - openProgress;
                            weaveContainer.style.transform = `scale(${1 + (openProgress * 3)})`;
                        } else {
                            overlay.style.opacity = 1;
                            weaveContainer.style.transform = `scale(1)`;
                        }
                    } else if (overlay) {
                        overlay.style.opacity = 0;
                    }
                }
            }
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
