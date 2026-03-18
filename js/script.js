// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-links') && !event.target.closest('.menu-btn')) {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuBtn.innerHTML = '☰';
            }
        }
    });

    // Close menu when clicking on a link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuBtn.innerHTML = '☰';
        });
    });

    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // Load events dynamically
    loadEvents();
    
    // Load testimonials
    loadTestimonials();
    
    // Initialize form validation
    initFormValidation();
    
    // Handle file upload
    initFileUpload();
});

// API Configuration
const API_URL = 'http://localhost:5000/api';
const WHATSAPP_ADMIN_NUMBER = '96170263067'; // WhatsApp number for bookings

// Load Events from API
async function loadEvents() {
    const eventsGrid = document.querySelector('.events-grid');
    if (!eventsGrid) return;

    try {
        const response = await fetch(`${API_URL}/events?status=upcoming`);
        const data = await response.json();

        if (data.success && data.events.length > 0) {
            // Show only first 3 events on homepage
            const events = data.events.slice(0, 3);

            eventsGrid.innerHTML = events.map((event, index) => `
                <div class="card" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <img src="${event.image}" alt="${event.title}" class="card-img" loading="lazy">
                    <div class="card-content">
                        <h3 class="card-title">${event.title}</h3>
                        <p><i class="fas fa-calendar" style="color: var(--primary);"></i> ${event.date}</p>
                        <p><i class="fas fa-map-marker-alt" style="color: var(--primary);"></i> ${event.location}</p>
                        <p><i class="fas fa-users" style="color: var(--primary);"></i> ${event.participants}</p>
                        <p><i class="fas fa-tag" style="color: var(--primary);"></i> ${event.price}</p>
                        <p class="mt-2">${event.description}</p>
                        <button class="btn mt-3" onclick='bookEventWhatsApp(${JSON.stringify(event).replace(/'/g, "&apos;")})'>
                            <i class="fab fa-whatsapp"></i> Book via WhatsApp
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            // Fallback to default events if API fails or no events
            loadDefaultEvents(eventsGrid);
        }
    } catch (error) {
        console.error('Error loading events from API:', error);
        // Fallback to default events
        loadDefaultEvents(eventsGrid);
    }
}

// Fallback events if API is not available
function loadDefaultEvents(eventsGrid) {
    const events = [
        {
            title: 'Hiking – Tannourine',
            date: 'March 20, 2026',
            price: '$20',
            location: 'Tannourine',
            participants: '25 Participants',
            image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Explore the beautiful cedar forests of Tannourine'
        },
        {
            title: 'Beach Cleanup – Batroun',
            date: 'May 25, 2026',
            price: 'Free',
            location: 'Batroun',
            participants: '60 Volunteers',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Help us keep our beaches clean and beautiful'
        },
        {
            title: 'Camping – Bekaa',
            date: 'June 15, 2026',
            price: '$60',
            location: 'Bekaa Valley',
            participants: '15 Campers',
            image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Experience overnight camping in the Bekaa valley'
        }
    ];

    eventsGrid.innerHTML = events.map((event, index) => `
        <div class="card" data-aos="fade-up" data-aos-delay="${index * 100}">
            <img src="${event.image}" alt="${event.title}" class="card-img" loading="lazy">
            <div class="card-content">
                <h3 class="card-title">${event.title}</h3>
                <p><i class="fas fa-calendar" style="color: var(--primary);"></i> ${event.date}</p>
                <p><i class="fas fa-map-marker-alt" style="color: var(--primary);"></i> ${event.location}</p>
                <p><i class="fas fa-users" style="color: var(--primary);"></i> ${event.participants}</p>
                <p><i class="fas fa-tag" style="color: var(--primary);"></i> ${event.price}</p>
                <p class="mt-2">${event.description}</p>
                <button class="btn mt-3" onclick='bookEventWhatsApp(${JSON.stringify(event).replace(/'/g, "&apos;")})'>
                    <i class="fab fa-whatsapp"></i> Book via WhatsApp
                </button>
            </div>
        </div>
    `).join('');
}

// Load Testimonials
function loadTestimonials() {
    const testimonialsContainer = document.querySelector('.testimonials');
    if (!testimonialsContainer) return;

    const testimonials = [
        {
            name: 'Sarah Khalil',
            role: 'Regular Participant',
            image: 'https://randomuser.me/api/portraits/women/1.jpg',
            text: 'e_Touring has completely changed how I experience nature in Lebanon. The guides are knowledgeable and passionate!'
        },
        {
            name: 'Ahmad Haddad',
            role: 'Volunteer',
            image: 'https://randomuser.me/api/portraits/men/1.jpg',
            text: 'Volunteering with e_Touring has been life-changing. I\'ve met amazing people and helped protect our environment.'
        },
        {
            name: 'Maria Abou Jaoude',
            role: 'Eco-enthusiast',
            image: 'https://randomuser.me/api/portraits/women/2.jpg',
            text: 'The attention to sustainability and education makes every trip special. Highly recommended!'
        }
    ];

    testimonialsContainer.innerHTML = testimonials.map((testimonial, index) => `
        <div class="testimonial-card" data-aos="fade-up" data-aos-delay="${index * 100}">
            <p class="testimonial-text">"${testimonial.text}"</p>
            <div class="testimonial-author">
                <img src="${testimonial.image}" alt="${testimonial.name}" loading="lazy">
                <div>
                    <h4>${testimonial.name}</h4>
                    <p class="text-primary">${testimonial.role}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Simulate form submission
                showNotification('Form submitted successfully!', 'success');
                this.reset();
            }
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(input);
        }
    });

    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    // Remove existing error
    clearError(input);

    // Add error class
    input.classList.add('error');
    
    // Create error message
    const error = document.createElement('div');
    error.className = 'error-message';
    error.style.color = '#dc3545';
    error.style.fontSize = '0.875rem';
    error.style.marginTop = '0.25rem';
    error.textContent = message;
    
    formGroup.appendChild(error);
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    input.classList.remove('error');
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// File Upload Handler
function initFileUpload() {
    const fileUploads = document.querySelectorAll('.file-upload input[type="file"]');
    
    fileUploads.forEach(upload => {
        upload.addEventListener('change', function(e) {
            const fileName = this.files[0]?.name;
            const parent = this.closest('.file-upload');
            
            if (fileName) {
                const fileInfo = document.createElement('p');
                fileInfo.className = 'file-info';
                fileInfo.style.color = 'var(--primary)';
                fileInfo.style.marginTop = '0.5rem';
                fileInfo.innerHTML = `<i class="fas fa-check-circle"></i> ${fileName}`;
                
                // Remove existing file info
                const existing = parent.querySelector('.file-info');
                if (existing) existing.remove();
                
                parent.appendChild(fileInfo);
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'var(--primary)' : '#dc3545'};
        color: white;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Event Registration
function registerForEvent(eventName) {
    showNotification(`Registration opened for ${eventName}`, 'success');
    // Redirect to registration page
    setTimeout(() => {
        window.location.href = 'register_page.html';
    }, 1500);
}

// Newsletter Subscription
document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        if (isValidEmail(email)) {
            showNotification('Successfully subscribed to newsletter!', 'success');
            this.reset();
        } else {
            showNotification('Please enter a valid email address', 'error');
        }
    });
});

// Counter Animation for Stats
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + '+';
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current) + '+';
            }
        }, 30);
    });
}

