import { useEffect, useCallback } from 'react';

interface UseKeyboardOptions {
  onSpaceDown?: () => void;
  onSpaceUp?: () => void;
  onEscape?: () => void;
  onDelete?: () => void;
  onDigit1?: () => void;
  onDigit2?: () => void;
  enabled?: boolean;
}

export function useKeyboard(options: UseKeyboardOptions) {
  const {
    onSpaceDown,
    onSpaceUp,
    onEscape,
    onDelete,
    onDigit1,
    onDigit2,
    enabled = true,
  } = options;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;
    
    // Ignore if typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        if (!e.repeat) {
          onSpaceDown?.();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onEscape?.();
        break;
      case 'Delete':
      case 'Backspace':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          onDelete?.();
        }
        break;
      case 'Digit1':
      case 'Numpad1':
        if (!e.ctrlKey && !e.metaKey) {
          onDigit1?.();
        }
        break;
      case 'Digit2':
      case 'Numpad2':
        if (!e.ctrlKey && !e.metaKey) {
          onDigit2?.();
        }
        break;
    }
  }, [enabled, onSpaceDown, onEscape, onDelete, onDigit1, onDigit2]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;
    
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (e.code === 'Space') {
      e.preventDefault();
      onSpaceUp?.();
    }
  }, [enabled, onSpaceUp]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
}
