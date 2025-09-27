// Enhanced Animations for SportsForAll Auth Page
// Same animation style and theme as landing page

// Particle System Class for Auth Page
class AuthParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        const particleCount = 35;
        const colors = ['#FF5722', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0', '#FF8A65'];

        for (let i = 0; i < particleCount; i++) {
            const particle = {
                element: document.createElement('div'),
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                size: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random() * 0.4 + 0.2,
                life: 1,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2
            };

            particle.element.style.position = 'fixed';
            particle.element.style.width = particle.size + 'px';
            particle.element.style.height = particle.size + 'px';
            particle.element.style.background = particle.color;
            particle.element.style.borderRadius = '50%';
            particle.element.style.opacity = particle.opacity;
            particle.element.style.pointerEvents = 'none';
            particle.element.style.zIndex = '1';
            particle.element.style.filter = 'blur(0.5px)';
            particle.element.style.boxShadow = `0 0 ${particle.size * 2}px ${particle.color}`;

            this.container.appendChild(particle.element);
            this.particles.push(particle);
        }
    }

    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;

        // Bounce off edges
        if (particle.x < 0 || particle.x > window.innerWidth) {
            particle.vx *= -0.8;
            particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
        }
        if (particle.y < 0 || particle.y > window.innerHeight) {
            particle.vy *= -0.8;
            particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));
        }

        // Update position and rotation
        particle.element.style.left = particle.x + 'px';
        particle.element.style.top = particle.y + 'px';
        particle.element.style.transform = `rotate(${particle.rotation}deg)`;

        // Pulsing effect
        const scale = Math.sin(Date.now() * 0.002 + particle.x * 0.01) * 0.3 + 1;
        const currentTransform = `rotate(${particle.rotation}deg) scale(${scale})`;
        particle.element.style.transform = currentTransform;

        // Color shifting
        const hue = (Date.now() * 0.05 + particle.x * 0.1) % 360;
        if (Math.random() < 0.01) {
            particle.element.style.filter = `blur(0.5px) hue-rotate(${hue}deg)`;
        }
    }

    animate() {
        this.particles.forEach(particle => this.updateParticle(particle));
        requestAnimationFrame(() => this.animate());
    }
}

// Enhanced Sports Equipment Animation for Auth Page
class AuthSportsEquipment {
    constructor() {
        this.equipment = [
            { icon: '⚽', name: 'football', physics: { bounce: 0.8, gravity: 0.02 } },
            { icon: '🏀', name: 'basketball', physics: { bounce: 0.9, gravity: 0.025 } },
            { icon: '🏐', name: 'volleyball', physics: { bounce: 0.85, gravity: 0.02 } },
            { icon: '🎾', name: 'tennis', physics: { bounce: 0.75, gravity: 0.03 } },
            { icon: '🏓', name: 'ping-pong', physics: { bounce: 0.95, gravity: 0.015 } },
            { icon: '🏸', name: 'badminton', physics: { bounce: 0.6, gravity: 0.01 } },
            { icon: '🏒', name: 'hockey', physics: { bounce: 0.7, gravity: 0.035 } },
            { icon: '🥍', name: 'lacrosse', physics: { bounce: 0.8, gravity: 0.025 } },
            { icon: '🏈', name: 'american-football', physics: { bounce: 0.65, gravity: 0.03 } },
            { icon: '🏊‍♂️', name: 'swimming', physics: { bounce: 0.9, gravity: 0.01 } },
            { icon: '🚴‍♂️', name: 'cycling', physics: { bounce: 0.8, gravity: 0.02 } },
            { icon: '🏃‍♂️', name: 'running', physics: { bounce: 0.85, gravity: 0.025 } }
        ];
        this.equipmentElements = [];
        this.init();
    }

    init() {
        this.equipment.forEach((item, index) => {
            const element = document.createElement('div');
            element.className = 'auth-floating-equipment';
            element.innerHTML = item.icon;
            element.style.position = 'fixed';
            element.style.fontSize = Math.random() * 15 + 25 + 'px';
            element.style.left = Math.random() * (window.innerWidth - 50) + 'px';
            element.style.top = Math.random() * (window.innerHeight - 50) + 'px';
            element.style.opacity = Math.random() * 0.2 + 0.1;
            element.style.pointerEvents = 'none';
            element.style.zIndex = '1';
            element.style.userSelect = 'none';
            element.style.textShadow = `0 0 10px rgba(255, 87, 34, 0.5)`;
            element.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';
            element.style.transition = 'all 0.3s ease';

            // Physics properties
            element.vx = (Math.random() - 0.5) * 2;
            element.vy = (Math.random() - 0.5) * 2;
            element.physics = item.physics;
            element.rotation = 0;
            element.rotationSpeed = (Math.random() - 0.5) * 3;

            document.body.appendChild(element);
            this.equipmentElements.push(element);

            // Staggered animation start
            setTimeout(() => {
                this.animateEquipment(element);
            }, index * 500);
        });
    }

