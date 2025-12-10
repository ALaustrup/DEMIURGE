import { useState } from 'react';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { useAbyssID } from '../../hooks/useAbyssID';
import { backgroundMusicService } from '../../services/backgroundMusic';

interface AbyssIDLoginFormProps {
  onSignupClick: () => void;
}

export function AbyssIDLoginForm({ onSignupClick }: AbyssIDLoginFormProps) {
  const [username, setUsername] = useState('');
  const [secret, setSecret] = useState('');
  const [useSecret, setUseSecret] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAbyssID();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (useSecret) {
      if (!secret.trim()) {
        setError('Please enter your secret code');
        return;
      }
    } else {
      if (!username.trim()) {
        setError('Please enter your username');
        return;
      }
    }

    setIsLoading(true);
    try {
      // Use unified AbyssID login - this will automatically initialize identity service
      if (useSecret) {
        await login(undefined, secret.trim());
      } else {
        await login(username.trim());
      }
      // Start background music after successful login
      backgroundMusicService.play();
      // Login success - identity service will handle wallet sync, etc.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 w-full max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-abyss-cyan">AbyssID Login</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useSecret}
              onChange={(e) => setUseSecret(e.target.checked)}
              className="w-4 h-4 text-abyss-cyan bg-abyss-dark border-abyss-cyan rounded focus:ring-abyss-cyan"
            />
            <span className="text-sm text-gray-300">Login with secret code</span>
          </label>
        </div>

        {useSecret ? (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Secret Code
            </label>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full px-4 py-2 bg-abyss-dark border border-abyss-cyan/30 rounded-lg text-white focus:outline-none focus:border-abyss-cyan focus:ring-2 focus:ring-abyss-cyan/50 font-mono text-sm"
              placeholder="Enter your secret code"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-400 mt-1">Use the secret code you saved during signup</p>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-abyss-dark border border-abyss-cyan/30 rounded-lg text-white focus:outline-none focus:border-abyss-cyan focus:ring-2 focus:ring-abyss-cyan/50"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>
        )}


        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSignupClick}
          className="text-abyss-cyan hover:text-abyss-cyan/80 underline text-sm"
        >
          Get an AbyssID
        </button>
      </div>
    </Card>
  );
}

