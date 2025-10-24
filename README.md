# Notes App

A modern, full-stack note-taking application with user authentication, built with React and Node.js. Organize your thoughts, ideas, and tasks efficiently with a secure, persistent backend.

## Features

### 🔐 User Authentication
- **Secure Registration & Login**: JWT-based authentication system
- **User Profiles**: Manage your personal information and preferences
- **Password Security**: Encrypted password storage with bcrypt
- **Session Management**: Secure token-based sessions

### 📝 Note Management
- **Short & Long Notes**: Automatically categorizes notes based on content length
- **Rich Text Support**: Create detailed notes with proper formatting
- **Smart Organization**: Notes are automatically sorted by last updated time
- **Persistent Storage**: All notes saved securely in MongoDB database

### 🏷️ Categories & Organization  
- **Custom Categories**: Create and manage your own categories (Work, Personal, Ideas, etc.)
- **Category Filtering**: Easily filter notes by category
- **Visual Category System**: Each category has distinct visual styling
- **Category Statistics**: See note counts per category

### ⏰ Reminders & Notifications
- **Set Reminders**: Add time-based reminders to your important notes
- **Visual Indicators**: Clear visual cues for notes with active reminders
- **Overdue Tracking**: Easily identify overdue reminders

### 🔍 Search & Discovery
- **Real-time Search**: Instantly search through note titles and content
- **Recent Notes View**: Quick access to your most recently updated notes
- **Smart Filtering**: Filter by note type (short/long) and categories
- **Advanced Search**: Search with various filters and parameters

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices and tablets
- **Desktop Ready**: Full-featured desktop experience
- **Touch-Friendly**: Intuitive touch interactions on mobile devices

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **CSS3** - Custom styling with responsive design
- **Lucide React** - Beautiful, consistent icons
- **date-fns** - Date formatting and manipulation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data persistence
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and security

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd notes-app
```

2. Install dependencies for both frontend and backend:
```bash
npm run install-all
```

3. Set up environment variables:
   - Copy the `.env` file in the `server` directory
   - Update the MongoDB URI if needed:
```env
MONGODB_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Make sure MongoDB is running on your system

5. Start both frontend and backend servers:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

### Quick Start Script
For convenience, you can use the provided start script:
```bash
chmod +x start.sh
./start.sh
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Notes
- `GET /api/notes` - Get all user notes (with filtering)
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/recent` - Get recent notes
- `GET /api/notes/stats` - Get notes statistics
- `POST /api/notes/bulk-delete` - Delete multiple notes

### Categories
- `GET /api/categories` - Get all user categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Usage

### Getting Started
1. Register for a new account or login with existing credentials
2. Start creating notes immediately after authentication
3. Organize notes with categories and set reminders as needed

### Creating Notes
1. Click the "New Note" button in the header
2. Enter a title and content for your note
3. Select a category or create a new one
4. Optionally set a reminder
5. Click "Save Note" to save your note to the database

### Managing Categories
- Use the sidebar to filter notes by category
- Click "Add Category" to create new categories
- Categories are automatically created when you assign them to notes
- View category statistics in the sidebar

### Setting Reminders
1. When creating or editing a note, click on the reminder field
2. Select a date and time
3. Notes with active reminders will show a bell icon
4. Overdue reminders will be highlighted in red

### Searching Notes
- Use the search bar in the header to find notes
- Search works across note titles and content
- Results are updated in real-time as you type
- Advanced filtering options available

### View Modes
- **All Notes**: Shows all your notes
- **Short Notes**: Shows only short notes (≤200 characters)
- **Long Notes**: Shows only long notes (>200 characters)  
- **Recent**: Shows notes updated in the last 7 days

## Project Structure

```
notes-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js          # Header with search, user menu
│   │   ├── Sidebar.js         # Category navigation and filters
│   │   ├── NotesList.js       # Notes grid/list display
│   │   ├── NoteEditor.js      # Note creation and editing
│   │   ├── RecentNotes.js     # Recent notes view
│   │   └── Auth.js            # Authentication components
│   ├── contexts/
│   │   ├── AuthContext.js     # Authentication state management
│   │   └── NotesContext.js    # Notes state management
│   ├── utils/
│   │   └── api.js             # API service layer
│   ├── App.js                 # Main application component
│   ├── types.js               # Data types and utilities
│   └── index.js               # Application entry point
├── server/
│   ├── models/
│   │   ├── User.js            # User data model
│   │   ├── Note.js            # Note data model
│   │   └── Category.js        # Category data model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── notes.js           # Notes CRUD routes
│   │   └── categories.js      # Categories routes
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── index.js               # Server entry point
│   └── .env                   # Environment variables
├── package.json
└── README.md
```

## Available Scripts

### Frontend & Backend
- `npm run dev` - Runs both frontend and backend in development mode
- `npm run install-all` - Installs dependencies for both frontend and backend

### Frontend Only
- `npm start` - Runs the React app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner

### Backend Only
- `npm run server` - Runs the backend server with nodemon

## Environment Variables

### Server (.env)
```env
MONGODB_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured CORS for secure cross-origin requests
- **Error Handling**: Comprehensive error handling and logging

## Database Schema

### User Model
- username, email, password (hashed)
- firstName, lastName, avatar
- preferences (theme, defaultCategory)
- timestamps

### Note Model
- title, content, category, type (short/long)
- priority, reminder, isCompleted, tags
- user reference, timestamps

### Category Model
- name, color, icon
- user reference, timestamps

## Browser Support

This application supports all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- Date formatting by [date-fns](https://date-fns.org/)
- Built with [Create React App](https://create-react-app.dev/)
- Backend powered by [Express.js](https://expressjs.com/)
- Database by [MongoDB](https://www.mongodb.com/)