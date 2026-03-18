const API_URL = 'http://localhost:5000/api';
let currentEvents = [];
let currentPlans = [];
let currentEditingEvent = null;
let currentEditingPlan = null;

// Check authentication on load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadEvents();
    loadPlans();


    const fileInput = document.getElementById('eventImageFile');
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (!file) return;
            croppedBlob = null;
            uploadedImageUrl = '';
            openCropModal(file);
        });
    }
});

function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'admin_login.html';
        return;
    }

    // Verify token
    fetch(`${API_URL}/auth/admin/verify`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
    })
    .catch(() => {
        localStorage.removeItem('adminToken');
        window.location.href = 'admin_login.html';
    });
}

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    };
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = 'admin_login.html';
    }
}

// Tab Navigation
function showTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');

    // Update sidebar menu
    document.querySelectorAll('.sidebar-menu a').forEach(link => link.classList.remove('active'));
}

// ========== EVENTS ==========

async function loadEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);
        const data = await response.json();

        if (data.success) {
            currentEvents = data.events;
            renderEvents();
            updateStats();
        }
    } catch (error) {
        console.error('Error loading events:', error);
        showNotification('Error loading events', 'error');
    }
}

function renderEvents() {
    const tbody = document.getElementById('eventsTableBody');

    if (currentEvents.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-calendar"></i>
                    <p>No events yet. Add your first event!</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = currentEvents.map(event => `
        <tr>
            <td><strong>${event.title}</strong></td>
            <td>${event.date}</td>
            <td>${event.location}</td>
            <td>${event.price}</td>
            <td><span class="badge badge-info">${event.category}</span></td>
            <td><span class="badge badge-${getStatusBadgeClass(event.status)}">${event.status}</span></td>
            <td class="action-buttons">
                <button class="btn btn-icon" onclick='editEvent("${event._id}")'>
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-icon" onclick='deleteEvent("${event._id}")'>
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getStatusBadgeClass(status) {
    const classes = {
        'upcoming': 'success',
        'ongoing': 'warning',
        'completed': 'info',
        'cancelled': 'danger'
    };
    return classes[status] || 'info';
}

// ========== IMAGE UPLOAD + CROP ==========

let uploadedImageUrl = '';
let cropperInstance = null;
let croppedBlob = null;

function switchImageTab(tab) {
    const urlSection = document.getElementById('imgUrlSection');
    const fileSection = document.getElementById('imgFileSection');
    const tabUrl = document.getElementById('imgTabUrl');
    const tabFile = document.getElementById('imgTabFile');

    if (tab === 'url') {
        urlSection.style.display = '';
        fileSection.style.display = 'none';
        tabUrl.className = 'btn';
        tabFile.className = 'btn btn-secondary';
    } else {
        urlSection.style.display = 'none';
        fileSection.style.display = '';
        tabUrl.className = 'btn btn-secondary';
        tabFile.className = 'btn';
    }
}

function openCropModal(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const cropModal = document.getElementById('cropModal');
        const cropImg = document.getElementById('cropperImage');

        cropImg.src = e.target.result;
        cropModal.style.display = 'flex';

        // Destroy previous instance
        if (cropperInstance) {
            cropperInstance.destroy();
            cropperInstance = null;
        }

        cropperInstance = new Cropper(cropImg, {
            aspectRatio: 16 / 9,
            viewMode: 1,
            autoCropArea: 1,
            movable: true,
            zoomable: true,
            rotatable: false,
            scalable: false
        });
    };
    reader.readAsDataURL(file);
}

function cancelCrop() {
    document.getElementById('cropModal').style.display = 'none';
    if (cropperInstance) { cropperInstance.destroy(); cropperInstance = null; }
    // Reset file input
    document.getElementById('eventImageFile').value = '';
    document.getElementById('imgUploadPreview').style.display = 'none';
    croppedBlob = null;
}

function applyCrop() {
    if (!cropperInstance) return;

    cropperInstance.getCroppedCanvas({ width: 800, height: 450 }).toBlob((blob) => {
        croppedBlob = blob;

        // Show preview
        const preview = document.getElementById('imgUploadPreview');
        const previewEl = document.getElementById('imgPreviewEl');
        previewEl.src = URL.createObjectURL(blob);
        preview.style.display = '';
        document.getElementById('imgUploadStatus').textContent = 'Cropped — will upload on save.';

        document.getElementById('cropModal').style.display = 'none';
        cropperInstance.destroy();
        cropperInstance = null;
    }, 'image/jpeg', 0.9);
}

async function uploadImageFile() {
    const blob = croppedBlob;
    if (!blob) {
        // Fallback: upload raw file if somehow no crop was done
        const fileInput = document.getElementById('eventImageFile');
        if (!fileInput.files[0]) return null;
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        return await doUpload(formData);
    }

    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');
    return await doUpload(formData);
}

async function doUpload(formData) {
    const statusEl = document.getElementById('imgUploadStatus');
    statusEl.textContent = 'Uploading...';

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            statusEl.textContent = 'Uploaded successfully';
            uploadedImageUrl = data.imageUrl;
            return data.imageUrl;
        } else {
            statusEl.textContent = 'Upload failed: ' + (data.message || 'Unknown error');
            return null;
        }
    } catch (err) {
        statusEl.textContent = 'Upload error. Check server.';
        return null;
    }
}

function openEventModal(event = null) {
    currentEditingEvent = event;
    uploadedImageUrl = '';
    croppedBlob = null;
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventForm');
    const title = document.getElementById('eventModalTitle');

    // Reset image tab to URL
    switchImageTab('url');
    document.getElementById('imgUploadPreview').style.display = 'none';

    if (event) {
        title.textContent = 'Edit Event';
        document.getElementById('eventId').value = event._id;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventPrice').value = event.price;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventParticipants').value = event.participants;
        document.getElementById('eventCategory').value = event.category;
        document.getElementById('eventDifficulty').value = event.difficulty;
        document.getElementById('eventStatus').value = event.status;
        document.getElementById('eventDuration').value = event.duration || '';
        document.getElementById('eventImage').value = event.image;
        document.getElementById('eventDescription').value = event.description;
    } else {
        title.textContent = 'Add Event';
        form.reset();
        document.getElementById('eventId').value = '';
    }

    modal.classList.add('active');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
    document.getElementById('eventForm').reset();
    currentEditingEvent = null;
}

document.getElementById('eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const eventId = document.getElementById('eventId').value;

    // Determine image: file upload takes priority over URL field
    let imageValue = document.getElementById('eventImage').value;
    const fileInput = document.getElementById('eventImageFile');
    const isFileTab = document.getElementById('imgFileSection').style.display !== 'none';

    if (isFileTab && fileInput.files[0]) {
        const uploaded = await uploadImageFile();
        if (!uploaded) {
            showNotification('Image upload failed. Please try again.', 'error');
            return;
        }
        imageValue = uploaded;
    } else if (isFileTab && uploadedImageUrl) {
        imageValue = uploadedImageUrl;
    }

    if (!imageValue) {
        showNotification('Please provide an image URL or upload an image file.', 'error');
        return;
    }

    const eventData = {
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        price: document.getElementById('eventPrice').value,
        location: document.getElementById('eventLocation').value,
        participants: document.getElementById('eventParticipants').value,
        category: document.getElementById('eventCategory').value,
        difficulty: document.getElementById('eventDifficulty').value,
        status: document.getElementById('eventStatus').value,
        duration: document.getElementById('eventDuration').value,
        image: imageValue,
        description: document.getElementById('eventDescription').value
    };

    try {
        const url = eventId ? `${API_URL}/events/${eventId}` : `${API_URL}/events`;
        const method = eventId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(eventData)
        });

        const data = await response.json();

        if (data.success) {
            showNotification(eventId ? 'Event updated successfully' : 'Event created successfully', 'success');
            closeEventModal();
            loadEvents();
        } else {
            showNotification(data.message || 'Error saving event', 'error');
        }
    } catch (error) {
        console.error('Error saving event:', error);
        showNotification('Error saving event', 'error');
    }
});

function editEvent(eventId) {
    const event = currentEvents.find(e => e._id === eventId);
    if (event) {
        openEventModal(event);
    }
}

async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
        const response = await fetch(`${API_URL}/events/${eventId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Event deleted successfully', 'success');
            loadEvents();
        } else {
            showNotification(data.message || 'Error deleting event', 'error');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        showNotification('Error deleting event', 'error');
    }
}

// ========== PLANS ==========

async function loadPlans() {
    try {
        const response = await fetch(`${API_URL}/plans`);
        const data = await response.json();

        if (data.success) {
            currentPlans = data.plans;
            renderPlans();
            updateStats();
        }
    } catch (error) {
        console.error('Error loading plans:', error);
        showNotification('Error loading plans', 'error');
    }
}

function renderPlans() {
    const tbody = document.getElementById('plansTableBody');

    if (currentPlans.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-box"></i>
                    <p>No plans yet. Add your first plan!</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = currentPlans.map(plan => `
        <tr>
            <td><strong>${plan.name}</strong></td>
            <td>${plan.currency}${plan.price}</td>
            <td>${plan.period}</td>
            <td><span class="badge badge-info">${plan.category}</span></td>
            <td>${plan.isPopular ? '<i class="fas fa-star" style="color: gold;"></i>' : '-'}</td>
            <td><span class="badge badge-${plan.status === 'active' ? 'success' : 'danger'}">${plan.status}</span></td>
            <td class="action-buttons">
                <button class="btn btn-icon" onclick='editPlan("${plan._id}")'>
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-icon" onclick='deletePlan("${plan._id}")'>
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function openPlanModal(plan = null) {
    currentEditingPlan = plan;
    const modal = document.getElementById('planModal');
    const form = document.getElementById('planForm');
    const title = document.getElementById('planModalTitle');

    if (plan) {
        title.textContent = 'Edit Plan';
        document.getElementById('planId').value = plan._id;
        document.getElementById('planName').value = plan.name;
        document.getElementById('planPrice').value = plan.price;
        document.getElementById('planPeriod').value = plan.period;
        document.getElementById('planCategory').value = plan.category;
        document.getElementById('planStatus').value = plan.status;
        document.getElementById('planDescription').value = plan.description;
        document.getElementById('planFeatures').value = (plan.features || []).join('\n');
        document.getElementById('planIsPopular').checked = plan.isPopular;
    } else {
        title.textContent = 'Add Plan';
        form.reset();
        document.getElementById('planId').value = '';
    }

    modal.classList.add('active');
}

function closePlanModal() {
    document.getElementById('planModal').classList.remove('active');
    document.getElementById('planForm').reset();
    currentEditingPlan = null;
}

document.getElementById('planForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const planId = document.getElementById('planId').value;
    const featuresText = document.getElementById('planFeatures').value;
    const features = featuresText.split('\n').filter(f => f.trim());

    const planData = {
        name: document.getElementById('planName').value,
        price: parseFloat(document.getElementById('planPrice').value),
        period: document.getElementById('planPeriod').value,
        category: document.getElementById('planCategory').value,
        status: document.getElementById('planStatus').value,
        description: document.getElementById('planDescription').value,
        features: features,
        isPopular: document.getElementById('planIsPopular').checked
    };

    try {
        const url = planId ? `${API_URL}/plans/${planId}` : `${API_URL}/plans`;
        const method = planId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(planData)
        });

        const data = await response.json();

        if (data.success) {
            showNotification(planId ? 'Plan updated successfully' : 'Plan created successfully', 'success');
            closePlanModal();
            loadPlans();
        } else {
            showNotification(data.message || 'Error saving plan', 'error');
        }
    } catch (error) {
        console.error('Error saving plan:', error);
        showNotification('Error saving plan', 'error');
    }
});

function editPlan(planId) {
    const plan = currentPlans.find(p => p._id === planId);
    if (plan) {
        openPlanModal(plan);
    }
}

async function deletePlan(planId) {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
        const response = await fetch(`${API_URL}/plans/${planId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Plan deleted successfully', 'success');
            loadPlans();
        } else {
            showNotification(data.message || 'Error deleting plan', 'error');
        }
    } catch (error) {
        console.error('Error deleting plan:', error);
        showNotification('Error deleting plan', 'error');
    }
}

// ========== STATS ==========

function updateStats() {
    document.getElementById('totalEvents').textContent = currentEvents.length;
    document.getElementById('totalPlans').textContent = currentPlans.length;
    document.getElementById('upcomingEvents').textContent = currentEvents.filter(e => e.status === 'upcoming').length;
    document.getElementById('activePlans').textContent = currentPlans.filter(p => p.status === 'active').length;
}

// ========== NOTIFICATIONS ==========

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
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
    }, 3000);
}