// Check if stats are in viewport
function checkStatsInView() {
    const stats = document.querySelector('.stats');
    if (!stats) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(stats);
}

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
    
    checkStatsInView();
});

// Form Submission Handler
class FormHandler {
    constructor() {
        this.initForms();
        this.initBooking();
    }

    initForms() {
        // Volunteer Form
        const volunteerForm = document.getElementById('volunteerForm');
        if (volunteerForm) {
            volunteerForm.addEventListener('submit', (e) => this.handleVolunteerSubmit(e));
        }

        // Contact Form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
    }

    initBooking() {
        // Add booking functionality to all "Book Now" buttons
        document.querySelectorAll('.btn[onclick*="bookPlan"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const planName = e.target.closest('.btn').getAttribute('onclick').match(/'([^']+)'/)[1];
                this.handleBooking(planName);
            });
        });
    }

    handleVolunteerSubmit(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Validate
        if (!this.validateForm(data)) return;
        
        // Save to localStorage (for demo)
        this.saveToLocalStorage('volunteers', data);
        
        // Send email notification (simulated)
        this.sendNotification('volunteer', data);
        
        // Show success message
        this.showSuccess('Application submitted successfully! We\'ll contact you soon.');
        
        // Reset form
        e.target.reset();
    }

    handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        if (!this.validateForm(data)) return;
        
        this.saveToLocalStorage('contacts', data);
        this.sendNotification('contact', data);
        this.showSuccess('Message sent successfully! We\'ll respond within 24 hours.');
        
        e.target.reset();
    }

    handleBooking(planName) {
        // Create booking object
        const booking = {
            plan: planName,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        // Save to localStorage
        this.saveToLocalStorage('bookings', booking);
        
        // Show booking modal
        this.showBookingModal(planName);
    }

    validateForm(data) {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            this.showError('Please enter a valid email address');
            return false;
        }
        
        // Phone validation (optional)
        if (data.phone && data.phone.trim() !== '') {
            const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
            if (!phoneRegex.test(data.phone)) {
                this.showError('Please enter a valid phone number');
                return false;
            }
        }
        
        return true;
    }

    saveToLocalStorage(type, data) {
        // Get existing data
        let existing = localStorage.getItem(type);
        existing = existing ? JSON.parse(existing) : [];
        
        // Add new data with timestamp
        data.timestamp = new Date().toISOString();
        data.id = Date.now();
        existing.push(data);
        
        // Save back
        localStorage.setItem(type, JSON.stringify(existing));
        
        console.log(`Saved to ${type}:`, data); // For demo
    }

    sendNotification(type, data) {
        // Simulate sending email
        console.log(`📧 Sending ${type} notification:`, data);
        
        // In a real app, you would send to your backend
        // fetch('/api/send-email', {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({type, data})
        // });
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#2f7d32' : '#dc3545'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    showBookingModal(planName) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'booking-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 12px;
                max-width: 400px;
                width: 90%;
                text-align: center;
            ">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: #2f7d32; margin-bottom: 1rem;"></i>
                <h3>Booking Started!</h3>
                <p>You're booking: <strong>${planName}</strong></p>
                <p>Please complete your registration to confirm.</p>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button class="btn" onclick="window.location.href='register_page.html'">Continue to Register</button>
                    <button class="btn btn-outline" onclick="this.closest('.booking-modal').remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
}

