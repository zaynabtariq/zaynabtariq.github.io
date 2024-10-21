document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Gather form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            console.log('Form submitted:', { name, email, message });
            
            // Reset form fields
            this.reset();
            
            alert('Thank you for your message! I\'ll get back to you soon.');
        });
    }
});