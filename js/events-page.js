// Events Page - Load all events from API
// API_URL and WHATSAPP_ADMIN_NUMBER are already defined in script.js

let allEvents = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    loadAllEvents();
    setupFilters();
});

// Load all events from API
async function loadAllEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);
        const data = await response.json();

        if (data.success) {
            allEvents = data.events;
            renderEvents(allEvents);
        } else {
            loadFallbackEvents();
        }
    } catch (error) {
        console.error('Error loading events:', error);
        loadFallbackEvents();
    }
}

// Render events
function renderEvents(events) {
    const container = document.querySelector('.events-grid') || document.querySelector('.grid');

    if (!container) return;

    if (events.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray-dark);">
                <i class="fas fa-calendar" style="font-size: 4rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <p>No events found. Check back soon!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = events.map((event, index) => `
        <div class="card event-card" data-aos="fade-up" data-aos-delay="${(index % 3) * 100}">
            ${event.status === 'upcoming' ? '<span class="event-badge">Upcoming</span>' : ''}
            <img src="${event.image}" alt="${event.title}" class="card-img" loading="lazy">
            <div class="card-content">
                <h3 class="card-title">${event.title}</h3>

                <div class="event-details">
                    <div class="event-detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>${event.date}</span>
                    </div>
                    <div class="event-detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                </div>

                <div class="event-details">
                    <div class="event-detail-item">
                        <i class="fas fa-users"></i>
                        <span>${event.participants}</span>
                    </div>
                    <div class="event-detail-item">
                        <i class="fas fa-tag"></i>
                        <span>${event.price}</span>
                    </div>
                </div>

                ${event.difficulty ? `
                <div class="event-details">
                    <div class="event-detail-item">
                        <i class="fas fa-signal"></i>
                        <span>Difficulty: ${event.difficulty}</span>
                    </div>
                    ${event.duration ? `
                    <div class="event-detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${event.duration}</span>
                    </div>
                    ` : ''}
                </div>
                ` : ''}

                <p class="mt-2">${event.description}</p>

                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="btn" onclick='bookEventWhatsApp(${JSON.stringify(event).replace(/'/g, "&apos;")})' style="flex: 1;">
                        <i class="fab fa-whatsapp"></i> Book Now
                    </button>
                    <button class="btn btn-outline" onclick='bookEventWithForm(${JSON.stringify(event).replace(/'/g, "&apos;")})' style="flex: 1;">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Re-initialize AOS for new elements
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Setup category filters
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.filter || 'all';
            currentFilter = category;

            if (category === 'all') {
                renderEvents(allEvents);
            } else {
                const filtered = allEvents.filter(event => event.category === category);
                renderEvents(filtered);
            }
        });
    });
}

// Fallback events if API is unavailable
function loadFallbackEvents() {
    allEvents = [
        {
            title: 'Hiking – Tannourine Cedar Forest',
            date: 'March 20, 2026',
            price: '$20',
            location: 'Tannourine',
            participants: '25 Participants',
            difficulty: 'medium',
            duration: '4 hours',
            category: 'hiking',
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Explore the magnificent cedar forests of Tannourine. Experience nature at its finest while learning about Lebanon\'s national tree.'
        },
        {
            title: 'Beach Cleanup – Batroun Coast',
            date: 'March 25, 2026',
            price: 'Free',
            location: 'Batroun',
            participants: '60 Volunteers',
            difficulty: 'easy',
            duration: '3 hours',
            category: 'cleanup',
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Join us for a meaningful beach cleanup. Help preserve our beautiful coastline and protect marine life.'
        },
        {
            title: 'Mountain Camping – Bekaa Valley',
            date: 'April 5, 2026',
            price: '$60',
            location: 'Bekaa Valley',
            participants: '15 Campers',
            difficulty: 'hard',
            duration: '2 days',
            category: 'camping',
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Experience overnight camping under the stars in the Bekaa Valley. Includes camping equipment and meals.'
        },
        {
            title: 'Eco Workshop – Sustainable Living',
            date: 'April 12, 2026',
            price: '$15',
            location: 'Beirut',
            participants: '30 Participants',
            difficulty: 'easy',
            duration: '2 hours',
            category: 'workshop',
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Learn practical tips for sustainable living. Topics include zero waste, composting, and eco-friendly alternatives.'
        },
        {
            title: 'Waterfall Hiking – Jezzine',
            date: 'April 20, 2026',
            price: '$25',
            location: 'Jezzine',
            participants: '20 Participants',
            difficulty: 'medium',
            duration: '5 hours',
            category: 'hiking',
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Trek to the stunning Jezzine waterfalls. Enjoy breathtaking views and refreshing natural pools.'
        }
    ];

    renderEvents(allEvents);
}
