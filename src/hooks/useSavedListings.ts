import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SavedEntry {
  id: string;
  property_id: string;
}

/**
 * Fetches ALL saved property IDs for the current user in a single query,
 * then provides an optimistic toggle function.
 * Replaces per-PropertyCard N+1 queries (1 auth + 1 saved_listings per card).
 */
export function useSavedListings() {
  const { user } = useAuth();
  const [savedMap, setSavedMap] = useState<Map<string, string>>(new Map()); // property_id → saved_listing_id
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setSavedMap(new Map());
      setLoaded(true);
      return;
    }

    const fetchSaved = async () => {
      try {
        const { data, error } = await supabase
          .from('saved_listings')
          .select('id, property_id')
          .eq('user_id', user.id);

        if (error) throw error;

        const map = new Map<string, string>();
        for (const entry of (data as SavedEntry[]) || []) {
          map.set(entry.property_id, entry.id);
        }
        setSavedMap(map);
      } catch (err) {
        console.error('Error fetching saved listings:', err);
      } finally {
        setLoaded(true);
      }
    };

    fetchSaved();
  }, [user]);

  const toggle = useCallback(async (propertyId: string) => {
    if (!user) {
      toast.error('Sign in to save properties');
      return;
    }

    const existingId = savedMap.get(propertyId);

    if (existingId) {
      // Optimistic remove
      setSavedMap((prev) => {
        const next = new Map(prev);
        next.delete(propertyId);
        return next;
      });

      try {
        const { error } = await supabase
          .from('saved_listings')
          .delete()
          .eq('id', existingId);
        if (error) throw error;
        toast.success('Property removed from saved');
      } catch (err) {
        // Rollback
        setSavedMap((prev) => new Map(prev).set(propertyId, existingId));
        console.error('Error removing saved property:', err);
        toast.error('Failed to remove property');
      }
    } else {
      // Optimistic add (temporary id)
      const tempId = `temp-${Date.now()}`;
      setSavedMap((prev) => new Map(prev).set(propertyId, tempId));

      try {
        const { data, error } = await supabase
          .from('saved_listings')
          .insert({ property_id: propertyId, user_id: user.id })
          .select('id')
          .single();

        if (error) throw error;

        // Replace temp ID with real ID
        setSavedMap((prev) => {
          const next = new Map(prev);
          next.set(propertyId, data.id);
          return next;
        });
        toast.success('Property saved');
      } catch (err) {
        // Rollback
        setSavedMap((prev) => {
          const next = new Map(prev);
          next.delete(propertyId);
          return next;
        });
        console.error('Error saving property:', err);
        toast.error('Failed to save property');
      }
    }
  }, [user, savedMap]);

  const isSaved = useCallback((propertyId: string) => savedMap.has(propertyId), [savedMap]);

  return { isSaved, toggle, loaded };
}
