# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"지금내려" (NowDrop) is a React Native mobile app built with Expo that provides Seoul public transit notifications. The app alerts users one station before their destination and supports iOS, Android, and Web platforms.

## Development Commands

**Start the development server:**
```bash
npm start
```

**Platform-specific commands:**
```bash
npm run ios       # Run on iOS simulator
npm run android   # Run on Android emulator
npm run web       # Run in web browser
```

## Architecture

### Navigation Flow
The app uses React Navigation with a stack navigator defined in `App.js`:
- **Index** → Main search screen with departure/destination input
- **Routes** → Lists available transit routes with timing and transfer information
- **Map** → Shows route visualization with real-time tracking and notification toggle

Navigation parameters are passed between screens:
- Index → Routes: `{ from, to }`
- Routes → Map: `{ from, to, route }`

### State Management
- **@tanstack/react-query** (QueryClient) is configured in `App.js` for data fetching (though not currently used)
- Local component state with React hooks for UI interactions
- Navigation state managed by React Navigation

### UI Component System
Reusable UI components in `src/components/ui/`:
- **Button**: Supports variants (`default`, `outline`, `ghost`, `gradient`) and sizes (`default`, `lg`, `icon`)
- **Card**: Consistent container with elevation and border styling
- **Icon**: Wrapper for @expo/vector-icons with family support (MaterialIcons, etc.)
- **Header**: Reusable page header with back button and right component support
- **Input**: Styled text input component

All components use React Native StyleSheet for styling with consistent color palette:
- Primary: `#3b82f6` (blue)
- Secondary: `#f59e0b` (orange)
- Text: `#374151`, `#6b7280`, `#9ca3af`
- Background: `#f9fafb`, `#ffffff`

### Project Structure
```
src/
├── components/ui/    # Reusable UI components
├── pages/           # Screen components (Index, Routes, Map)
└── lib/             # Utility functions
```

### Key Design Patterns
- Gradient backgrounds using `expo-linear-gradient` for visual appeal
- SafeAreaView for proper mobile device spacing
- ScrollView with `showsVerticalScrollIndicator={false}` for clean scrolling
- TouchableOpacity for all interactive elements
- Consistent spacing and elevation system across all cards

### Expo Configuration
The app uses Expo SDK 54 with:
- New Architecture enabled (`newArchEnabled: true`)
- Edge-to-edge enabled on Android
- Custom splash screens and icons per platform
- Support for tablets on iOS

### Current Limitations
- Route data is currently mock/hardcoded in `src/pages/Routes.js`
- Map visualization is a placeholder gradient with mock route line
- No actual geolocation or transit API integration yet
- TanStack Query is set up but not actively used for data fetching
