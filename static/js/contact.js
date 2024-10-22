document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formGroups = document.querySelectorAll('.form-group');
    const formStatus = document.createElement('div');
    formStatus.className = 'form-status';
    contactForm.appendChild(formStatus);

    // Update form attributes for FormSubmit
    contactForm.action = "https://formsubmit.co/ztariq26@colby.edu";
    contactForm.method = "POST";

    // Add FormSubmit configuration inputs
    const additionalInputs = `
        <input type="hidden" name="_captcha" value="false">
        <input type="hidden" name="_next" value="${window.location.href}">
        <input type="hidden" name="_subject" value="New Portfolio Contact!">
    `;
    contactForm.insertAdjacentHTML('afterbegin', additionalInputs);

    // Keep existing floating labels logic
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');

        if (input.value.trim() !== '') {
            group.classList.add('has-value');
        }

        input.addEventListener('focus', () => {
            group.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            group.classList.remove('focused');
            if (input.value.trim() !== '') {
                group.classList.add('has-value');
            } else {
                group.classList.remove('has-value');
            }
        });

        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                group.classList.add('has-value');
            } else {
                group.classList.remove('has-value');
            }
        });
    });

    // Form validation (client-side, before FormSubmit handles it)
    contactForm.addEventListener('submit', function(e) {
        let isValid = true;
        const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                const group = input.closest('.form-group');
                group.classList.add('shake');
                setTimeout(() => group.classList.remove('shake'), 500);
            }
        });

        // Email validation
        const emailInput = contactForm.querySelector('input[type="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            isValid = false;
            const group = emailInput.closest('.form-group');
            group.classList.add('shake');
            setTimeout(() => group.classList.remove('shake'), 500);
            showStatus('Please enter a valid email address', 'error');
        }

        if (!isValid) {
            e.preventDefault();
            showStatus('Please fill in all fields correctly', 'error');
        } else {
            showStatus('Sending...', 'info');
        }
    });

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        if (type !== 'info') {
            setTimeout(() => {
                formStatus.className = 'form-status';
            }, 5000);
        }
    }

    // Keep the beautiful parallax effect
    const form = document.querySelector('#contact-form');
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            const rect = form.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            form.style.transform = `
                perspective(1000px)
                rotateX(${y * 2}deg)
                rotateY(${x * 2}deg)
                translateZ(0)
            `;
        }
    });

    document.addEventListener('mouseleave', () => {
        form.style.transform = 'none';
    });
});

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        const hue = 160 + Math.random() * 10;
        const saturation = 70 + Math.random() * 10; 
        const lightness = 40 + Math.random() * 10; 
        this.color = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`; 
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.velocityX = (Math.random() - 0.5) * 0.5;
        this.velocityY = (Math.random() - 0.5) * 0.5;
        this.baseRadius = 1.5; 
        this.radius = this.baseRadius;
    }

    update(mouse) {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Wrap around screen instead of bouncing for smoother animation
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;

        // Subtle mouse interaction
        if (mouse.x) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                this.radius = this.baseRadius * (1 + (120 - distance) / 80);
            } else {
                this.radius = this.baseRadius;
            }
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class BackgroundParticleNetwork {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.className = 'background-particle-network';

       
        Object.assign(this.canvas.style, {
            position: 'fixed', 
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '-1', // Behind content
            pointerEvents: 'none',
            opacity: '0.6' 
        });

        document.body.prepend(this.canvas); 

        this.particles = [];
        this.mouse = { x: null, y: null };
        this.particleCount = Math.min(window.innerWidth * 0.05, 100); // Responsive particle count
        this.maxDistance = 120; 
        this.animationFrameId = null;
        this.isVisible = true;

        this.init();
        this.setupEventListeners();
        this.startAnimation();
    }

    init() {
        this.resize();
        this.particles = Array.from({ length: this.particleCount }, 
            () => new Particle(this.canvas));
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.scale(dpr, dpr);
    }

    setupEventListeners() {
        window.addEventListener('resize', this.debounce(() => {
            this.resize();
            this.particles.forEach(particle => particle.reset());
        }, 250));

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Performance optimization: Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            if (this.isVisible) {
                this.startAnimation();
            } else {
                this.stopAnimation();
            }
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    drawConnections() {
        this.ctx.beginPath();
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.maxDistance) {
                    const opacity = (1 - (distance / this.maxDistance)) * 0.3; // Reduced opacity
                    this.ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`;
                    this.ctx.lineWidth = 0.5; // Thinner lines
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                }
            }
        }
        this.ctx.stroke();
    }

    animate() {
        if (!this.isVisible) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        this.drawConnections();
        
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    startAnimation() {
        if (!this.animationFrameId) {
            this.animate();
        }
    }

    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}

// Initialize with performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    const particleNetwork = new BackgroundParticleNetwork();
});
