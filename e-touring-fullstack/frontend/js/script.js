// API Configuration
const API_URL = 'http://localhost:5000/api';

// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Global state
let currentUser = null;

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        fetch(`${API_URL}/auth/me`, {
            headers: {
                'x-auth-token': token
            }
        })
        .then(res => res.json())
        .then(user => {
            currentUser = user;
            updateUIForAuth();
        })
        .catch(() => {
            localStorage.removeItem('token');
        });
    }
}

// Update UI based on auth status
function updateUIForAuth() {
    const navLinks = document.querySelector('.nav-links');
    if (currentUser) {
        // Add user menu to navigation
        const userMenuItem = document.createElement('div');
        userMenuItem.className = 'user-menu';
        userMenuItem.innerHTML = `
            <span>Welcome, ${currentUser.name}</span>
            <button onclick="logout()" class="btn-logout">Logout</button>
        `;
        navLinks.appendChild(userMenuItem);
        
        // Show admin links if user is admin
        if (currentUser.role === 'admin') {
            showAdminLinks();
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    window.location.reload();
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load events
async function loadEvents(filter = 'all') {
    try {
        let url = `${API_URL}/events`;
        if (filter !== 'all') {
            url += `?category=${filter}`;
        }
        
        const response = await fetch(url);
        const events = await response.json();
        
        displayEvents(events);
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

// Display events in grid
function displayEvents(events) {
    const eventsGrid = document.querySelector('.events-grid');
    if (!eventsGrid) return;
    
    eventsGrid.innerHTML = events.map(event => `
        <div class="card event-card" data-category="${event.category}">
            <span class="event-badge">${event.status}</span>
            <img src="${event.image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470'}" 
                 alt="${event.title}" 
                 class="card-img"
                 loading="lazy">
            <div class="card-content">
                <h3 class="card-title">${event.title}</h3>
                <div class="event-details">
                    <span class="event-detail-item"><i class="fas fa-calendar"></i> ${new Date(event.date).toLocaleDateString()}</span>
                    <span class="event-detail-item"><i class="fas fa-clock"></i> ${event.time}</span>
                    <span class="event-detail-item"><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                </div>
                <p>${event.description.substring(0, 100)}...</p>
                <div class="event-details mt-2">
                    <span class="event-detail-item"><i class="fas fa-users"></i> ${event.maxParticipants - event.currentParticipants} spots left</span>
                    <span class="event-detail-item"><i class="fas fa-tag"></i> $${event.price}</span>
                    <span class="event-detail-item"><i class="fas fa-signal"></i> ${event.difficulty}</span>
                </div>
                <button class="btn mt-3" onclick="bookEvent('${event._id}')">Book Now</button>
            </div>
        </div>
    `).join('');
}

// Book event
async function bookEvent(eventId) {
    if (!currentUser) {
        showNotification('Please login to book an event', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({
                eventId,
                participants: 1
            })
        });
        
        if (response.ok) {
            showNotification('Booking successful!');
        } else {
            showNotification('Booking failed', 'error');
        }
    } catch (error) {
        console.error('Error booking event:', error);
        showNotification('Error booking event', 'error');
    }
}

// Handle contact form
async function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showNotification('Message sent successfully!');
            event.target.reset();
        } else {
            showNotification('Failed to send message', 'error');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Error sending message', 'error');
    }
}

// Handle volunteer form
async function handleVolunteerForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    try {
        const response = await fetch(`${API_URL}/volunteers`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showNotification('Application submitted successfully!');
            event.target.reset();
        } else {
            showNotification('Failed to submit application', 'error');
        }
    } catch (error) {
        console.error('Error submitting application:', error);
        showNotification('Error submitting application', 'error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Load events on events page
    if (window.location.pathname.includes('events_page.html')) {
        loadEvents();
        
        // Setup filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                loadEvents(this.dataset.filter);
            });
        });
    }
    
    // Setup contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Setup volunteer form
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', handleVolunteerForm);
    }
    
    // Mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});