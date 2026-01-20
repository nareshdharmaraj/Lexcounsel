// ===================================
// PARALLAX SCROLLING EFFECTS
// ===================================

class ParallaxEffect {
    constructor() {
        this.parallaxElements = document.querySelectorAll('[data-speed]');
        this.ticking = false;
        this.init();
    }

    init() {
        if (this.parallaxElements.length > 0) {
            window.addEventListener('scroll', () => {
                if (!this.ticking) {
                    window.requestAnimationFrame(() => {
                        this.updateParallax();
                        this.ticking = false;
                    });
                    this.ticking = true;
                }
            });

            // Initial update
            this.updateParallax();
        }
    }

    updateParallax() {
        const scrolled = window.pageYOffset;

        this.parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ===================================
// MOUSE PARALLAX EFFECT
// ===================================

class MouseParallax {
    constructor() {
        this.parallaxContainers = document.querySelectorAll('.parallax-container');
        this.init();
    }

    init() {
        this.parallaxContainers.forEach(container => {
            const shapes = container.querySelectorAll('.shape, .geo-shape');

            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                shapes.forEach((shape, index) => {
                    const speed = (index + 1) * 10;
                    const xMove = (x - 0.5) * speed;
                    const yMove = (y - 0.5) * speed;

                    shape.style.transform = `translate(${xMove}px, ${yMove}px)`;
                });
            });

            container.addEventListener('mouseleave', () => {
                shapes.forEach(shape => {
                    shape.style.transform = 'translate(0, 0)';
                });
            });
        });
    }
}

// ===================================
// FLOATING CARD ANIMATIONS
// ===================================

class FloatingCards {
    constructor() {
        this.cards = document.querySelectorAll('.floating-card, .floating-card-alt');
        this.init();
    }

    init() {
        this.cards.forEach((card, index) => {
            // Add slight delay to each card
            card.style.animationDelay = `${index * 0.2}s`;

            // Add tilt effect on hover
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
}

// ===================================
// GRADIENT ANIMATION
// ===================================

class GradientAnimation {
    constructor() {
        this.gradientElements = document.querySelectorAll('.gradient-text, .gradient-text-alt, .gradient-bg');
        this.init();
    }

    init() {
        this.gradientElements.forEach(element => {
            let hue = 0;

            setInterval(() => {
                hue = (hue + 1) % 360;

                if (element.classList.contains('gradient-bg')) {
                    element.style.filter = `hue-rotate(${hue}deg)`;
                }
            }, 50);
        });
    }
}

// ===================================
// PARTICLE BACKGROUND EFFECT
// ===================================

class ParticleBackground {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.particleCount = 50;
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '0.3';
        this.canvas.style.zIndex = '0';

        this.container.style.position = 'relative';
        this.container.insertBefore(this.canvas, this.container.firstChild);

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        // Create particles
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        // Start animation
        this.animate();

        // Handle resize
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Get primary color from CSS variable
        const primaryColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary').trim();

        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = primaryColor || '#6366f1';
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();

            // Draw connections
            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = primaryColor || '#6366f1';
                    this.ctx.globalAlpha = (1 - distance / 100) * 0.2;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// WAVE ANIMATION BACKGROUND
// ===================================

class WaveBackground {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.waves = [];
        this.init();
    }

    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '0.1';
        this.canvas.style.zIndex = '0';

        this.container.style.position = 'relative';
        this.container.insertBefore(this.canvas, this.container.firstChild);

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        // Create waves
        this.waves = [
            { y: this.canvas.height * 0.3, length: 0.01, amplitude: 50, frequency: 0.01 },
            { y: this.canvas.height * 0.5, length: 0.015, amplitude: 40, frequency: 0.015 },
            { y: this.canvas.height * 0.7, length: 0.02, amplitude: 30, frequency: 0.02 }
        ];

        // Start animation
        this.animate();

        // Handle resize
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const primaryColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary').trim();

        this.waves.forEach((wave, index) => {
            this.ctx.beginPath();
            this.ctx.moveTo(0, wave.y);

            for (let x = 0; x < this.canvas.width; x++) {
                const y = wave.y + Math.sin(x * wave.length + wave.frequency * Date.now()) * wave.amplitude;
                this.ctx.lineTo(x, y);
            }

            this.ctx.strokeStyle = primaryColor || '#6366f1';
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = 0.3 - (index * 0.1);
            this.ctx.stroke();
        });

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// SCROLL REVEAL ANIMATION
// ===================================

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.glass-card, .practice-card, .service-card-alt, .testimonial-card');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px) scale(0.95)';
            element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(element);
        });
    }
}

// ===================================
// INITIALIZE ALL EFFECTS
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize parallax effects
    new ParallaxEffect();
    new MouseParallax();
    new FloatingCards();
    new ScrollReveal();

    // Add particle background to hero sections (optional)
    const heroSections = document.querySelectorAll('.hero-section, .hero-section-alt');
    heroSections.forEach(section => {
        // Uncomment to enable particle background
        // new ParticleBackground(section);

        // Or use wave background instead
        // new WaveBackground(section);
    });

    console.log('✨ Parallax effects initialized!');
});

// ===================================
// PERFORMANCE MONITORING
// ===================================

// Reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--transition-normal', '0.15s');
    document.documentElement.style.setProperty('--transition-slow', '0.25s');
}

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});
