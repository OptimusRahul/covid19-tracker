import { useEffect } from 'react';

interface KeyboardShortcuts {
  onSearch?: () => void;
  onToggleTheme?: () => void;
  onShowComparison?: () => void;
  onHelp?: () => void;
  onExportData?: () => void;
}

export function useKeyboardShortcuts({
  onSearch,
  onToggleTheme,
  onShowComparison,
  onHelp,
  onExportData,
}: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Check for Ctrl/Cmd key combinations
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      switch (event.key) {
        case '/':
          event.preventDefault();
          onSearch?.();
          break;
        case 't':
          if (isCtrlOrCmd) {
            event.preventDefault();
            onToggleTheme?.();
          }
          break;
        case 'c':
          if (isCtrlOrCmd) {
            event.preventDefault();
            onShowComparison?.();
          }
          break;
        case 'e':
          if (isCtrlOrCmd) {
            event.preventDefault();
            onExportData?.();
          }
          break;
        case '?':
          event.preventDefault();
          onHelp?.();
          break;
        case 'Escape': {
          // Close any open modals or dropdowns
          const escEvent = new CustomEvent('escape-pressed');
          document.dispatchEvent(escEvent);
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSearch, onToggleTheme, onShowComparison, onHelp, onExportData]);

  const shortcuts = [
    { key: '/', description: 'Focus search' },
    { key: 'Ctrl+T', description: 'Toggle theme' },
    { key: 'Ctrl+C', description: 'Compare countries' },
    { key: 'Ctrl+E', description: 'Export data' },
    { key: '?', description: 'Show this help' },
    { key: 'Esc', description: 'Close modals' },
  ];

  return { shortcuts };
} 