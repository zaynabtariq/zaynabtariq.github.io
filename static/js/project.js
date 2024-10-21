document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const projectCards = document.querySelectorAll('.project-card');
    
    // Fade in projects on scroll
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-view');
                // Add staggered delay for each card
                const delay = Array.from(projectCards).indexOf(entry.target) * 100;
                entry.target.style.transitionDelay = `${delay}ms`;
                projectObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    projectCards.forEach(card => {
        projectObserver.observe(card);
    });

    // Enhanced hover effects
    projectCards.forEach(card => {
        const inner = card.querySelector('.project-inner');
        const image = card.querySelector('.img-wrapper');

        // Mouse move parallax effect
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) {  // Only on desktop
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / card.offsetWidth - 0.5;
                const y = (e.clientY - rect.top) / card.offsetHeight - 0.5;
                
                if (inner) {
                    inner.style.transform = `
                        translateX(${x * 20}px) 
                        translateY(${y * 20}px)
                        rotate3d(${-y}, ${x}, 0, ${Math.sqrt(x * x + y * y) * 5}deg)
                    `;
                }
                
                if (image) {
                    image.style.transform = `
                        translateX(${-x * 15}px) 
                        translateY(${-y * 15}px)
                    `;
                }
            }
        });

        // Reset transforms on mouse leave
        card.addEventListener('mouseleave', () => {
            if (inner) {
                inner.style.transform = 'none';
            }
            if (image) {
                image.style.transform = 'none';
            }
        });
    });

    // Smooth transitions
    document.querySelectorAll('.project-inner, .img-wrapper').forEach(element => {
        element.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
    });

    // Handle project links
    document.querySelectorAll('.project-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                // You might want to replace this with a more sophisticated notification
                alert('Project link coming soon!');
            }
        });
    });
});