// Initialize form handler
document.addEventListener('DOMContentLoaded', () => {
    window.formHandler = new FormHandler();
});

// ========== WHATSAPP BOOKING FUNCTIONS ==========

// Book Event via WhatsApp
function bookEventWhatsApp(event) {
    // Create WhatsApp message with event details
    const message = `Hello! I would like to book the following event:\n\n` +
        `📅 *Event:* ${event.title}\n` +
        `📍 *Location:* ${event.location}\n` +
        `🗓️ *Date:* ${event.date}\n` +
        `💰 *Price:* ${event.price}\n` +
        `👥 *Participants:* ${event.participants}\n\n` +
        `Please provide me with more details about this event.`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${WHATSAPP_ADMIN_NUMBER}?text=${encodedMessage}`;

    // Open WhatsApp in new window
    window.open(whatsappURL, '_blank');
}

// Book Plan via WhatsApp
function bookPlanWhatsApp(plan) {
    // Create WhatsApp message with plan details
    const message = `Hello! I would like to subscribe to the following plan:\n\n` +
        `📦 *Plan:* ${plan.name}\n` +
        `💰 *Price:* ${plan.currency}${plan.price}/${plan.period}\n` +
        `📋 *Category:* ${plan.category}\n` +
        `📝 *Description:* ${plan.description}\n\n` +
        `Please provide me with more details about this subscription plan.`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${WHATSAPP_ADMIN_NUMBER}?text=${encodedMessage}`;

    // Open WhatsApp in new window
    window.open(whatsappURL, '_blank');
}

