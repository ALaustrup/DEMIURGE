import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from './state/authStore';
import { AbyssIDProvider } from './context/AbyssIDContext';
import { ThemeProvider } from './context/ThemeContext';
import { BlockListenerProvider } from './context/BlockListenerContext';
import { IntroVideo } from './components/IntroVideo';
import { LoginScreen } from './routes/LoginScreen';
import { Desktop } from './routes/Desktop';
import { WalletInitializer } from './components/WalletInitializer';
import { migrateOldDemiNFTData } from './services/abyssid/drc369';
import './styles/globals.css';

type Screen = 'intro' | 'login' | 'desktop';

function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [showIntro, setShowIntro] = useState(true);
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Migrate old DemiNFT data to DRC-369 on app startup
    try {
      migrateOldDemiNFTData();
    } catch (error) {
      console.error('Migration error:', error);
    }
    
    // Initialize auth only once
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      initialize().catch((error) => {
        console.error('Initialization error:', error);
        // Continue even if initialization fails
      });
    }
  }, [initialize]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    // After intro video, show login/signup (or desktop if already authenticated)
    if (isAuthenticated) {
      setScreen('desktop');
    } else {
      setScreen('login');
    }
  };

  const handleLogin = () => {
    setScreen('desktop');
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-abyss-dark flex items-center justify-center">
        <div className="text-abyss-cyan">Loading...</div>
      </div>
    );
  }

  // Show intro video first (unless already authenticated and intro was skipped)
  if (showIntro && screen === 'intro') {
    return (
      <ThemeProvider>
        <AbyssIDProvider>
          <IntroVideo onComplete={handleIntroComplete} />
        </AbyssIDProvider>
      </ThemeProvider>
    );
  }

  // Show login/signup screen after intro (or if already authenticated, skip to desktop)
  if (screen === 'login' || (!isAuthenticated && !showIntro)) {
    return (
      <ThemeProvider>
        <AbyssIDProvider>
          <LoginScreen onLogin={handleLogin} />
        </AbyssIDProvider>
      </ThemeProvider>
    );
  }

  // Show desktop for authenticated users
  return (
    <ThemeProvider>
      <AbyssIDProvider>
        <BlockListenerProvider>
          <WalletInitializer />
          <Desktop />
        </BlockListenerProvider>
      </AbyssIDProvider>
    </ThemeProvider>
  );
}

export default App;
