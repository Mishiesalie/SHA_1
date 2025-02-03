// Navigation scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('main-nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            nav.style.backgroundColor = 'white';
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Dynamic content loading for Health Information section
function loadHealthUpdates() {
    const updates = [
        'New COVID-19 vaccination guidelines released',
        'Seasonal flu shots now available',
        'Mental health awareness workshop next week',
        'New pediatric wing opening soon'
    ];

    const updatesFeed = document.getElementById('updates-feed');
    updates.forEach(update => {
        const p = document.createElement('p');
        p.textContent = update;
        updatesFeed.appendChild(p);
    });
}

function loadResources() {
    const resources = [
        'Health Guidelines',
        'Medical Forms',
        'Insurance Information',
        'Patient Portal'
    ];

    const resourcesList = document.getElementById('resources-list');
    resources.forEach(resource => {
        const li = document.createElement('li');
        li.textContent = resource;
        resourcesList.appendChild(li);
    });
}

// Contact form handling
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    // Add form submission logic here
    alert('Thank you for your message. We will get back to you soon!');
    this.reset();
});

// Load dynamic content when page loads
window.addEventListener('load', function() {
    loadHealthUpdates();
    loadResources();
}); 