    animateEquipment(element) {
        const animate = () => {
            // Apply physics
            element.vy += element.physics.gravity;

            // Update position
            const rect = element.getBoundingClientRect();
            let newX = rect.left + element.vx;
            let newY = rect.top + element.vy;

            // Boundary collision
            if (newX <= 0 || newX >= window.innerWidth - 50) {
                element.vx *= -element.physics.bounce;
                newX = Math.max(0, Math.min(window.innerWidth - 50, newX));
            }

            if (newY <= 0 || newY >= window.innerHeight - 50) {
                element.vy *= -element.physics.bounce;
                newY = Math.max(0, Math.min(window.innerHeight - 50, newY));
            }

            // Apply rotation
            element.rotation += element.rotationSpeed;

            // Update styles
            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
            element.style.transform = `rotate(${element.rotation}deg) scale(${1 + Math.sin(Date.now() * 0.003) * 0.1})`;

            // Continue animation
            requestAnimationFrame(animate);
        };

        animate();
    }
}

// Interactive Background System for Auth Page
class AuthInteractiveBackground {
    constructor() {
        this.mouse = { x: 0, y: 0 };
        this.backgroundElements = [];
        this.init();
    }

    init() {
        this.createBackgroundElements();
        this.bindEvents();
    }

    createBackgroundElements() {
        // Create morphing background shapes
        for (let i = 0; i < 5; i++) {
            const shape = document.createElement('div');
            shape.className = 'auth-bg-morph';
            shape.style.position = 'fixed';
            shape.style.width = Math.random() * 200 + 100 + 'px';
            shape.style.height = Math.random() * 200 + 100 + 'px';
            shape.style.background = `linear-gradient(${Math.random() * 360}deg, 
                rgba(255, 87, 34, 0.03), 
                rgba(255, 193, 7, 0.03), 
                rgba(76, 175, 80, 0.03))`;
            shape.style.borderRadius = '50%';
            shape.style.left = Math.random() * window.innerWidth + 'px';
            shape.style.top = Math.random() * window.innerHeight + 'px';
            shape.style.pointerEvents = 'none';
            shape.style.zIndex = '-1';
            shape.style.filter = 'blur(1px)';
            shape.style.animation = `authMorph ${Math.random() * 10 + 10}s ease-in-out infinite`;
            shape.style.animationDelay = Math.random() * 5 + 's';

            document.body.appendChild(shape);
            this.backgroundElements.push(shape);
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.updateBackground();
        });
    }

    updateBackground() {
        const bgOverlay = document.querySelector('.bg-overlay');
        if (bgOverlay) {
            const x = (this.mouse.x / window.innerWidth) * 100;
            const y = (this.mouse.y / window.innerHeight) * 100;

            bgOverlay.style.background = `linear-gradient(${x * 3}deg, 
                rgba(255, 87, 34, ${0.1 + (y/1000)}) 0%,
                rgba(255, 193, 7, ${0.1 + (x/1000)}) 25%,
                rgba(76, 175, 80, ${0.1 + (y/1500)}) 50%,
                rgba(33, 150, 243, ${0.1 + (x/1500)}) 75%)`;
        }

        // Update floating icons based on mouse position
        const icons = document.querySelectorAll('.floating-icon, .auth-floating-equipment');
        icons.forEach((icon, index) => {
            const rect = icon.getBoundingClientRect();
            const iconCenterX = rect.left + rect.width / 2;
            const iconCenterY = rect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(this.mouse.x - iconCenterX, 2) + 
                Math.pow(this.mouse.y - iconCenterY, 2)
            );

            const maxDistance = 150;
            const influence = Math.max(0, (maxDistance - distance) / maxDistance);

            const pushX = (iconCenterX - this.mouse.x) * influence * 0.05;
            const pushY = (iconCenterY - this.mouse.y) * influence * 0.05;

            const currentTransform = icon.style.transform || '';
            const newTransform = `${currentTransform} translate(${pushX}px, ${pushY}px) scale(${1 + influence * 0.15})`;
            icon.style.transform = newTransform;
        });

        // Update morphing shapes
        this.backgroundElements.forEach((shape, index) => {
            const rect = shape.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(this.mouse.x - centerX, 2) + 
                Math.pow(this.mouse.y - centerY, 2)
            );

            const influence = Math.max(0, (300 - distance) / 300);
            const scale = 1 + influence * 0.2;
            const rotation = influence * 45;

            shape.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
            shape.style.opacity = 0.03 + influence * 0.02;
        });
    }
}

