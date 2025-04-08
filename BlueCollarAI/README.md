# BlueCollar.ai - Mobile Platform for Blue-Collar Workers

BlueCollar.ai is a mobile platform connecting skilled blue-collar workers (plumbers, electricians, carpenters, etc.) with clients seeking their services. This demo is a frontend-focused MVP built with React Native and Expo for investor pitching.

## Project Overview

The app functions as a marketplace for skilled trades, similar to Uber but tailored for blue-collar work:

- **Workers** can create profiles, browse jobs, apply to opportunities, and communicate with clients
- **Clients** can post jobs, browse worker profiles, hire workers, and provide ratings/reviews

## Key Features (Demo)

- Role-based onboarding (Worker/Client) 
- Worker profile creation
- Job posting and browsing
- Map-based job discovery
- Basic matching algorithm visualization
- In-app messaging interface
- Ratings and reviews system

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npx expo start
   ```

3. Open the app in your preferred environment:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan the QR code with Expo Go app on your physical device

## Project Structure

```
BlueCollarAI/
├── assets/             # Images, fonts, and other static files
├── components/         # Reusable UI components
├── screens/            # App screens
├── navigation/         # Navigation configuration
├── api/                # API service and mock data
├── theme.js            # Colors, typography, and styling constants
└── App.js              # Main app entry point
```

## Design System

- **Colors**: Dark Blue (#1A2A44), White (#FFFFFF), Light Blue (#4A90E2), Gray (#A0AEC0), Yellow (#FBBF24)
- **Typography**: Headers (24px), Subheaders (18px), Body (16px), Secondary (14px)

## Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation
- **Maps**: React Native Maps with Expo Location
- **UI Components**: Custom components with Expo Vector Icons
## Development Notes

- This is a V1 demo focused on frontend functionality for investor pitching
- Backend functionality is simulated using mock data
- All UI components follow the design specifications in the technical overview

## Next Steps (Post-Demo)

- Build actual backend services
- Implement real-time messaging
- Develop sophisticated matching algorithm
- Add payment processing system
- Deploy to app stores
