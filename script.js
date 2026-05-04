document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }

                // Account for fixed header
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle touch/click for interactive cards on mobile
    const interactiveCards = document.querySelectorAll('.interactive-card');
    
    interactiveCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // If the user is clicking on a link inside the card, let it happen naturally
            if(e.target.tagName.toLowerCase() === 'a') return;
            
            // Toggle active state for tap interaction (mobile fallback)
            // On desktop, CSS hover handles the interaction, but toggle active is harmless
            const wasActive = this.classList.contains('active');
            
            // Remove active from all others
            interactiveCards.forEach(c => c.classList.remove('active'));
            
            // Toggle current
            if (!wasActive) {
                this.classList.add('active');
            }
        });
    });

    // Close cards when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.interactive-card')) {
            interactiveCards.forEach(card => card.classList.remove('active'));
        }
    });
});