// Form Enhancement Animations
class AuthFormAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceFormInputs();
        this.addFormTransitions();
        this.createSuccessAnimations();
    }

    enhanceFormInputs() {
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            // Focus animations
            input.addEventListener('focus', () => {
                input.style.transform = 'translateY(-2px)';
                input.style.boxShadow = '0 8px 25px rgba(255, 87, 34, 0.15)';

                // Create ripple effect
                this.createRipple(input);
            });

            input.addEventListener('blur', () => {
                input.style.transform = 'translateY(0)';
                if (!input.value) {
                    input.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }
            });

            // Typing animations
            input.addEventListener('input', () => {
                if (input.value) {
                    input.style.borderColor = '#4CAF50';
                    input.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.2)';
                }
            });
        });
    }

    createRipple(element) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.background = 'rgba(255, 87, 34, 0.3)';
        ripple.style.borderRadius = '50%';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.animation = 'authRipple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    addFormTransitions() {
        const authContainer = document.querySelector('.auth-container');
        if (authContainer) {
            // Add entrance animation enhancement
            authContainer.style.animation = 'authSlideUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }

        // Toggle animations
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    createSuccessAnimations() {
        // Enhanced confetti system
        window.createAuthSuccessCelebration = () => {
            const celebration = document.getElementById('successCelebration') || document.body;
            const colors = ['#FF5722', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0', '#FF8A65'];
            const shapes = ['circle', 'square', 'triangle'];

            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'auth-confetti';
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                confetti.style.width = Math.random() * 8 + 5 + 'px';
                confetti.style.height = confetti.style.width;
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';

                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                if (shape === 'circle') {
                    confetti.style.borderRadius = '50%';
                } else if (shape === 'triangle') {
                    confetti.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                }

                confetti.style.animation = `authConfetti ${Math.random() * 2 + 3}s ease-out forwards`;
                confetti.style.animationDelay = Math.random() * 2 + 's';

                celebration.appendChild(confetti);

                // Clean up
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 5000);
            }
        };
    }
}

// Scroll Animations for Auth Page
class AuthScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.createObserver();
        this.addParallaxEffects();
    }

    createObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe auth container and its children
        const authContainer = document.querySelector('.auth-container');
        if (authContainer) {
            observer.observe(authContainer);
        }

        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => observer.observe(group));
    }

    animateElement(element) {
        element.style.animation = 'authFadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
    }

    addParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.auth-floating-equipment, .floating-icon');

            parallaxElements.forEach((el, index) => {
                const speed = 0.5 + (index % 3) * 0.2;
                const yPos = -(scrolled * speed);
                el.style.transform += ` translateY(${yPos}px)`;
            });
        });
    }
}

// Sports-themed Loading Animations
class AuthLoadingAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.createLoadingSpinner();
        this.addButtonAnimations();
    }

    createLoadingSpinner() {
        window.createSportsLoadingSpinner = (container) => {
            const spinner = document.createElement('div');
            spinner.className = 'auth-sports-spinner';
            spinner.innerHTML = '⚽🏀🏐';
            spinner.style.position = 'absolute';
            spinner.style.top = '50%';
            spinner.style.left = '50%';
            spinner.style.transform = 'translate(-50%, -50%)';
            spinner.style.fontSize = '2rem';
            spinner.style.animation = 'authSportsSpinner 1.5s ease-in-out infinite';
            spinner.style.zIndex = '1000';

            container.appendChild(spinner);
            return spinner;
        };
    }

    addButtonAnimations() {
        const buttons = document.querySelectorAll('.submit-btn, .social-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.animation = 'authButtonHover 0.3s ease-out forwards';
            });

            button.addEventListener('mouseleave', () => {
                button.style.animation = 'authButtonLeave 0.3s ease-out forwards';
            });

            button.addEventListener('click', () => {
                button.style.animation = 'authButtonClick 0.2s ease-out';
            });
        });
    }
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create particle system
    const particleContainer = document.body;
    new AuthParticleSystem(particleContainer);

    // Initialize all animation systems
    new AuthSportsEquipment();
    new AuthInteractiveBackground();
    new AuthFormAnimations();
    new AuthScrollAnimations();
    new AuthLoadingAnimations();

    // Add custom CSS animations
    addAuthAnimationStyles();

    // Start floating icon animations
    animateAuthFloatingIcons();

    console.log('🏆 SportsForAll Auth Animations Loaded Successfully!');
});

