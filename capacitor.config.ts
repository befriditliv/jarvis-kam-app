import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f52455190e8848adbf4a7e1dd87cd97f',
  appName: 'intellect-reach',
  webDir: 'dist',
  server: {
    url: 'https://f5245519-0e88-48ad-bf4a-7e1dd87cd97f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;