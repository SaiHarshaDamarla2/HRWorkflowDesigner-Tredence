import { useEffect } from 'react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { useStore } from 'zustand';

export const useKeyboardShortcuts = () => {
  const { undo, redo } = useStore(useWorkflowStore.temporal, (state) => state);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        undo();
      }
      if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.shiftKey && event.key === 'Z'))) {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);
};