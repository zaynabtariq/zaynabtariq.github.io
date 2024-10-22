// Typing animation
const typingElement = document.getElementById('typing-animation');
const phrases = [
    'a Software Engineer.',
    'an AI Researcher.',
    'passionate about AI-driven Solutions.',
    'an Innovator.',
    'a Developer.',
    'bridging AI and Financial Markets.'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1500); // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeEffect, 500); // Pause before starting new phrase
    } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100); // Typing speed
    }
}

// Start the typing animation when the page loads
document.addEventListener('DOMContentLoaded', typeEffect);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Change header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(10, 25, 47, 0.85)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = 'transparent';
        header.style.backdropFilter = 'none';
    }
});

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const canvas = document.getElementById('canvas3d');
        if (canvas) {
            const app = new window.Application(canvas);
            await app.load('https://prod.spline.design/vbR8w6UPXfXblAPv/scene.splinecode');
            console.log('Spline scene loaded successfully');
        }
    } catch (error) {
        console.error('Error loading Spline scene:', error);
    }
});