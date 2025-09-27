// Additional animations and interactive features for SportsForAll landing page

// Advanced particle system
class ParticleSystem {
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
        const particleCount = 30;
        const colors = ['#FF5722', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0'];

        for (let i = 0; i < particleCount; i++) {
            const particle = {
                element: document.createElement('div'),
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 5 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random() * 0.5 + 0.2,
                life: 1
            };
            

            particle.element.style.position = 'absolute';
            particle.element.style.width = particle.size + 'px';
            particle.element.style.height = particle.size + 'px';
            particle.element.style.background = particle.color;
            particle.element.style.borderRadius = '50%';
            particle.element.style.opacity = particle.opacity;
            particle.element.style.pointerEvents = 'none';
            particle.element.style.zIndex = '1';
            particle.element.style.filter = 'blur(1px)';

            this.container.appendChild(particle.element);
            this.particles.push(particle);
            
        }
    }

    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > window.innerWidth) {
            particle.vx *= -1;
        }
        if (particle.y < 0 || particle.y > window.innerHeight) {
            particle.vy *= -1;
        }

        // Update position
        particle.element.style.left = particle.x + 'px';
        particle.element.style.top = particle.y + 'px';

        // Pulse effect
        const scale = Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.3 + 1;
        particle.element.style.transform = `scale(${scale})`;
    }

    animate() {
        this.particles.forEach(particle => this.updateParticle(particle));
        requestAnimationFrame(() => this.animate());
    }
}

// Sports equipment floating animation
class SportsEquipment {
    constructor() {
        this.equipment = [
            { icon: '⚽', name: 'football' },
            { icon: '🏀', name: 'basketball' },
            { icon: '🏐', name: 'volleyball' },
            { icon: '🎾', name: 'tennis' },
            { icon: '🏓', name: 'ping-pong' },
            { icon: '🏸', name: 'badminton' },
            { icon: '🏒', name: 'hockey' },
            { icon: '🏑', name: 'field-hockey' },
            { icon: '🥍', name: 'lacrosse' },
            { icon: '🏈', name: 'american-football' }
        ];
        this.init();
    }

    init() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        this.equipment.forEach((item, index) => {
            const element = document.createElement('div');
            element.className = 'floating-equipment';
            element.innerHTML = item.icon;
            element.style.position = 'absolute';
            element.style.fontSize = Math.random() * 20 + 30 + 'px';
            element.style.left = Math.random() * 90 + '%';
            element.style.top = Math.random() * 80 + 10 + '%';
            element.style.opacity = Math.random() * 0.3 + 0.1;
            element.style.pointerEvents = 'none';
            element.style.zIndex = '1';
            element.style.animation = `equipmentFloat ${Math.random() * 10 + 15}s ease-in-out infinite`;
            element.style.animationDelay = index * 0.5 + 's';

            hero.appendChild(element);
        });
    }
}

// Interactive background effects
class InteractiveBackground {
    constructor() {
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.updateBackground();
        });
    }

    updateBackground() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const x = (this.mouse.x / window.innerWidth) * 100;
        const y = (this.mouse.y / window.innerHeight) * 100;

        hero.style.backgroundPosition = `${50 + x * 0.1}% ${50 + y * 0.1}%`;

        // Update floating icons based on mouse position
        const icons = document.querySelectorAll('.floating-icon, .floating-equipment');
        icons.forEach((icon, index) => {
            const rect = icon.getBoundingClientRect();
            const iconCenterX = rect.left + rect.width / 2;
            const iconCenterY = rect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(this.mouse.x - iconCenterX, 2) + 
                Math.pow(this.mouse.y - iconCenterY, 2)
            );

            const maxDistance = 200;
            const influence = Math.max(0, (maxDistance - distance) / maxDistance);

            const pushX = (iconCenterX - this.mouse.x) * influence * 0.1;
            const pushY = (iconCenterY - this.mouse.y) * influence * 0.1;

            icon.style.transform = `translate(${pushX}px, ${pushY}px) scale(${1 + influence * 0.2})`;
        });
    }
}

// Scroll-based animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.createScrollTrigger();
        this.createParallaxEffect();
    }

    createScrollTrigger() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .step-card, .stat-item').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        element.style.animation = 'none';
        element.style.transform = 'translateY(50px)';
        element.style.opacity = '0';

        setTimeout(() => {
            element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        }, 100);
    }

    createParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');

            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
}

// Success stories carousel
class SuccessStories {
    constructor() {
        this.stories = [
            {
                name: "Maria Rodriguez",
                sport: "Track & Field",
                achievement: "Olympic Bronze Medalist",
                quote: "SportsForAll gave me the coaching I needed when my family couldn't afford it.",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face"
            },
            {
                name: "James Thompson",
                sport: "Swimming",
                achievement: "National Champion",
                quote: "From local pools to national stages, this platform changed my life forever.",
                image: "https://images.unsplash.com/photo-1594736797933-d0d8e7e5b6d8?w=150&h=150&fit=crop&crop=face"
            },
            {
                name: "Aisha Patel",
                sport: "Basketball",
                achievement: "College Scholarship",
                quote: "I'm now playing Division I basketball thanks to the mentorship I received.",
                image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=150&h=150&fit=crop&crop=face"
            }
        ];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.createCarousel();
        this.startAutoPlay();
    }