// Add animation styles dynamically
function addAuthAnimationStyles() {
    const styles = `
        @keyframes authMorph {
            0%, 100% { 
                border-radius: 50% 50% 50% 50%;
                transform: rotate(0deg) scale(1);
            }
            25% { 
                border-radius: 60% 40% 30% 70%;
                transform: rotate(90deg) scale(1.1);
            }
            50% { 
                border-radius: 30% 60% 70% 40%;
                transform: rotate(180deg) scale(0.9);
            }
            75% { 
                border-radius: 70% 30% 40% 60%;
                transform: rotate(270deg) scale(1.2);
            }
        }

        @keyframes authRipple {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }

        @keyframes authSlideUp {
            0% { 
                transform: translateY(50px) scale(0.95); 
                opacity: 0; 
            }
            100% { 
                transform: translateY(0) scale(1); 
                opacity: 1; 
            }
        }

        @keyframes authFadeInUp {
            0% { 
                transform: translateY(30px); 
                opacity: 0; 
            }
            100% { 
                transform: translateY(0); 
                opacity: 1; 
            }
        }

        @keyframes authConfetti {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }

        @keyframes authSportsSpinner {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            33% { transform: translate(-50%, -50%) rotate(120deg) scale(1.1); }
            66% { transform: translate(-50%, -50%) rotate(240deg) scale(0.9); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes authButtonHover {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(-3px) scale(1.02); }
        }

        @keyframes authButtonLeave {
            0% { transform: translateY(-3px) scale(1.02); }
            100% { transform: translateY(0) scale(1); }
        }

        @keyframes authButtonClick {
            0% { transform: scale(1); }
            50% { transform: scale(0.95); }
            100% { transform: scale(1); }
        }

        .auth-floating-equipment {
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .auth-floating-equipment:hover {
            transform: scale(1.2) rotate(15deg) !important;
            opacity: 0.4 !important;
        }

        .auth-bg-morph {
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .form-input {
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .auth-confetti {
            box-shadow: 0 0 10px rgba(255, 87, 34, 0.5);
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Enhanced floating icon animations
function animateAuthFloatingIcons() {
    const icons = document.querySelectorAll('.floating-icon');
    icons.forEach((icon, index) => {
        icon.style.opacity = '0';
        icon.style.transform = 'translateY(100px) scale(0.5)';

        setTimeout(() => {
            icon.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            icon.style.opacity = '0.15';
            icon.style.transform = 'translateY(0) scale(1)';

            // Add continuous floating animation
            setTimeout(() => {
                icon.style.animation = `float ${8 + index}s ease-in-out infinite`;
                icon.style.animationDelay = index * 0.5 + 's';
            }, 1500);
        }, index * 300);
    });
}

// Window resize handler
window.addEventListener('resize', () => {
    // Reinitialize particle positions
    const particles = document.querySelectorAll('.auth-floating-equipment');
    particles.forEach(particle => {
        if (parseFloat(particle.style.left) > window.innerWidth) {
            particle.style.left = Math.random() * (window.innerWidth - 50) + 'px';
        }
        if (parseFloat(particle.style.top) > window.innerHeight) {
            particle.style.top = Math.random() * (window.innerHeight - 50) + 'px';
        }
    });
});

// Performance optimization
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Add performance optimizations when browser is idle
        const animationElements = document.querySelectorAll('.auth-floating-equipment, .floating-icon');
        animationElements.forEach(el => {
            el.style.willChange = 'transform, opacity';
        });
    });
}

// Export functions for external use
window.AuthAnimations = {
    ParticleSystem: AuthParticleSystem,
    SportsEquipment: AuthSportsEquipment,
    InteractiveBackground: AuthInteractiveBackground,
    FormAnimations: AuthFormAnimations,
    ScrollAnimations: AuthScrollAnimations,
    LoadingAnimations: AuthLoadingAnimations
};