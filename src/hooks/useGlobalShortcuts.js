import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useGlobalShortcuts = (setActiveTab) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in an input, UNLESS it's Escape or Alt+C
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        if (e.key !== 'Escape' && !(e.altKey && e.key.toLowerCase() === 'c')) {
          return;
        }
      }

      // Functional Keys (F1 - F10)
      const fKeys = {
        'F1': 'COMPANY',
        'F2': 'LEDGER',
        'F3': 'STOCK',
        'F4': 'CONTRA',
        'F5': 'PAYMENT',
        'F6': 'RECEIPT',
        'F7': 'JOURNAL',
        'F8': 'SALES',
        'F9': 'PURCHASE',
        'F10': 'BANKING'
      };

      if (fKeys[e.key]) {
        e.preventDefault();
        setActiveTab(fKeys[e.key]);
      }

      // Alt Shortcuts
      if (e.altKey) {
        const key = e.key.toLowerCase();
        const altShortcuts = {
          'd': 'DAYBOOK',
          'v': 'VERIFICATION',
          't': 'GST',
          'p': 'PL',
          'b': 'BS',
          'r': 'EXPORT',
          'k': 'BACKUP',
          'i': 'IMPORT',
          'g': 'SEARCH'
        };

        if (altShortcuts[key]) {
          e.preventDefault();
          if (altShortcuts[key] === 'SEARCH') {
            const searchInput = document.getElementById('global-search');
            if (searchInput) searchInput.focus();
          } else {
            setActiveTab(altShortcuts[key]);
          }
        }
      }

      // Escape key to go back to Dashboard
      if (e.key === 'Escape') {
        setActiveTab('DASHBOARD');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab, navigate]);
};

export default useGlobalShortcuts;
