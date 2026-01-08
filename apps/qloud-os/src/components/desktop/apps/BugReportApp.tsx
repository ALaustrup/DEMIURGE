/**
 * Bug Report App - QLOUD OS
 * 
 * Simple bug reporting interface for users to submit issues directly from the OS.
 */

import { useState } from 'react';
import { Window } from '../Window';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

interface BugReportAppProps {
  id: string;
  onClose: () => void;
}

export function BugReportApp({ id, onClose }: BugReportAppProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('bug');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      // Submit to GitHub Issues API or backend endpoint
      const bugReport = {
        title: `[${category.toUpperCase()}] ${title}`,
        description,
        category,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        platform: 'QLOUD OS',
        url: window.location.href
      };

      // For now, log to console and show success
      // In production, this would POST to your bug tracking system
      console.log('Bug Report:', bugReport);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setCategory('bug');
        setStatus('idle');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to submit bug report:', error);
      setStatus('error');
      setErrorMessage('Failed to submit report. Please try again.');
    }
  };

  return (
    <Window
      id={id}
      title="Bug Reporter"
      icon="🐛"
      onClose={onClose}
      defaultSize={{ width: 600, height: 700 }}
      defaultPosition={{ x: 100, y: 100 }}
    >
      <div className="flex flex-col h-full bg-genesis-void-black text-genesis-text-primary p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-genesis-flame-orange to-genesis-cipher-cyan bg-clip-text text-transparent">
            Report a Bug
          </h2>
          <p className="text-genesis-text-secondary text-sm">
            Help us improve QLOUD OS by reporting issues you encounter.
          </p>
        </div>

        {/* Success Message */}
        {status === 'success' && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-green-400 font-semibold">Report submitted successfully!</p>
              <p className="text-green-300 text-sm">Thank you for helping us improve.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-400">{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-genesis-text-secondary">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-genesis-glass-light border border-genesis-border-default rounded-lg text-genesis-text-primary focus:outline-none focus:ring-2 focus:ring-genesis-cipher-cyan"
              disabled={status === 'submitting'}
            >
              <option value="bug">🐛 Bug</option>
              <option value="feature">✨ Feature Request</option>
              <option value="ui">🎨 UI/UX Issue</option>
              <option value="performance">⚡ Performance</option>
              <option value="crash">💥 Crash</option>
              <option value="other">📝 Other</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-genesis-text-secondary">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the issue"
              className="w-full px-4 py-2 bg-genesis-glass-light border border-genesis-border-default rounded-lg text-genesis-text-primary placeholder-genesis-text-tertiary focus:outline-none focus:ring-2 focus:ring-genesis-cipher-cyan"
              disabled={status === 'submitting'}
              required
            />
          </div>

          {/* Description */}
          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-genesis-text-secondary">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the issue...&#10;&#10;Steps to reproduce:&#10;1. ...&#10;2. ...&#10;&#10;Expected behavior:&#10;&#10;Actual behavior:"
              className="flex-1 px-4 py-2 bg-genesis-glass-light border border-genesis-border-default rounded-lg text-genesis-text-primary placeholder-genesis-text-tertiary focus:outline-none focus:ring-2 focus:ring-genesis-cipher-cyan resize-none"
              disabled={status === 'submitting'}
              required
            />
          </div>

          {/* System Info */}
          <div className="p-3 bg-genesis-glass-light border border-genesis-border-default rounded-lg">
            <p className="text-xs text-genesis-text-tertiary mb-1">System Information (included automatically):</p>
            <p className="text-xs text-genesis-text-secondary font-mono">
              Platform: QLOUD OS • Browser: {navigator.userAgent.split(' ').slice(-2).join(' ')}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'submitting' || !title.trim() || !description.trim()}
            className="w-full py-3 bg-gradient-to-r from-genesis-flame-orange to-genesis-cipher-cyan text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'submitting' ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Submit Report
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-genesis-border-default">
          <p className="text-xs text-genesis-text-tertiary text-center">
            Your report helps us build a better QLOUD OS. Thank you! 🙏
          </p>
        </div>
      </div>
    </Window>
  );
}
