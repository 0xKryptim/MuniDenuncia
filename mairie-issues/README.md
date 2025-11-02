# Mairie Issues - City Hall Issue Reporting Portal

A modern, production-ready web application for residents to report municipal issues to their city hall (Mairie). Built with React, TypeScript, and a focus on exceptional UX and accessibility.

## Features

- **Report Problems** - Residents can easily report municipal issues with photos and precise location data
- **Track Requests** - View all submitted requests with status tracking and real-time updates
- **Chat with City Hall** - Direct messaging system for each report
- **Location Services** - Auto-detect location or manually pin issues on an interactive map
- **Photo Upload** - Drag-and-drop photo attachment with preview
- **Dark Mode** - Full light/dark theme support
- **Responsive Design** - Perfect experience on mobile, tablet, and desktop
- **Accessibility** - WCAG 2.1 compliant with keyboard navigation and screen reader support

## Tech Stack

### Core
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality accessible components

### State & Data
- **TanStack React Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** + **Zod** - Form validation

### Features
- **React Leaflet** - Interactive maps with OpenStreetMap
- **Framer Motion** - Smooth animations
- **Sonner** - Toast notifications
- **Lucide React** - Beautiful icons

### Data Layer
- **Adapter Pattern** - Pluggable data backends
  - Mock adapter for local development
  - Supabase adapter for production (auth, database, storage, realtime)

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- npm 9+

### Installation

```bash
# Navigate to project directory
cd mairie-issues

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Default Login (Mock Mode)

```
Email: user@example.com
Password: password123
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Data Adapter: 'mock' or 'supabase'
VITE_DATA_ADAPTER=mock

# Enable realtime features (only works with supabase adapter)
VITE_REALTIME=false

# Supabase Configuration (only needed if VITE_DATA_ADAPTER=supabase)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Data Adapters

The app uses an adapter pattern to support multiple data backends. Switch between them using the `VITE_DATA_ADAPTER` environment variable.

### Mock Adapter (Development)

Perfect for local development - no backend needed.

- In-memory data storage
- Simulates API delays
- Pre-configured test user
- Photo uploads use local object URLs

```env
VITE_DATA_ADAPTER=mock
```

### Supabase Adapter (Production)

Full-featured backend with authentication, database, storage, and realtime subscriptions.

```env
VITE_DATA_ADAPTER=supabase
VITE_REALTIME=true
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the following SQL to create tables:

```sql
-- Users table (Supabase Auth handles this)

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  photo_url TEXT NOT NULL,
  location JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'city')),
  text TEXT NOT NULL,
  system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Reports policies
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages for own reports"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reports
      WHERE reports.id = messages.report_id
      AND reports.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages for own reports"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reports
      WHERE reports.id = messages.report_id
      AND reports.user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_messages_report_id ON messages(report_id);
```

3. Create a storage bucket:
   - Go to Storage in Supabase dashboard
   - Create a new public bucket named `report-photos`
   - Set appropriate access policies

4. Enable realtime (optional):
   - Go to Database > Replication in Supabase dashboard
   - Enable realtime for the `messages` table

5. Update your `.env` with Supabase credentials

## Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Building
npm run build        # Build for production
npm run preview      # Preview production build locally

# Testing
npm test            # Run tests in watch mode
npm run test:ui     # Run tests with interactive UI

# Code Quality
npm run lint        # Run ESLint
```

## Project Structure

```
mairie-issues/
├── src/
│   ├── app/                    # Page components
│   │   ├── dashboard.tsx       # Home page
│   │   ├── login.tsx           # Login page
│   │   ├── report.tsx          # Report problem form
│   │   ├── account.tsx         # User account
│   │   ├── settings.tsx        # App settings
│   │   └── requests/           # Request pages
│   │       ├── index.tsx       # Requests list
│   │       └── [id].tsx        # Request detail
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Layout components (Sidebar, Topbar)
│   │   ├── forms/              # Form components
│   │   ├── reports/            # Report-related components
│   │   ├── chat/               # Chat components
│   │   ├── map/                # Map components (LocationPicker)
│   │   └── upload/             # Upload components (PhotoDropzone)
│   ├── lib/
│   │   ├── api/                # Data adapters
│   │   │   ├── adapter.ts      # Adapter interface
│   │   │   ├── mockAdapter.ts  # Mock implementation
│   │   │   ├── supabaseAdapter.ts # Supabase implementation
│   │   │   └── index.ts        # Adapter selector
│   │   ├── types.ts            # TypeScript types
│   │   ├── validation.ts       # Zod schemas
│   │   ├── geocode.ts          # Geocoding utilities
│   │   └── utils.ts            # Utility functions
│   ├── store/
│   │   ├── authStore.ts        # Auth state (Zustand)
│   │   └── themeStore.ts       # Theme state (Zustand)
│   ├── hooks/
│   │   └── useAuth.ts          # Auth hook
│   ├── test/                   # Test setup and utilities
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── .env                        # Environment variables
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── vitest.config.ts            # Test configuration
```

## Accessibility Features

This application is built with accessibility as a core principle:

- **Keyboard Navigation** - All interactive elements are keyboard accessible
- **Screen Reader Support** - Proper ARIA labels and semantic HTML
- **Focus Management** - Clear focus indicators and logical tab order
- **Color Contrast** - WCAG AA compliant contrast ratios
- **Form Validation** - Clear error messages announced to screen readers
- **Dark Mode** - Reduced eye strain option

## Design Decisions

### Civic Aesthetic
- Neutral color palette (slate, indigo) conveys trustworthiness
- High contrast for readability
- Generous spacing and clear hierarchy
- Professional yet approachable tone

### Mobile-First Approach
- Designed primarily for mobile phones (primary use case)
- Progressive enhancement for larger screens
- Touch-friendly targets (minimum 44x44px)
- Optimized for slow connections

### User Experience
- **Minimal Friction** - Report an issue in under 2 minutes
- **Smart Defaults** - Auto-detect location when permitted
- **Progressive Disclosure** - Show complexity only when needed
- **Optimistic UI** - Immediate feedback, reconcile with server later
- **Forgiving Forms** - Clear validation, helpful error messages

### Performance
- Code splitting by route
- Lazy loading images
- Optimized bundle size
- Efficient re-renders with React Query

## Testing

The project includes comprehensive tests covering critical paths:

```bash
npm test           # Run all tests
npm run test:ui    # Interactive test UI
```

### Test Coverage

- **Validation** - Form validation rules and error messages
- **Components** - UI component rendering and behavior
- **State Management** - Auth store and theme store logic

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security

### Implemented Safeguards

- XSS prevention through React's automatic escaping
- File upload validation (type and size)
- Explicit geolocation consent required
- Row-level security in Supabase
- Protected routes requiring authentication
- Input sanitization and validation

## License

MIT License

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the component system
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons
- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- [Nominatim](https://nominatim.org/) for geocoding

---

Built with React + TypeScript + Vite
