# e_Touring Backend API

Backend server for the e_Touring eco-tourism platform.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend folder:

```bash
cp .env.example .env
```

Then edit `.env` and add your settings:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/e_touring
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/e_touring

# Server Port
PORT=5000

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-key-here

# WhatsApp Number
WHATSAPP_ADMIN_NUMBER=96170000000
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
- Go to https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Add it to `.env` file

### 4. Run the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start at: `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```

### Events (Public)
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event

### Events (Admin - Requires Auth Token)
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Plans (Public)
- `GET /api/plans` - Get all plans
- `GET /api/plans/:id` - Get single plan

### Plans (Admin - Requires Auth Token)
- `POST /api/plans` - Create plan
- `PUT /api/plans/:id` - Update plan
- `DELETE /api/plans/:id` - Delete plan

## Testing the API

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Events
```bash
curl http://localhost:5000/api/events
```

## Admin Authentication

All admin routes require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

Get the token by logging in via `/api/auth/admin/login`

## Database Models

### Event Schema
- title (String, required)
- date (String, required)
- price (String, required)
- participants (String, required)
- image (String, required)
- description (String, required)
- category (String: hiking, cleanup, camping, workshop, other)
- location (String, required)
- duration (String)
- difficulty (String: easy, medium, hard)
- status (String: upcoming, ongoing, completed, cancelled)
- maxParticipants (Number)

### Plan Schema
- name (String, required)
- price (Number, required)
- currency (String, default: '$')
- period (String, default: 'month')
- description (String, required)
- features (Array of Strings)
- isPopular (Boolean)
- maxEvents (Number)
- discountPercentage (Number)
- category (String: basic, standard, premium, vip)
- status (String: active, inactive)

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running (`mongod`)
- Check MONGODB_URI in `.env`
- For Atlas, whitelist your IP address

### Port Already in Use
Change PORT in `.env` file to another port (e.g., 5001)

### Module Not Found
Run `npm install` in the backend folder

## Security Notes

⚠️ **Important for Production:**
1. Change `ADMIN_PASSWORD` to a strong password
2. Change `JWT_SECRET` to a random string
3. Use environment variables, never commit `.env` file
4. Enable HTTPS in production
5. Add rate limiting for login attempts
