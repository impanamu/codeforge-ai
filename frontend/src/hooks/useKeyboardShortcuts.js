import { useEffect } from 'react';

/**
 * Global keyboard shortcut handler.
 * Pass an array of { keys, handler, description } objects.
 * Keys example: ['ctrl', 'k'], ['escape'], ['ctrl', '/']
 */
export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      for (const shortcut of shortcuts) {
        const keys = shortcut.keys;
        const needsCtrl  = keys.includes('ctrl');
        const needsShift = keys.includes('shift');
        const needsAlt   = keys.includes('alt');
        const mainKey    = keys.find(k => !['ctrl','shift','alt','meta'].includes(k));

        if (
          (needsCtrl  === e.ctrlKey  || needsCtrl  === e.metaKey) &&
          (needsShift === e.shiftKey || !needsShift) &&
          (needsAlt   === e.altKey   || !needsAlt)  &&
          mainKey && e.key.toLowerCase() === mainKey.toLowerCase()
        ) {
          e.preventDefault();
          shortcut.handler(e);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
