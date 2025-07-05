# COVID-19 Global Tracker - Modernized 🦠📊

A modern, responsive COVID-19 dashboard built with React 18, TypeScript, and Tailwind CSS. This project has been completely redesigned with modern architecture patterns and working APIs.

## ✨ Features

- **Real-time COVID-19 Data**: Live statistics with auto-refresh
- **Interactive Maps**: Global and country-specific visualizations using Leaflet
- **Modern Charts**: Beautiful visualizations with Chart.js and Recharts
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Responsive Design**: Mobile-first design that works on all devices
- **TypeScript**: Full type safety and better developer experience
- **Modern Architecture**: Functional components with hooks, Zustand for state management
- **Performance**: Optimized with React Query for data caching and background updates

## 🚀 Modern Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand + React Query
- **Maps**: React Leaflet
- **Charts**: Chart.js + Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite (replaced Create React App)
- **API**: API Ninjas COVID-19 API (working alternative)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd covid19-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API key:
   ```env
   VITE_API_NINJAS_KEY=your_api_key_here
   ```
   
   Get a free API key from: https://api.api-ninjas.com/

4. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser** and visit `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Architecture Improvements

### Old vs New Architecture

| Aspect | Old (v0.1.0) | New (v0.2.0) |
|--------|--------------|--------------|
| React | Class components | Functional components + Hooks |
| State | Component state | Zustand + React Query |
| Styling | Bootstrap + CSS | Tailwind CSS + shadcn/ui |
| Build Tool | Create React App | Vite |
| Language | JavaScript | TypeScript |
| API | Deprecated COVID APIs | Working API Ninjas API |
| UI Components | Material-UI + Ant Design | shadcn/ui (Radix UI + Tailwind) |
| Data Fetching | Axios only | React Query + Axios |
| Maps | Mapbox GL | React Leaflet |

### Key Improvements

1. **Modern React Patterns**:
   - Functional components with hooks
   - Custom hooks for data fetching
   - Context providers for theme management

2. **Better Developer Experience**:
   - TypeScript for type safety
   - Vite for faster development
   - ESLint configuration for code quality

3. **Performance Optimizations**:
   - React Query for intelligent caching
   - Background data refetching
   - Optimistic updates

4. **Enhanced UI/UX**:
   - Modern design with Tailwind CSS
   - Consistent component library
   - Smooth animations and transitions
   - Mobile-responsive design

## 📱 Features

### Dashboard Overview
- Global COVID-19 statistics
- Country-specific data views
- Interactive world map
- Time-series charts
- Dark/light theme toggle

### Data Visualization
- **Stats Cards**: Animated counters for key metrics
- **Interactive Map**: Click countries for detailed view
- **Charts**: Historical trends with Chart.js
- **Country List**: Searchable and sortable country data

### Mobile Experience
- Responsive design
- Touch-friendly interface
- Mobile navigation drawer
- Optimized performance

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Dashboard.tsx   # Main dashboard component
│   └── ThemeProvider.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── services/           # API services
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

## 🌐 API Integration

The app now uses the API Ninjas COVID-19 API, which provides:
- Global statistics
- Country-specific data
- Historical time-series data
- Reliable uptime and response times

### Fallback Strategy
- Mock data for development
- Graceful error handling
- Offline-first approach with cached data

## 🚧 Future Enhancements

The following features are planned for future releases:
- Real-time notifications
- Data export functionality
- Advanced filtering options
- Vaccination data integration
- PWA capabilities

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Note**: This is a modernized version of the original COVID-19 tracker. The APIs have been updated to use working endpoints, and the entire codebase has been rewritten with modern React patterns and TypeScript.