    createCarousel() {
        const container = document.createElement('div');
        container.className = 'success-stories';
        container.innerHTML = `
            <div class="stories-container">
                <h3>Success Stories</h3>
                <div class="story-card" id="currentStory">
                    ${this.createStoryHTML(this.stories[0])}
                </div>
                <div class="story-controls">
                    <button onclick="successStories.prevStory()">‹</button>
                    <div class="story-indicators"></div>
                    <button onclick="successStories.nextStory()">›</button>
                </div>
            </div>
        `;

        // Add to features section
        const featuresSection = document.querySelector('.features-section .container');
        if (featuresSection) {
            featuresSection.appendChild(container);
        }

        this.createIndicators();
    }

    createStoryHTML(story) {
        return `
            <div class="story-content">
                <div class="story-image">
                    <img src="${story.image}" alt="${story.name}" />
                </div>
                <div class="story-text">
                    <h4>${story.name}</h4>
                    <p class="sport">${story.sport} • ${story.achievement}</p>
                    <blockquote>"${story.quote}"</blockquote>
                </div>
            </div>
        `;
    }

    createIndicators() {
        const indicatorsContainer = document.querySelector('.story-indicators');
        if (!indicatorsContainer) return;

        this.stories.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.onclick = () => this.goToStory(index);
            indicatorsContainer.appendChild(indicator);
        });
    }

    nextStory() {
        this.currentIndex = (this.currentIndex + 1) % this.stories.length;
        this.updateStory();
    }

    prevStory() {
        this.currentIndex = (this.currentIndex - 1 + this.stories.length) % this.stories.length;
        this.updateStory();
    }

    goToStory(index) {
        this.currentIndex = index;
        this.updateStory();
    }

    updateStory() {
        const storyCard = document.getElementById('currentStory');
        const indicators = document.querySelectorAll('.indicator');

        if (storyCard) {
            storyCard.innerHTML = this.createStoryHTML(this.stories[this.currentIndex]);
        }

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoPlay() {
        setInterval(() => {
            this.nextStory();
        }, 5000);
    }
}

// Sport-specific animation effects
class SportAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.createBallBounce();
        this.createRunnerAnimation();
        this.createSwimmerAnimation();
    }

    createBallBounce() {
        const balls = document.querySelectorAll('.floating-icon');
        balls.forEach((ball, index) => {
            if (ball.innerHTML.includes('ball')) {
                ball.addEventListener('mouseenter', () => {
                    ball.style.animation = 'bounce 0.6s ease-in-out';
                });

                ball.addEventListener('animationend', () => {
                    ball.style.animation = `float ${6 + index}s ease-in-out infinite`;
                });
            }
        });
    }

    createRunnerAnimation() {
        const runners = document.querySelectorAll('.floating-icon i.fa-running');
        runners.forEach(runner => {
            runner.style.animation = 'running 2s linear infinite';
        });
    }

    createSwimmerAnimation() {
        const swimmers = document.querySelectorAll('.floating-icon i.fa-swimmer');
        swimmers.forEach(swimmer => {
            swimmer.style.animation = 'swimming 3s ease-in-out infinite';
        });
    }
}

// Initialize all systems when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create particle system in hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        new ParticleSystem(hero);
    }

    // Initialize all interactive features
    new SportsEquipment();
    new InteractiveBackground();
    new ScrollAnimations();
    new SuccessStories();
    new SportAnimations();

    // Store instances globally for access
    window.successStories = new SuccessStories();
});

// Additional CSS animations via JavaScript
const additionalStyles = `
    @keyframes equipmentFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-30px) rotate(90deg); }
        50% { transform: translateY(-10px) rotate(180deg); }
        75% { transform: translateY(-20px) rotate(270deg); }
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-30px); }
    }

    @keyframes running {
        0%, 100% { transform: translateX(0) scaleX(1); }
        50% { transform: translateX(20px) scaleX(-1); }
    }

    @keyframes swimming {
        0%, 100% { transform: translateX(0) rotateY(0deg); }
        25% { transform: translateX(15px) rotateY(0deg); }
        50% { transform: translateX(30px) rotateY(180deg); }
        75% { transform: translateX(15px) rotateY(180deg); }
    }

    .success-stories {
        margin: 4rem 0;
        padding: 3rem;
        background: linear-gradient(135deg, rgba(255, 87, 34, 0.1), rgba(255, 193, 7, 0.1));
        border-radius: 20px;
        text-align: center;
    }

    .stories-container h3 {
        font-size: 2.5rem;
        color: #FF5722;
        margin-bottom: 2rem;
        font-weight: 800;
    }

    .story-card {
        background: white;
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
        transition: all 0.3s ease;
    }

    .story-content {
        display: flex;
        align-items: center;
        gap: 2rem;
        text-align: left;
    }

    .story-image img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #FF5722;
    }

    .story-text h4 {
        color: #333;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }

    .story-text .sport {
        color: #FF5722;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    .story-text blockquote {
        font-style: italic;
        color: #666;
        font-size: 1.1rem;
        line-height: 1.6;
    }

    .story-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
    }

    .story-controls button {
        background: #FF5722;
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .story-controls button:hover {
        background: #FF7043;
        transform: scale(1.1);
    }

    .story-indicators {
        display: flex;
        gap: 0.5rem;
    }

    .indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #ddd;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .indicator.active {
        background: #FF5722;
        transform: scale(1.2);
    }

    @media (max-width: 768px) {
        .story-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
        }

        .story-text {
            text-align: center;
        }
    }
       
}

`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);