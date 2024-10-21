document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formGroups = document.querySelectorAll('.form-group');
    const formStatus = document.createElement('div');
    formStatus.className = 'form-status';
    contactForm.appendChild(formStatus);

    // Handle floating labels
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');

        // Check initial value
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

    // Form validation and submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Basic validation
        let isValid = true;
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                const group = input.closest('.form-group');
                group.classList.add('shake');
                setTimeout(() => group.classList.remove('shake'), 500);
            }
        });

        if (!isValid) {
            showStatus('Please fill in all fields', 'error');
            return;
        }

        // Email validation
        const emailInput = contactForm.querySelector('input[type="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            const group = emailInput.closest('.form-group');
            group.classList.add('shake');
            setTimeout(() => group.classList.remove('shake'), 500);
            showStatus('Please enter a valid email address', 'error');
            return;
        }

        // Gather form data
        const formData = {
            name: contactForm.querySelector('input[name="name"]').value,
            email: emailInput.value,
            message: contactForm.querySelector('textarea[name="message"]').value
        };

        // Simulate form submission
        try {
            // Here you would typically make an API call to your backend
            await simulateSubmission(formData);
            showStatus('Message sent successfully!', 'success');
            contactForm.reset();
            formGroups.forEach(group => group.classList.remove('has-value'));
        } catch (error) {
            showStatus('Failed to send message. Please try again.', 'error');
        }
    });

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        setTimeout(() => {
            formStatus.className = 'form-status';
        }, 5000);
    }

    function simulateSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve();
            }, 1000);
        });
    }

    // Add subtle parallax effect to form on mouse move
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

    // Reset form transform on mouse leave
    document.addEventListener('mouseleave', () => {
        form.style.transform = 'none';
    });
});