# e_Touring - Eco-Tourism Platform 🌿

A complete web application for managing eco-tourism events and subscription plans in Lebanon.

## ✨ Features

### For Visitors
- 🏞️ Browse upcoming eco-tourism events
- 📦 View subscription plans
- 📱 Book events/plans via WhatsApp
- 🌐 Responsive design (mobile-friendly)
- 🎨 Beautiful, modern UI

### For Admins
- 🔐 Secure admin panel
- ➕ Add/Edit/Delete events
- 📋 Manage subscription plans
- 📊 View statistics
- 🖼️ Upload event images

### Technical Features
- 🚀 Node.js + Express backend
- 💾 MongoDB database
- 🔒 JWT authentication
- 📱 WhatsApp API integration
- 🎯 RESTful API
- ⚡ Real-time updates

---

## 🏗️ Project Structure

```
e_touring/
├── backend/                    # Backend API
│   ├── models/                # Database models
│   │   ├── Event.js          # Event schema
│   │   └── Plan.js           # Plan schema
│   ├── routes/               # API routes
│   │   ├── auth.js          # Authentication
│   │   ├── events.js        # Events CRUD
│   │   └── plans.js         # Plans CRUD
│   ├── middleware/          # Auth middleware
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   └── .env               # Configuration
│
├── css/
│   └── style.css          # Main stylesheet
│
├── js/
│   ├── script.js          # Main JS (navigation, forms)
│   ├── events-page.js     # Events page logic
│   ├── plans-page.js      # Plans page logic
│   └── admin-dashboard.js # Admin panel logic
│
├── images/                # Images and logos
│
├── index.html            # Homepage
├── about.html           # About page
├── events_page.html     # Events listing
├── plans_pages.html     # Plans listing
├── register_page.html   # Volunteer registration
├── contact_us_page.html # Contact form
├── admin_login.html     # Admin login
├── admin_dashboard.html # Admin panel
│
├── SETUP_GUIDE.md       # Complete setup instructions
├── QUICK_START.md       # Quick start guide
└── README.md           # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
# Edit backend/.env with your settings
MONGODB_URI=your_mongodb_connection_string
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
WHATSAPP_ADMIN_NUMBER=96170000000
```

3. **Start backend:**
```bash
npm start
```

4. **Open website:**
- Main site: Open `index.html`
- Admin panel: Open `admin_login.html`

**📖 For detailed instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

---

## 🔐 Admin Credentials

**Default Login:**
- Username: `admin`
- Password: `admin123`

⚠️ **Change these in `backend/.env` file!**

---

## 📱 WhatsApp Integration

### How It Works

1. User clicks "Book via WhatsApp" on event/plan
2. Pre-filled message opens in WhatsApp
3. User sends message to admin number
4. Admin receives booking request

### Setup

Update WhatsApp number in:
- `backend/.env`
- `js/script.js`
- `js/events-page.js`
- `js/plans-page.js`

Format: `96170123456` (country code + number, no +)

---

## 🎯 API Endpoints

### Public Endpoints
```
GET  /api/events        # Get all events
GET  /api/events/:id    # Get single event
GET  /api/plans         # Get all plans
GET  /api/plans/:id     # Get single plan
POST /api/auth/admin/login  # Admin login
```

### Admin Endpoints (Requires JWT Token)
```
POST   /api/events      # Create event
PUT    /api/events/:id  # Update event
DELETE /api/events/:id  # Delete event
POST   /api/plans       # Create plan
PUT    /api/plans/:id   # Update plan
DELETE /api/plans/:id   # Delete plan
```

---

## 🗄️ Database Models

### Event Schema
```javascript
{
  title: String,
  date: String,
  location: String,
  price: String,
  participants: String,
  image: String,
  description: String,
  category: String, // hiking, cleanup, camping, workshop
  difficulty: String, // easy, medium, hard
  status: String, // upcoming, ongoing, completed, cancelled
  duration: String,
  maxParticipants: Number
}
```

### Plan Schema
```javascript
{
  name: String,
  price: Number,
  currency: String,
  period: String, // month, year
  description: String,
  features: [String],
  isPopular: Boolean,
  category: String, // basic, standard, premium, vip
  status: String // active, inactive
}
```

---

## 🎨 Customization

### Colors
Edit `css/style.css`:
```css
:root {
    --primary: #2f7d32;        /* Main color */
    --primary-dark: #1e5f20;   /* Darker shade */
    --primary-light: #4caf50;  /* Lighter shade */
}
```

### Logo
Replace `images/logo.png` with your logo

### Contact Info
Update footer in HTML files

---

## 📦 Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- bcryptjs
- CORS

### Frontend
- HTML5
- CSS3 (Custom + CSS Grid/Flexbox)
- Vanilla JavaScript
- Font Awesome Icons
- Google Fonts (Poppins)
- AOS (Animate on Scroll)

---

## 🚀 Deployment

### Backend (Choose One)
- Heroku
- Railway
- Render
- DigitalOcean
- AWS/Azure

### Frontend (Choose One)
- Netlify (Recommended)
- Vercel
- GitHub Pages
- Firebase Hosting

### Database
- MongoDB Atlas (Free tier available)

---

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS enabled
- ✅ Input validation
- ✅ Admin-only routes protected
- ⚠️ Remember to change default passwords!

---

## 📝 License

This project is created for e_Touring eco-tourism platform.

---

## 🤝 Support

For issues or questions:
1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Check browser console (F12)
3. Check backend terminal for errors

---

## 🎉 Credits

Built with ❤️ for Lebanon's eco-tourism community

**Technologies:**
- Backend: Node.js, Express, MongoDB
- Frontend: HTML, CSS, JavaScript
- Integration: WhatsApp Business API

---

## 📸 Screenshots

### Homepage
Beautiful hero section with featured events

### Admin Dashboard
Full CRUD operations for events and plans

### WhatsApp Booking
Seamless booking via WhatsApp

---

**Ready to start?** Check [QUICK_START.md](QUICK_START.md) for a 5-minute setup guide!