// Alternative: Show booking form modal before WhatsApp
function bookEventWithForm(event) {
    showBookingFormModal('event', event);
}

function bookPlanWithForm(plan) {
    showBookingFormModal('plan', plan);
}

function showBookingFormModal(type, item) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 1rem;
    `;

    const itemName = type === 'event' ? item.title : item.name;
    const itemDetails = type === 'event'
        ? `${item.date} | ${item.location} | ${item.price}`
        : `${item.currency}${item.price}/${item.period}`;

    modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="margin: 0; color: var(--primary);">
                    <i class="fab fa-whatsapp"></i> Book via WhatsApp
                </h3>
                <button onclick="this.closest('.booking-modal').remove()" style="
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--gray-dark);
                ">&times;</button>
            </div>

            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <strong>${itemName}</strong><br>
                <small style="color: var(--gray-dark);">${itemDetails}</small>
            </div>

            <form id="whatsappBookingForm">
                <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" class="form-control" id="bookingName" required>
                </div>

                <div class="form-group">
                    <label>Phone Number *</label>
                    <input type="tel" class="form-control" id="bookingPhone" required placeholder="+961 70 123 456">
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-control" id="bookingEmail" placeholder="optional">
                </div>

                <div class="form-group">
                    <label>Number of People</label>
                    <input type="number" class="form-control" id="bookingPeople" value="1" min="1">
                </div>

                <div class="form-group">
                    <label>Additional Notes</label>
                    <textarea class="form-control" id="bookingNotes" rows="3" placeholder="Any special requests or questions..."></textarea>
                </div>

                <button type="submit" class="btn" style="width: 100%;">
                    <i class="fab fa-whatsapp"></i> Send Booking via WhatsApp
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Handle form submission
    document.getElementById('whatsappBookingForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('bookingName').value;
        const phone = document.getElementById('bookingPhone').value;
        const email = document.getElementById('bookingEmail').value;
        const people = document.getElementById('bookingPeople').value;
        const notes = document.getElementById('bookingNotes').value;

        // Create detailed WhatsApp message
        let message = `🎫 *New Booking Request*\n\n`;
        message += `📌 *${type === 'event' ? 'Event' : 'Plan'}:* ${itemName}\n`;

        if (type === 'event') {
            message += `📅 *Date:* ${item.date}\n`;
            message += `📍 *Location:* ${item.location}\n`;
            message += `💰 *Price:* ${item.price}\n`;
        } else {
            message += `💰 *Price:* ${item.currency}${item.price}/${item.period}\n`;
            message += `📋 *Category:* ${item.category}\n`;
        }

        message += `\n👤 *Customer Details:*\n`;
        message += `• Name: ${name}\n`;
        message += `• Phone: ${phone}\n`;
        if (email) message += `• Email: ${email}\n`;
        message += `• Number of People: ${people}\n`;
        if (notes) message += `\n📝 *Notes:* ${notes}`;

        // Encode and send via WhatsApp
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${WHATSAPP_ADMIN_NUMBER}?text=${encodedMessage}`;

        window.open(whatsappURL, '_blank');
        modal.remove();

        // Show confirmation
        showNotification('Redirecting to WhatsApp...', 'success');
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}