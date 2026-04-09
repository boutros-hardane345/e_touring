// Plans Page - Load all plans from API
// API_URL and WHATSAPP_ADMIN_NUMBER are already defined in script.js

let allPlans = [];

document.addEventListener('DOMContentLoaded', () => {
    loadAllPlans();
});

// Load all plans from API
async function loadAllPlans() {
    try {
        const response = await fetch(`${API_URL}/plans?status=active`);
        const data = await response.json();

        if (data.success) {
            allPlans = data.plans;
            renderPlans(allPlans);
        } else {
            loadFallbackPlans();
        }
    } catch (error) {
        console.error('Error loading plans:', error);
        loadFallbackPlans();
    }
}

// Render plans
function renderPlans(plans) {
    const container = document.querySelector('.pricing-grid') || document.querySelector('.grid-3');

    if (!container) return;

    if (plans.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray-dark);">
                <i class="fas fa-box" style="font-size: 4rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <p>No plans available. Check back soon!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = plans.map((plan, index) => `
        <div class="card plan-card ${plan.isPopular ? 'popular' : ''}" data-aos="fade-up" data-aos-delay="${(index % 3) * 100}">
            <div class="card-content" style="padding: 2rem;">
                <h3 style="text-align: center; color: var(--primary); margin-bottom: 1rem;">${plan.name}</h3>

                <div class="plan-price">
                    <span class="currency">${plan.currency}</span>
                    <span class="amount">${plan.price}</span>
                    <div class="period">per ${plan.period}</div>
                </div>

                <p style="text-align: center; color: var(--gray-dark); margin: 1.5rem 0;">
                    ${plan.description}
                </p>

                ${plan.features && plan.features.length > 0 ? `
                <ul class="plan-features">
                    ${plan.features.map(feature => `
                        <li>
                            <i class="fas fa-check-circle" style="color: var(--primary); margin-right: 0.5rem;"></i>
                            ${feature}
                        </li>
                    `).join('')}
                </ul>
                ` : ''}

                <div style="margin-top: 2rem;">
                    <button class="btn" onclick='bookPlanWhatsApp(${JSON.stringify(plan).replace(/'/g, "&apos;")})' style="width: 100%;">
                        <i class="fab fa-whatsapp"></i> Subscribe via WhatsApp
                    </button>
                </div>

                ${plan.isPopular ? `
                    <div style="text-align: center; margin-top: 1rem;">
                        <span style="background: var(--primary-bg); color: var(--primary); padding: 0.25rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 500;">
                            <i class="fas fa-star"></i> Most Popular
                        </span>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');

    // Re-initialize AOS for new elements
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Fallback plans if API is unavailable
function loadFallbackPlans() {
    allPlans = [
        {
            name: 'Explorer',
            price: 29,
            currency: '$',
            period: 'month',
            category: 'basic',
            description: 'Perfect for beginners exploring eco-tourism',
            isPopular: false,
            features: [
                '2 events per month',
                'Access to hiking events',
                'Basic eco-tourism guide',
                'Community forum access',
                'Email support'
            ]
        },
        {
            name: 'Adventurer',
            price: 59,
            currency: '$',
            period: 'month',
            category: 'standard',
            description: 'For regular participants who want more',
            isPopular: true,
            features: [
                '5 events per month',
                'All event categories',
                'Advanced eco-tourism guide',
                'Priority booking',
                'Exclusive workshops',
                'Eco-kit included',
                'Phone & email support',
                '10% discount on merchandise'
            ]
        },
        {
            name: 'Guardian',
            price: 99,
            currency: '$',
            period: 'month',
            category: 'premium',
            description: 'Ultimate eco-tourism experience',
            isPopular: false,
            features: [
                'Unlimited events',
                'VIP access to all activities',
                'Personal guide available',
                'Free camping equipment rental',
                'Exclusive retreats',
                'Complete eco-kit',
                'Private workshops',
                '24/7 priority support',
                '20% discount on all purchases',
                'Free event photography'
            ]
        }
    ];

    renderPlans(allPlans);
}
