# Fleek Timer Application

A modern, professional timer application built with React Router v7 for tracking time across projects and tasks. Features a beautiful glassmorphism UI design with comprehensive timer management capabilities.

## ✨ Features

### 🕐 Timer Management
- **Create Timers**: Set up timers for specific projects and tasks
- **Full Control**: Start, stop, pause, and resume timers with precision
- **Real-time Updates**: Live timer display with HH:MM:SS format
- **Session Tracking**: Automatic logging of completed timer sessions

### 📊 Project Organization
- **Project & Task Management**: Organize timers by projects and tasks
- **Searchable Dropdowns**: Find and create projects/tasks with search functionality
- **Favorites**: Mark important timers as favorites with star icons

### 📋 Timesheet & Analytics
- **Timer Details**: Dedicated detail pages for each timer
- **Tabbed Interface**: Switch between "Details" and "Timesheets" views
- **Completed Sessions**: View all completed timing sessions with descriptions
- **Session History**: Track start times, durations, and session details

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful translucent UI with backdrop blur effects
- **Light/Dark Themes**: Full theme support with system preference detection
- **Custom Icon Library**: Professional icon set (play, pause, stop, edit, etc.)
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Empty States**: Helpful guidance when no timers exist

### 💾 Data Persistence
- **Local Storage**: All data persists locally in the browser
- **Real-time Sync**: Timer states synchronized across browser tabs
- **Session Recovery**: Resume timers after browser restart

## 🛠️ Technologies

### Core Framework
- **React Router v7**: Latest routing and SSR framework
- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast build tool and development server

### Styling & Design
- **Tailwind CSS v4**: Latest utility-first CSS framework
- **Custom Theme System**: Comprehensive design tokens via `@theme` directive
- **Google Fonts**: Inter and Roboto font integration
- **Glassmorphism**: Modern UI design pattern implementation

### Development & Deployment
- **Docker**: Containerized deployment ready
- **Hot Module Replacement**: Fast development experience
- **Type Checking**: Continuous TypeScript validation

## 🏗️ Architecture

### Component Structure
```
app/
├── components/
│   ├── icons/              # Reusable icon components
│   │   ├── PlayIcon.tsx
│   │   ├── PauseIcon.tsx
│   │   ├── StopIcon.tsx
│   │   ├── PencilIcon.tsx
│   │   └── ...
│   ├── timer/              # Timer-specific components
│   │   ├── TimerCard.tsx
│   │   ├── TimerControlButton.tsx
│   │   ├── TimerDisplay.tsx
│   │   └── ...
│   ├── forms/              # Form components
│   │   ├── Button.tsx
│   │   ├── Dropdown.tsx
│   │   └── TextField.tsx
│   └── layout/             # Layout components
│       ├── Header.tsx
│       ├── BackButton.tsx
│       └── ...
├── hooks/                  # Custom React hooks
│   ├── useTimer.ts
│   ├── useTimerDisplay.ts
│   ├── useTheme.ts
│   └── useCreateTimerForm.ts
├── utils/                  # Utility functions
│   ├── timer/              # Timer-specific utilities
│   ├── storage/            # Local storage management
│   └── dateTime.ts         # Date/time formatting
├── context/                # React contexts
│   ├── TimerContext.tsx    # Timer state management
│   └── ThemeContext.tsx    # Theme management
└── routes/                 # Application pages
    ├── timers.tsx          # Timer list (home)
    ├── create-timer.tsx    # Create new timer
    └── details.tsx         # Timer details/timesheets
```

### Key Components

#### Timer Components
- **TimerCard**: Individual timer display with controls
- **TimerControlButton**: Play/pause/resume button logic
- **StartButton**, **StopButton**, **PlayPauseButton**: Modular control buttons
- **TimerDisplay**: Real-time timer display with formatting
- **CompletedSessions**: Session history display
- **CompletedSessionCard**: Individual session cards

#### Form & UI Components
- **Button**: Reusable button with multiple variants (primary, secondary, ghost)
- **Dropdown**: Searchable dropdown with create-new functionality
- **TextField**: Styled input fields with validation
- **Header**: Flexible page header with configurable elements
- **ThemeToggle**: Light/dark theme switcher

#### Utility Components
- **EmptyTimersState**: Welcome screen when no timers exist
- **TabNavigation**: Tab interface for timer details
- **SessionDescription**: Expandable description with edit functionality

### Custom Hooks
- **useTimer**: Timer context access and actions
- **useTimerDisplay**: Real-time timer display with formatting
- **useTheme**: Theme management and switching
- **useCreateTimerForm**: Form state management for timer creation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fleek

# Install dependencies
npm install
```

### Development

```bash
# Start development server with HMR
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Other Commands

```bash
# Type checking
npm run typecheck

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Usage Guide

### Creating Your First Timer
1. Navigate to the home page (`/`)
2. Click "Get Started" or the "+" button to create a timer
3. Fill in project, task, and description information
4. Submit to create (timer is created in stopped state)

### Managing Timers
- **Start**: Click the play button to begin timing
- **Pause**: Click pause to temporarily stop (preserves elapsed time)
- **Resume**: Click play again to continue from where you paused
- **Stop**: Click stop to end the session (creates completed session record)

### Viewing Timer Details
1. Click on any timer card to view details
2. Switch between "Details" and "Timesheets" tabs
3. View completed sessions, edit descriptions, and manage timer information

### Theme Switching
- Use the theme toggle in the header to switch between light/dark modes
- System preference is automatically detected on first visit

## 🐳 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t fleek-timer .

# Run container
docker run -p 3000:3000 fleek-timer
```

### Supported Platforms
- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway
- Vercel
- Netlify

### Environment Setup
The application runs entirely client-side with local storage, so no additional environment variables or database setup is required.

## 🎨 Design System

### Theme Colors
- **Primary**: Blue color palette (customizable)
- **Surface**: Glassmorphism backgrounds with transparency
- **Text**: Adaptive colors for light/dark themes
- **Borders**: Subtle borders with opacity

### Typography
- **Display**: Large headings and prominent text
- **Headline**: Section headers and important text
- **Body**: Regular content and descriptions
- **Label**: Form labels and secondary text

### Component Variants
- **Buttons**: Primary, secondary, tertiary, and ghost variants
- **Surfaces**: Various transparency levels for glassmorphism effect
- **Icons**: Consistent stroke-based design system

## 🧪 Testing

The application is built with modular, testable components:
- Pure utility functions for easy unit testing
- Isolated component logic
- Custom hooks for stateful logic testing
- TypeScript for compile-time error catching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using React Router v7, React 19, and modern web technologies.
