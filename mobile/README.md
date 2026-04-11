# DriveWell - DOT Physical Readiness for Truck Drivers

A mobile application designed specifically for truck drivers to maintain health metrics required for DOT physical exams through fitness tracking, workouts, and location-based discovery.

## 🚛 Target Users
- Long-haul and regional truck drivers  
- CDL holders
- Independent owner-operators and fleet drivers

## 🎯 Core Features

### 1. Workout System
- **In-truck workouts** - exercises you can do in your driver's seat
- **Beside-truck workouts** - parking lot exercises using minimal equipment  
- **Gym workouts** - full routines for when gym access is available
- **Smart filtering** by time (5, 10, 20, 45 min), space, and DOT health goals
- **Equipment-minimal** focus on bodyweight and resistance bands

### 2. Location Discovery  
- **GPS-powered** map and list views
- **Truck stops** with parking and amenities
- **Truck-accessible gyms** with day pass info and parking notes
- **DOT physical centers** with hours and walk-in availability
- **Offline caching** for areas with poor signal

### 3. DOT Readiness Dashboard
- **Health metric tracking** (weight, blood pressure, waist, heart rate)
- **Visual status indicator** (Green/Yellow/Red DOT readiness)  
- **Countdown timer** to next required DOT physical
- **Risk factor alerts** and recommendations

### 4. Offline Support
- **Cached workouts** work without internet
- **Saved locations** accessible offline
- **Graceful degradation** when GPS/data unavailable

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with hooks and functional components
- **Vite** for fast development and building
- **React Router** for navigation
- **Lucide React** for consistent iconography
- **CSS-in-JS** with responsive design

### Mobile Deployment  
- **Capacitor** for iOS and Android builds
- **Native plugins** ready for GPS, notifications, storage
- **App Store** and Google Play deployment ready

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx       # App shell with navigation
│   └── BottomNav.jsx    # Mobile-first tab navigation
├── screens/             # Main application screens  
│   ├── Dashboard.jsx    # Home screen with DOT status
│   ├── Workouts.jsx     # Filterable workout library
│   ├── Locations.jsx    # GPS-based location finder
│   ├── Profile.jsx      # Health metrics tracking
│   └── Settings.jsx     # App preferences & upgrade
├── data/
│   └── mockData.js      # MVP data models & calculations
├── App.jsx              # Root component with routing
└── main.jsx             # React app entry point
```

## 🚀 Getting Started

### Development Setup
```bash
# Install dependencies
npm install

# Start development server  
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Mobile Development
```bash
# Add iOS platform (requires Xcode)
npx cap add ios

# Add Android platform (requires Android Studio)  
npx cap add android

# Build and sync to mobile platforms
npm run build
npx cap sync

# Open in native IDEs
npx cap open ios
npx cap open android
```

## 💰 Monetization Strategy

### Freemium Model
- **Free Tier**: 2 workouts, basic location search, limited features
- **Premium ($9.99/month)**: Full workout library, DOT reminders, personalized plans, priority support

### Premium Features (Structure Ready)
- Complete workout library (20+ routines)
- Automated DOT physical reminders  
- Personalized workout recommendations
- Advanced health trend analysis
- Priority customer support

## 🔧 API Integration TODOs

The MVP uses mock data with clear integration points for:

- **🗺️ Maps & Places API** (Google Maps/Mapbox)
- **📍 GPS/Geolocation** services  
- **🔔 Push Notifications** system
- **👤 User Authentication** & profiles
- **💳 Payment Processing** (Stripe/similar)
- **☁️ Backend API** for data sync

All integration points marked with `TODO:` comments in code.

## 📱 Screen Flow

```
Dashboard (/) 
├─ DOT status overview
├─ Quick workout suggestion  
├─ Health metrics summary
└─ Quick actions (Find Gyms, Track Health)

Workouts (/workouts)
├─ Filter by time/space/DOT goal
├─ Free vs Premium workout access  
└─ Exercise details & start workout

Locations (/locations)  
├─ List/Map view toggle
├─ Filter by type (Gyms, DOT Centers, Truck Stops)
├─ Distance & navigation
└─ Truck parking notes

Profile (/profile)
├─ DOT readiness calculation
├─ Editable health metrics
├─ DOT physical date tracking  
└─ Risk factor alerts

Settings (/settings)
├─ Premium upgrade (free users)
├─ Notification preferences
├─ Privacy & terms
└─ Help & support
```

## 🎨 Design Principles

- **Mobile-first** responsive design
- **Offline-capable** core functionality  
- **High-contrast** for visibility in trucks
- **Large touch targets** for gloved hands
- **Minimal data usage** for limited plans
- **Battery efficient** for long-haul drivers

## 🔒 Privacy & Compliance

- **HIPAA-ready** health data handling
- **Location privacy** controls
- **Minimal data collection** philosophy  
- **Transparent privacy policy**

---

**Built for the road. Built for drivers.**