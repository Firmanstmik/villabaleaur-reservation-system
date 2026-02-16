import { useEffect, useRef, useState } from 'react';

const DRAFT_STORAGE_KEY = 'listing_draft';
const SAVE_DEBOUNCE_MS = 2000;

interface UseListingDraftReturn {
  savedAgo: string;
  saveDraft: (data: any) => void;
  loadDraft: () => any | null;
  clearDraft: () => void;
}

export function useListingDraft(): UseListingDraftReturn {
  const [savedAgo, setSavedAgo] = useState<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTimeRef = useRef<number | null>(null);

  // Update "Saved X seconds ago" label
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSaveTimeRef.current) {
        const secondsAgo = Math.floor((Date.now() - lastSaveTimeRef.current) / 1000);
        if (secondsAgo < 60) {
          setSavedAgo(`Saved ${secondsAgo}s ago`);
        } else if (secondsAgo < 3600) {
          const minutesAgo = Math.floor(secondsAgo / 60);
          setSavedAgo(`Saved ${minutesAgo}m ago`);
        } else {
          setSavedAgo('Saved');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const saveDraft = (data: any) => {
    // Clear pending timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new debounced timeout
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
        lastSaveTimeRef.current = Date.now();
        setSavedAgo('Saved now');
      } catch (err) {
        console.error('Failed to save draft:', err);
      }
    }, SAVE_DEBOUNCE_MS);
  };

  const loadDraft = (): any | null => {
    try {
      const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
      return draft ? JSON.parse(draft) : null;
    } catch (err) {
      console.error('Failed to load draft:', err);
      return null;
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setSavedAgo('');
      lastSaveTimeRef.current = null;
    } catch (err) {
      console.error('Failed to clear draft:', err);
    }
  };

  return { savedAgo, saveDraft, loadDraft, clearDraft };
}
