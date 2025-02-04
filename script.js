// Navigation scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const nav = document.getElementById('main-nav');
    const menuToggle = document.createElement('div');
    const navLinks = document.querySelector('.nav-links');
    
    // Add mobile menu button
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    nav.appendChild(menuToggle);

    // Scroll behavior
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        // Animate hamburger to X
        this.classList.toggle('active');
        const spans = this.querySelectorAll('span');
        if (this.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
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

// API Configuration
const API_CONFIG = {
    BASE_URL: 'https://sha.go.ke/api',
    ENDPOINTS: {
        REGISTER_INDIVIDUAL: '/register/individual',
        REGISTER_EMPLOYER: '/register/employer',
        ASSISTED_REGISTRATION: '/register/assisted',
        LOGIN: '/auth/login',
        ELIGIBILITY_CHECK: '/eligibility/check',
        E_CONTRACTING: '/contracting'
    }
};

// Authentication and Registration Service
class SHAService {
    static async registerIndividual(userData) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER_INDIVIDUAL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    static async registerEmployer(employerData) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER_EMPLOYER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employerData)
            });
            return await response.json();
        } catch (error) {
            console.error('Employer registration error:', error);
            throw error;
        }
    }

    static async checkEligibility(criteria) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ELIGIBILITY_CHECK}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(criteria)
            });
            return await response.json();
        } catch (error) {
            console.error('Eligibility check error:', error);
            throw error;
        }
    }

    static async login(credentials) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            return await response.json();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
}

// Form handling for registration and login
document.addEventListener('DOMContentLoaded', function() {
    // Registration form handling
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const userData = Object.fromEntries(formData.entries());
            
            try {
                const response = await SHAService.registerIndividual(userData);
                if (response.success) {
                    showNotification('Registration successful!', 'success');
                    // Redirect to dashboard or login page
                    window.location.href = '/login';
                } else {
                    showNotification(response.message || 'Registration failed', 'error');
                }
            } catch (error) {
                showNotification('An error occurred during registration', 'error');
            }
        });
    }

    // Login form handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const credentials = Object.fromEntries(formData.entries());
            
            try {
                const response = await SHAService.login(credentials);
                if (response.success) {
                    // Store auth token
                    localStorage.setItem('shaAuthToken', response.token);
                    showNotification('Login successful!', 'success');
                    // Redirect to dashboard
                    window.location.href = '/dashboard';
                } else {
                    showNotification(response.message || 'Login failed', 'error');
                }
            } catch (error) {
                showNotification('An error occurred during login', 'error');
            }
        });
    }
});

// Utility function for notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add notification styles to CSS
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }

    .notification.success {
        background-color: #4CAF50;
    }

    .notification.error {
        background-color: #f44336;
    }

    .notification.info {
        background-color: #2196F3;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet); 