# Sarathi 🏍️

A modern ride-hailing mobile application built with React Native and Expo. Sarathi connects riders with drivers for convenient, on-demand transportation.

![Expo](https://img.shields.io/badge/Expo-54.0.0-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.76-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🔐 **Authentication** - Secure user authentication with Clerk
- 🗺️ **Real-time Maps** - Interactive maps with Google Maps (Android) and Apple Maps (iOS)
- 📍 **Location Services** - GPS-based location tracking and route planning
- 🚗 **Ride Booking** - Browse available drivers and book rides
- 💳 **Payment Integration** - Seamless payment processing
- 📱 **Cross-platform** - Works on both Android and iOS
- 🎨 **Modern UI** - Beautiful, responsive design with NativeWind (Tailwind CSS)

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev) (SDK 54)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Authentication**: [Clerk](https://clerk.com)
- **Database**: [Neon](https://neon.tech) (PostgreSQL)
- **Maps**: expo-maps (Google Maps / Apple Maps)
- **Styling**: [NativeWind](https://www.nativewind.dev) (Tailwind CSS)
- **State Management**: Zustand
- **Location**: expo-location
- **Build**: EAS Build

## 📋 Prerequisites

Before you begin, ensure you have:

- [Node.js](https://nodejs.org) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/eas/) (for builds)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/sarathi.git
cd sarathi
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for authentication |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `EXPO_PUBLIC_GEOAPIFY_API_KEY` | Geoapify API key for geocoding |
| `EXPO_PUBLIC_GOOGLE_API_KEY` | Google Maps API key |
| `EXPO_PUBLIC_SERVER_URL` | Backend server URL (for production builds) |

### 4. Configure Google Maps (Android)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps SDK for Android
3. Create an API key and add it to `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    }
  }
}
```

### 5. Start the development server

```bash
npm run dev
# or
npx expo start
```

### 6. Run on device/emulator

```bash
# Android
npm run android
# or
npx expo run:android

# iOS (macOS only)
npm run ios
# or
npx expo run:ios
```

## 📁 Project Structure

```
sarathi/
├── app/                    # App screens (file-based routing)
│   ├── (api)/              # API routes
│   │   ├── driver+api.ts   # Driver endpoints
│   │   ├── user+api.ts     # User endpoints
│   │   └── ride/           # Ride endpoints
│   ├── (auth)/             # Authentication screens
│   │   ├── signin.tsx
│   │   ├── signup.tsx
│   │   └── welcome.tsx
│   ├── (root)/             # Main app screens
│   │   ├── (tabs)/         # Tab navigation
│   │   │   ├── home.tsx
│   │   │   ├── rides.tsx
│   │   │   ├── chat.tsx
│   │   │   └── profile.tsx
│   │   ├── book_ride.tsx
│   │   ├── find_ride.tsx
│   │   └── active_ride.tsx
│   └── _layout.tsx         # Root layout
├── components/             # Reusable components
│   ├── Maps.tsx            # Map component
│   ├── RideCard.tsx        # Ride card component
│   ├── DriverCard.tsx      # Driver card component
│   └── ...
├── constants/              # App constants and assets
├── lib/                    # Utility functions
├── store/                  # Zustand state management
├── types/                  # TypeScript type definitions
└── assets/                 # Images, fonts, icons
```

## 🏗️ Building for Production

### Using EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS (first time only)
eas build:configure

# Build for Android (APK for testing)
eas build --platform android --profile preview

# Build for Android (AAB for Play Store)
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

### Environment Variables for EAS

Set your environment variables in the [Expo dashboard](https://expo.dev):

1. Go to your project settings
2. Navigate to "Environment variables"
3. Add all required variables from `.env.example`

## 📝 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/(api)/driver` | GET | Get all available drivers |
| `/(api)/user` | POST | Create new user |
| `/(api)/ride/create` | POST | Create a new ride |
| `/(api)/ride/[id]` | GET | Get rides for a user |
| `/(api)/ride/complete-ride` | POST | Complete an active ride |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev) for the amazing framework
- [Clerk](https://clerk.com) for authentication
- [Neon](https://neon.tech) for serverless PostgreSQL
- [NativeWind](https://www.nativewind.dev) for Tailwind CSS support

---

Made with ❤️ using Expo
