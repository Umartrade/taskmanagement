# Task Management System

A comprehensive full-stack task management application built with React (TypeScript), Express.js, MongoDB, and JWT authentication. Features role-based access control, task assignment, real-time notifications, and a leaderboard system.

## 🚀 Features

### Core Functionality
- **JWT-based Authentication** - Secure user registration and login
- **Role-based Access Control** - Regular users and administrators with different permissions
- **Task Management** - Full CRUD operations for tasks with status, priority, and due dates
- **Task Assignment** - Assign tasks to other users with notifications
- **Image Upload** - Attach images to tasks
- **Advanced Filtering & Sorting** - Filter by status, priority, due date, and search functionality
- **Leaderboard System** - Rank users based on completed tasks and completion rate

### User Experience
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Real-time Notifications** - Get notified about task assignments and updates
- **Dashboard Analytics** - Comprehensive overview of task statistics
- **Modern UI/UX** - Clean, professional interface with smooth animations

### Technical Features
- **RESTful API** - Well-structured backend with proper error handling
- **Data Validation** - Input validation on both client and server
- **File Upload Support** - Image attachment functionality
- **Comprehensive Testing** - Unit tests for core functionality
- **API Documentation** - Swagger/OpenAPI documentation

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Axios** for API calls
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Joi** for data validation
- **Helmet** for security
- **CORS** for cross-origin requests

### Development & Testing
- **Vite** for fast development
- **ESLint** for code linting
- **Jest** & **Supertest** for testing
- **Swagger** for API documentation
- **Nodemon** for development server

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-management-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/taskmanagement

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Client
CLIENT_URL=http://localhost:5173
```

### 4. Start the Development Server
```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run server:dev  # Backend only
npm run client:dev  # Frontend only
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

## 📚 API Documentation

The API is fully documented using Swagger/OpenAPI. Once the server is running, visit:
```
http://localhost:5000/api-docs
```

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

#### Tasks
- `GET /api/tasks` - Get tasks with filtering and pagination
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/stats` - Get task statistics

#### Users
- `GET /api/users/leaderboard` - Get user leaderboard
- `GET /api/users/notifications` - Get user notifications
- `POST /api/users/notifications/:id/read` - Mark notification as read

## 🏗️ Project Structure

```
├── server/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── repository/      # Data access layer
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── index.js         # Server entry point
│   └── tests/               # Backend tests
├── src/
│   ├── components/          # React components
│   ├── contexts/            # React contexts
│   ├── api/                 # API service functions
│   ├── types/               # TypeScript type definitions
│   └── App.tsx              # Main App component
├── package.json
└── README.md
```

## 🧪 Testing

Run the test suite:
```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
```

### Test Coverage
The project includes comprehensive tests for:
- Authentication endpoints
- Task CRUD operations
- User management
- API validation
- Error handling

## 🔐 Authentication & Authorization

### User Roles
- **Regular Users**: Can create and manage their own tasks, view assigned tasks
- **Administrators**: Can view and manage all tasks, access user management features

### Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Request rate limiting
- CORS protection
- Input validation and sanitization
- Helmet.js security headers

## 📱 Features in Detail

### Task Management
- Create tasks with title, description, priority, due date, and image
- Update task status (To Do → In Progress → Completed)
- Assign tasks to other users
- Filter and sort tasks by various criteria
- Mark tasks as completed and track completion time

### Notification System
- Real-time notifications for task assignments
- Status update notifications
- Overdue task alerts
- Mark notifications as read/unread

### Leaderboard
- Ranks users by completed tasks
- Considers completion rate for better ranking
- Updates in real-time as tasks are completed

### Dashboard Analytics
- Overview of task statistics
- Personal performance metrics
- Recent task activity
- Quick action buttons

## 🔧 Configuration

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: Token expiration time
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `CLIENT_URL`: Frontend URL for CORS

### File Upload Configuration
For production deployment, configure cloud storage:
- AWS S3
- Cloudinary
- Google Cloud Storage

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use a cloud MongoDB service
2. Configure environment variables for production
3. Deploy to services like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to services like Netlify, Vercel, or AWS S3

### Environment-specific Configuration
Ensure proper environment variables are set for:
- Database connection
- JWT secrets
- File upload services
- Email services (for notifications)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 Design Decisions

### Architecture
- **Layered Architecture**: Separated concerns with repository, service, and controller layers
- **RESTful API Design**: Following REST principles for consistent API structure
- **Component-based Frontend**: Modular React components for maintainability

### Database Design
- **User-centric Design**: Tasks are linked to users for proper access control
- **Notification System**: Separate collection for scalable notification management
- **Indexing Strategy**: Optimized queries with proper database indexes

### State Management
- **Context API**: Used for global state management (auth, tasks, notifications)
- **Local State**: Component-level state for UI interactions
- **Error Handling**: Centralized error handling across the application

## 🐛 Known Issues & Limitations

1. **File Storage**: Currently using in-memory storage for demo purposes
2. **Real-time Updates**: No WebSocket implementation for real-time task updates
3. **Email Notifications**: Mocked email service (would need integration in production)
4. **Image Optimization**: No image resizing/optimization implemented

## 🔮 Future Enhancements

- [ ] Real-time collaboration with WebSockets
- [ ] Advanced task dependencies and subtasks
- [ ] Time tracking and reporting
- [ ] Calendar integration
- [ ] Mobile app development
- [ ] Advanced analytics and insights
- [ ] Team workspaces and project management
- [ ] Third-party integrations (Slack, Teams, etc.)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api-docs`
- Review the test files for usage examples

---

Built with ❤️ using modern web technologies for efficient task management.