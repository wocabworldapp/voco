import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.voco.languagelearning',
  appName: 'VoCo',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Enable live reload for development
    url: process.env.NODE_ENV === 'development' ? 'http://192.168.2.19:3002' : undefined,
    cleartext: true
  },
  plugins: {
    // Enable device features for web testing
    CapacitorHttp: {
      enabled: true
    },
    Device: {
      enabled: true
    }
  }
};

export default config;
