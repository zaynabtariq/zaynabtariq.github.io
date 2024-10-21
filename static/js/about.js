document.addEventListener('DOMContentLoaded', () => {
    // Animate skills list items with staggered delay
    const skillItems = document.querySelectorAll('.skills-list li');
    skillItems.forEach((item, index) => {
        item.style.animation = `fadeInUp 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) ${0.2 + index * 0.1}s forwards`;
    });

    // Animate coursework list items
    const courseItems = document.querySelectorAll('.coursework-list li');
    courseItems.forEach((item, index) => {
        item.style.animation = `fadeInUp 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) ${0.4 + index * 0.1}s forwards`;
    });

    // Image hover effect
    const imageWrapper = document.querySelector('.image-wrapper');
    if (imageWrapper) {
        imageWrapper.addEventListener('mousemove', (e) => {
            const rect = imageWrapper.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            const border = imageWrapper.querySelector('::after');
            if (border) {
                border.style.transform = `
                    translate(${10 + x * 5}px, ${10 + y * 5}px)
                `;
            }
        });

        imageWrapper.addEventListener('mouseleave', () => {
            const border = imageWrapper.querySelector('::after');
            if (border) {
                border.style.transform = 'translate(10px, 10px)';
            }
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observeElement = (element, delay = 0) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = `fadeInUp 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) ${delay}s forwards`;
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(element);
    };

    // Observe main sections
    const sections = document.querySelectorAll('.education, .coursework, .about-text');
    sections.forEach((section, index) => {
        observeElement(section, 0.2 * index);
    });

    // Smooth hover effect for education items
    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });
});