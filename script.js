
    // Mobile Menu Functionality
    document.addEventListener('DOMContentLoaded', function() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu-container');

        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileMenu.classList.toggle('hidden');
            });

            // Close when clicking links inside
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.classList.contains('hidden') && 
                    !mobileMenu.contains(e.target) && 
                    !menuBtn.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                }
            });
        }

        // Scroll Animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // Back to Top Functionality - FIXED
        const backToTopBtn = document.getElementById('backToTop');
        
        if (backToTopBtn) {
            const toggleButton = () => {
                if (window.scrollY > 400) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            };

            // Listen for scroll events
            window.addEventListener('scroll', toggleButton);
            
            // Initial check
            toggleButton();

            // Smooth scroll to top when clicked
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Video Playback Functionality
        function pauseAllOthers(currentVideo) {
            document.querySelectorAll('video').forEach(video => {
                if (video !== currentVideo && !video.paused) {
                    video.pause();
                    const overlay = video.parentElement.querySelector('.video-overlay');
                    if (overlay) overlay.style.display = 'flex';
                }
            });
        }

        function playVideo(overlay) {
            const video = overlay.parentElement.querySelector('video');
            pauseAllOthers(video);
            video.play();
            overlay.style.display = 'none';
        }

        function togglePlayPause(video) {
            const overlay = video.parentElement.querySelector('.video-overlay');
            if (video.paused) {
                pauseAllOthers(video);
                video.play();
                overlay.style.display = 'none';
            } else {
                video.pause();
                overlay.style.display = 'flex';
            }
        }

        // Add event listeners to videos
        document.querySelectorAll('.video-overlay').forEach(overlay => {
            overlay.addEventListener('click', function() {
                playVideo(this);
            });
        });

        document.querySelectorAll('video').forEach(video => {
            video.addEventListener('click', function() {
                togglePlayPause(this);
            });
            
            video.addEventListener('ended', function() {
                this.parentElement.querySelector('.video-overlay').style.display = 'flex';
            });
        });

        // Dynamic Hover Metrics
        const containers = document.querySelectorAll('.video-container, .image-container');
        let currentHoveredContainer = null;
        
        containers.forEach(container => {
            container.addEventListener('mouseenter', function() {
                if (currentHoveredContainer) {
                    hideMetrics(currentHoveredContainer);
                }
                currentHoveredContainer = this;
                showMetrics(this);
            });
            
            container.addEventListener('mouseleave', function() {
                if (currentHoveredContainer === this) {
                    hideMetrics(this);
                    currentHoveredContainer = null;
                }
            });
        });

        function showMetrics(container) {
            const section = container.closest('section');
            if(!section) return;
            
            const card = section.querySelector('.metrics-placeholder');
            if(!card) return;

            const type = container.getAttribute('data-type');
            const viewCount = container.getAttribute('data-views') || '0';
            let row2Label = 'Followers', row2Value = '+' + (container.getAttribute('data-followers') || '0');
            let row3Label = 'Likes', row3Value = container.getAttribute('data-likes') || '0';

            if (type === 'story') {
                row2Label = 'Clicks';
                row2Value = container.getAttribute('data-clicks') || '0';
                row3Label = 'Channel';
                row3Value = container.getAttribute('data-channel') || 'IG';
            }

            const dl = card.querySelector('dl');
            
            // Update metrics
            dl.children[0].querySelector('dt').innerText = 'Views';
            dl.children[0].querySelector('dd').className = "text-2xl font-extrabold text-gray-900";
            dl.children[0].querySelector('dd').innerText = viewCount;

            dl.children[1].querySelector('dt').innerText = row2Label;
            dl.children[1].querySelector('dd').className = "text-2xl font-extrabold text-orange-600";
            dl.children[1].querySelector('dd').innerText = row2Value;

            dl.children[2].querySelector('dt').innerText = row3Label;
            dl.children[2].querySelector('dd').className = "text-2xl font-extrabold text-gray-900";
            dl.children[2].querySelector('dd').innerText = row3Value;
        }

        function hideMetrics(container) {
            const section = container.closest('section');
            if(!section) return;
            
            const card = section.querySelector('.metrics-placeholder');
            if(!card) return;

            const dl = card.querySelector('dl');
            
            // Reset metrics
            dl.children[0].querySelector('dt').innerText = 'Views';
            dl.children[0].querySelector('dd').className = "text-2xl font-extrabold text-gray-200";
            dl.children[0].querySelector('dd').innerText = '---';

            dl.children[1].querySelector('dt').innerText = 'Followers';
            dl.children[1].querySelector('dd').className = "text-2xl font-extrabold text-orange-100";
            dl.children[1].querySelector('dd').innerText = '---';

            dl.children[2].querySelector('dt').innerText = 'Likes';
            dl.children[2].querySelector('dd').className = "text-2xl font-extrabold text-gray-200";
            dl.children[2].querySelector('dd').innerText = '---';
        }

        // Number Counting Animation
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateValue(entry.target);
                    countObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.count-up').forEach(el => {
            countObserver.observe(el);
        });

        function animateValue(obj) {
            const originalText = obj.innerText;
            const match = originalText.match(/([^\d\.]*)([\d\.]+)([^\d\.]*)/);
            
            if (match) {
                const prefix = match[1] || "";
                const value = parseFloat(match[2]);
                const suffix = match[3] || "";
                const duration = 1500;
                let startTimestamp = null;

                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const currentVal = (value * easeProgress).toFixed(value % 1 === 0 ? 0 : 1);
                    obj.innerText = `${prefix}${currentVal}${suffix}`;

                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        obj.innerText = originalText;
                    }
                };
                window.requestAnimationFrame(step);
            }
        }
    });
