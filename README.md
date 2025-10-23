# Notes App

A modern, feature-rich note-taking web application built with React. This app provides a comprehensive solution for organizing your thoughts, ideas, and reminders with a beautiful and intuitive interface.

## ✨ Features

### 📝 Note Management
- **Smart Note Types**: Automatically categorizes notes as "Short" (≤200 characters) or "Long" (>200 characters)
- **Rich Text Editor**: Clean, distraction-free writing experience
- **Real-time Character Count**: Track your note length as you type

### 🏷️ Organization
- **Custom Categories**: Create and manage your own categories (Personal, Work, Ideas, etc.)
- **Category Filtering**: Quickly filter notes by category
- **Smart Search**: Search through note titles and content instantly

### ⏰ Reminders
- **Date & Time Reminders**: Set specific reminders for your notes
- **Visual Indicators**: Clear badges show active reminders and overdue items
- **Reminder Management**: Easy to set, modify, or clear reminders

### 📊 Recent Activity
- **Recent Notes Section**: Dedicated view for recently created or modified notes
- **Timeline View**: Organized by "Just now", "Today", "Yesterday", and "This week"
- **Activity Tracking**: See when notes were last updated

### 💾 Data Persistence
- **Local Storage**: All your notes are saved locally in your browser
- **Auto-save**: Changes are automatically saved as you work
- **Data Recovery**: Your notes persist between browser sessions

### 📱 Responsive Design
- **Mobile-Friendly**: Fully responsive design that works on all devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Accessibility**: Keyboard navigation and screen reader friendly

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd notes-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to use the app

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## 🎯 How to Use

### Creating Notes
1. Click the "New Note" button in the header
2. Enter a title and content for your note
3. Select a category from the dropdown
4. Optionally set a reminder date and time
5. Click "Save Note"

### Managing Categories
1. Use the sidebar to view different categories
2. Click "Add Category" to create custom categories
3. Filter notes by selecting any category

### Setting Reminders
1. When creating or editing a note, use the reminder field
2. Select a date and time for your reminder
3. Active reminders show a bell icon
4. Overdue reminders are highlighted in red

### Viewing Recent Activity
1. Click "Recent" in the sidebar
2. See your notes organized by when they were last modified
3. Click any note to open and edit it

### Search and Filter
1. Use the search bar in the header to find notes
2. Filter by note type: All, Short, Long, or Recent
3. Combine search with category filters for precise results

## 🛠️ Technical Details

### Built With
- **React 18**: Modern React with hooks and functional components
- **Lucide React**: Beautiful, customizable icons
- **date-fns**: Powerful date formatting and manipulation
- **CSS3**: Modern styling with flexbox and grid layouts

### Project Structure
```
src/
├── components/          # React components
│   ├── Header.js       # Top navigation and search
│   ├── Sidebar.js      # Category and view filters
│   ├── NotesList.js    # Main notes display
│   ├── NoteEditor.js   # Note creation/editing
│   └── RecentNotes.js  # Recent activity view
├── types.js            # Data models and utilities
├── App.js             # Main application component
└── index.js           # Application entry point
```

### Data Model
Each note contains:
- `id`: Unique identifier
- `title`: Note title
- `content`: Note content
- `category`: Assigned category
- `type`: "short" or "long" (auto-determined)
- `reminder`: Optional reminder date/time
- `createdAt`: Creation timestamp
- `updatedAt`: Last modification timestamp

## 🎨 Customization

### Adding New Categories
The app comes with default categories, but you can easily add more:
1. Use the "Add Category" button in the sidebar
2. Or modify the `DEFAULT_CATEGORIES` array in `src/types.js`

### Styling
- All styles are in component-specific CSS files
- Modify CSS variables for consistent theming
- Responsive breakpoints are already configured

## 🔧 Development

### Available Scripts
- `npm start`: Development server
- `npm run build`: Production build
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App (not recommended)

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

**Enjoy organizing your thoughts with Notes App!** 📝✨