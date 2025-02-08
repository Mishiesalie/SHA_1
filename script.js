// Navigation scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const nav = document.getElementById('main-nav');
    const menuToggle = document.createElement('div');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');
    
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

    // Auth tabs functionality
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form-container');

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-container`).classList.add('active');
        });
    });

    // Password confirmation validation
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            if (password !== confirmPassword) {
                e.preventDefault();
                showNotification('Passwords do not match', 'error');
            }
        });
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    mobileMenuBtn?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Dropdown functionality for mobile
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Hero Slider
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    setInterval(nextSlide, 5000);

    // News & Updates
    loadNews();

    // Modal handling
    const modal = document.getElementById('auth-modal');
    const modalClose = document.getElementById('modal-close');
    const registerButtons = document.querySelectorAll('a[href="#register"]');
    const portalButtons = document.querySelectorAll('.portal-btn');

    function openModal() {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    // Open modal on register/portal button click
    registerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
            // Switch to register tab if clicked from register button
            if (this.getAttribute('href') === '#register') {
                document.querySelector('[data-tab="register"]').click();
            }
        });
    });

    portalButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
            // Default to login tab for portal button
            document.querySelector('[data-tab="login"]').click();
        });
    });

    // Close modal
    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Chatbot functionality
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const closeChat = document.querySelector('.close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendMessage = document.querySelector('.send-message');
    const chatMessages = document.querySelector('.chat-messages');
    const notificationBadge = document.querySelector('.notification-badge');

    let isTyping = false;

    // Show notification badge after 3 seconds
    setTimeout(() => {
        notificationBadge.classList.remove('hidden');
    }, 3000);

    function toggleChat() {
        chatbotWindow.classList.toggle('hidden');
        notificationBadge.classList.add('hidden');
        if (!chatbotWindow.classList.contains('hidden')) {
            chatInput.focus();
        }
    }

    function formatTime(date) {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    }

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = message.text;
        
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = formatTime(new Date(message.timestamp));
        
        messageDiv.appendChild(content);
        messageDiv.appendChild(time);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addTypingIndicator() {
        if (isTyping) return;
        
        isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.innerHTML = `
            <div class="message-content">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        isTyping = false;
    }

    async function handleUserMessage() {
        const messageText = chatInput.value.trim();
        if (!messageText || isTyping) return;

        try {
            // Clear input
            chatInput.value = '';

            // Add user message immediately
            const userMessage = {
                text: messageText,
                timestamp: new Date(),
                sender: 'user'
            };
            addMessage(userMessage, true);

            // Show typing indicator
            addTypingIndicator();

            // Send message to backend
            const response = await ChatbotService.sendMessage(messageText);
            
            // Remove typing indicator
            removeTypingIndicator();

            // Add bot response
            addMessage(response.data.botMessage);

        } catch (error) {
            console.error('Error handling message:', error);
            removeTypingIndicator();
            addMessage({
                text: "I'm sorry, I'm having trouble responding right now. Please try again later.",
                timestamp: new Date(),
                sender: 'bot'
            });
        }
    }

    chatbotToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleChat();
    });

    sendMessage.addEventListener('click', handleUserMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage();
        }
    });

    // Prevent closing when clicking inside the chat window
    chatbotWindow.addEventListener('click', (e) => {
        e.stopPropagation();
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
    BASE_URL: 'https://sha.go.ke/api/v1',
    ENDPOINTS: {
        // Authentication
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        RESET_PASSWORD: '/auth/reset-password',
        
        // Registration
        REGISTER_MEMBER: '/registration/member',
        REGISTER_EMPLOYER: '/registration/employer',
        REGISTER_PROVIDER: '/registration/healthcare-provider',
        VERIFY_ID: '/registration/verify-id',
        
        // Member Services
        MEMBER_PROFILE: '/members/profile',
        DEPENDENTS: '/members/dependents',
        CONTRIBUTION_HISTORY: '/members/contributions',
        CLAIMS_HISTORY: '/members/claims',
        BENEFITS: '/members/benefits',
        
        // Healthcare Provider Services
        PROVIDER_PROFILE: '/providers/profile',
        SUBMIT_CLAIM: '/providers/claims/submit',
        CLAIMS_STATUS: '/providers/claims/status',
        E_CONTRACTING: '/providers/contracting',
        
        // Employer Services
        EMPLOYER_PROFILE: '/employers/profile',
        EMPLOYEE_MANAGEMENT: '/employers/employees',
        BULK_REGISTRATION: '/employers/bulk-registration',
        PAYMENT_HISTORY: '/employers/payments',
        
        // General Services
        FACILITIES: '/facilities/search',
        NEWS: '/news',
        ANNOUNCEMENTS: '/announcements',
        DOWNLOADS: '/resources/downloads',
        FAQS: '/resources/faqs'
    },
    
    // API Headers
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// API Service Class
class SHAApiService {
    static getAuthHeader() {
        const token = localStorage.getItem('shaAuthToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    static async request(endpoint, options = {}) {
        try {
            const url = API_CONFIG.BASE_URL + endpoint;
            const headers = {
                ...API_CONFIG.HEADERS,
                ...this.getAuthHeader(),
                ...options.headers
            };

            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication Methods
    static async login(credentials) {
        return this.request(API_CONFIG.ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    static async logout() {
        return this.request(API_CONFIG.ENDPOINTS.LOGOUT, {
            method: 'POST'
        });
    }

    // Registration Methods
    static async registerMember(memberData) {
        return this.request(API_CONFIG.ENDPOINTS.REGISTER_MEMBER, {
            method: 'POST',
            body: JSON.stringify(memberData)
        });
    }

    static async verifyId(idData) {
        return this.request(API_CONFIG.ENDPOINTS.VERIFY_ID, {
            method: 'POST',
            body: JSON.stringify(idData)
        });
    }

    // Member Services
    static async getMemberProfile() {
        return this.request(API_CONFIG.ENDPOINTS.MEMBER_PROFILE);
    }

    static async getContributions() {
        return this.request(API_CONFIG.ENDPOINTS.CONTRIBUTION_HISTORY);
    }

    // Healthcare Provider Services
    static async submitClaim(claimData) {
        return this.request(API_CONFIG.ENDPOINTS.SUBMIT_CLAIM, {
            method: 'POST',
            body: JSON.stringify(claimData)
        });
    }

    // Employer Services
    static async registerEmployees(employeesData) {
        return this.request(API_CONFIG.ENDPOINTS.BULK_REGISTRATION, {
            method: 'POST',
            body: JSON.stringify(employeesData)
        });
    }

    // General Services
    static async searchFacilities(searchParams) {
        const queryString = new URLSearchParams(searchParams).toString();
        return this.request(`${API_CONFIG.ENDPOINTS.FACILITIES}?${queryString}`);
    }

    static async getNews() {
        return this.request(API_CONFIG.ENDPOINTS.NEWS);
    }

    static async getAnnouncements() {
        return this.request(API_CONFIG.ENDPOINTS.ANNOUNCEMENTS);
    }
}

// Update the news loading function to use the new API service
async function loadNews() {
    const newsGrid = document.querySelector('.news-grid');
    try {
        const news = await SHAApiService.getNews();
        news.forEach(item => {
            const newsCard = createNewsCard(item);
            newsGrid.appendChild(newsCard);
        });
    } catch (error) {
        console.error('Error loading news:', error);
        loadFallbackNews();
    }
}

function loadFallbackNews() {
    const newsGrid = document.querySelector('.news-grid');
    const fallbackNews = [
        {
            title: 'New Healthcare Facilities Added',
            date: '2024-03-15',
            excerpt: 'SHA expands its network with 50 new healthcare facilities...'
        },
        {
            title: 'Updated Benefits Package',
            date: '2024-03-10',
            excerpt: 'Members to enjoy enhanced benefits starting April 2024...'
        },
        // Add more fallback news items
    ];

    fallbackNews.forEach(item => {
        const newsCard = createNewsCard(item);
        newsGrid.appendChild(newsCard);
    });
}

function createNewsCard(item) {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
        <h3>${item.title}</h3>
        <p class="date">${formatDate(item.date)}</p>
        <p>${item.excerpt}</p>
        <a href="#" class="read-more">Read More</a>
    `;
    return card;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Statistics Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

function animateCounter(counter) {
    const target = +counter.innerText.replace(/[^\d]/g, '');
    const count = +counter.getAttribute('data-count') || 0;
    const increment = target / speed;

    if (count < target) {
        counter.setAttribute('data-count', Math.ceil(count + increment));
        counter.innerText = Math.ceil(count + increment).toLocaleString() + '+';
        setTimeout(() => animateCounter(counter), 1);
    } else {
        counter.innerText = target.toLocaleString() + '+';
    }
}

// Animate counters when they come into view
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
        }
    });
}, observerOptions);

counters.forEach(counter => observer.observe(counter));

// Update form submission handlers to use the new API service
document.getElementById('login-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const credentials = Object.fromEntries(formData.entries());

    try {
        const response = await SHAApiService.login(credentials);
        if (response.token) {
            localStorage.setItem('shaAuthToken', response.token);
            showNotification('Login successful!', 'success');
            window.location.href = '/dashboard';
        }
    } catch (error) {
        showNotification('Login failed. Please check your credentials.', 'error');
    }
});

document.getElementById('registration-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const memberData = Object.fromEntries(formData.entries());

    try {
        const response = await SHAApiService.registerMember(memberData);
        if (response.success) {
            showNotification('Registration successful!', 'success');
            window.location.href = '/login';
        }
    } catch (error) {
        showNotification('Registration failed. Please try again.', 'error');
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

// Add this to your existing JavaScript
class ChatbotService {
    static async sendMessage(message) {
        try {
            const response = await fetch('/api/v1/chatbot/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            return await response.json();
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
} 