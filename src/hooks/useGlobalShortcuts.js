import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useGlobalShortcuts = (setActiveTab) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) && e.key !== 'Escape') {
        // Special case: Alt+G should still focus search even if in another input? 
        // User didn't specify, but usually shortcuts are disabled in inputs.
        // Let's stick to the rule.
        return;
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
