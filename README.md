# Beautiful Todo Application

A modern, responsive Todo application built with React, Express.js, and MongoDB. Features beautiful gradient styling, offline functionality, and real-time synchronization.

## ✨ Features

- **Beautiful UI**: Gradient styling with smooth animations
- **Offline Support**: Works offline with localStorage fallback
- **Real-time Sync**: Automatic synchronization when online
- **CRUD Operations**: Create, read, update, and delete todos
- **Statistics**: Track completion progress with visual indicators
- **Responsive Design**: Works on all device sizes
- **MVC Architecture**: Clean separation of concerns

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DockerTest_Todo
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/todoapp
   PORT=5000
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using a local installation:
   ```bash
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

8. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application.

## 🏗️ Project Structure

```
DockerTest_Todo/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── todoController.js    # Business logic
│   ├── middleware/
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   └── Todo.js              # MongoDB schema
│   ├── routes/
│   │   └── todoRoutes.js        # API routes
│   ├── index.js                 # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── TodoHeader.jsx
│   │   │   ├── TodoInput.jsx
│   │   │   ├── TodoItem.jsx
│   │   │   ├── TodoList.jsx
│   │   │   ├── TodoStats.jsx
│   │   │   └── ErrorAlert.jsx
│   │   ├── hooks/
│   │   │   └── useTodos.js      # Custom React hook
│   │   ├── services/
│   │   │   ├── api.js           # API service
│   │   │   └── localStorage.js  # Local storage service
│   │   ├── App.jsx              # Main app component
│   │   ├── index.css            # Global styles
│   │   └── main.jsx             # App entry point
│   └── package.json
└── README.md
```

## 🎨 Design Features

### Visual Elements
- **Gradient Headers**: Blue to purple gradient for the main heading
- **Animated Borders**: Snake-like gradient borders around input fields
- **Floating Animations**: Subtle animations for interactive elements
- **Progress Indicators**: Visual progress bars and completion statistics
- **Responsive Cards**: Beautiful card-based layout for todos

### User Experience
- **Offline-First**: Works without internet connection
- **Real-time Feedback**: Immediate visual feedback for all actions
- **Error Handling**: Graceful error messages and recovery
- **Loading States**: Smooth loading indicators
- **Keyboard Shortcuts**: Enter to save, Escape to cancel

## 🔧 API Endpoints

### Todos
- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get todo by ID
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `PATCH /api/todos/:id/toggle` - Toggle completion
- `DELETE /api/todos/:id` - Delete todo
- `DELETE /api/todos/completed` - Delete all completed todos

### Statistics
- `GET /api/todos/stats` - Get todo statistics

## 💾 Data Storage

### Database (MongoDB)
- **Primary Storage**: All todos are stored in MongoDB
- **Schema**: Includes text, completion status, and timestamps
- **Validation**: Server-side validation for data integrity

### Local Storage
- **Offline Fallback**: Stores todos locally when offline
- **Sync**: Automatically syncs with database when online
- **Persistence**: Maintains data across browser sessions

## 🎯 Usage

1. **Add Todo**: Type in the input field and click the add button
2. **Complete Todo**: Click the checkmark on the right side
3. **Edit Todo**: Click the edit icon to modify text
4. **Delete Todo**: Click the delete icon to remove
5. **View Stats**: See completion statistics at the bottom
6. **Offline Mode**: App works offline with localStorage

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Start Vite development server
```

### Building for Production
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## 🔒 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/todoapp
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file

2. **CORS Errors**
   - Verify CORS_ORIGIN in backend .env
   - Ensure frontend URL matches

3. **Port Conflicts**
   - Change PORT in backend .env if 5000 is occupied
   - Update CORS_ORIGIN accordingly

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 🎉 Features Showcase

- ✅ Beautiful gradient styling
- ✅ Snake-like animated borders
- ✅ Floating checkmark animations
- ✅ Real-time statistics
- ✅ Offline functionality
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Smooth animations
- ✅ MVC architecture
