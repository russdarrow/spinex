import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

// Generic type for Supabase table rows
interface BaseRow {
  id: string;
  created_at?: string;
}

/**
 * Hook to fetch data from a Supabase table
 * @param tableName - Name of the Supabase table
 * @param options - Query options (select, filters, etc.)
 */
export function useSupabaseQuery<T extends BaseRow>(
  tableName: string,
  options?: {
    select?: string;
    filter?: { column: string; value: unknown };
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    enabled?: boolean;
  }
) {
  const queryKey = [tableName, options];

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        console.log('[Supabase] Not configured, returning empty array');
        return [] as T[];
      }

      let query = supabase
        .from(tableName)
        .select(options?.select ?? '*');

      if (options?.filter) {
        query = query.eq(options.filter.column, options.filter.value);
      }

      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? false,
        });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[Supabase] Query error:', error);
        throw error;
      }

      return (data ?? []) as unknown as T[];
    },
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook to insert data into a Supabase table
 */
export function useSupabaseInsert<T extends Partial<BaseRow>>(tableName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRow: T) => {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase
        .from(tableName)
        .insert(newRow)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });
}

/**
 * Hook to update data in a Supabase table
 */
export function useSupabaseUpdate<T extends Partial<BaseRow>>(tableName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<T> }) => {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });
}

/**
 * Hook to delete data from a Supabase table
 */
export function useSupabaseDelete(tableName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
      }

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });
}

/**
 * Hook to subscribe to real-time updates from a Supabase table
 * @param tableName - Name of the Supabase table to subscribe to
 * @param callback - Function called when data changes
 */
export function useSupabaseRealtime<T extends BaseRow>(
  tableName: string,
  callback?: (payload: {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
    new: T | null;
    old: T | null;
  }) => void
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.log('[Supabase] Not configured, skipping realtime subscription');
      return;
    }

    const channel: RealtimeChannel = supabase
      .channel(`${tableName}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          console.log(`[Supabase Realtime] ${tableName}:`, payload.eventType);

          // Invalidate queries to refetch fresh data
          queryClient.invalidateQueries({ queryKey: [tableName] });

          // Call custom callback if provided
          if (callback) {
            callback({
              eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
              new: payload.new as T | null,
              old: payload.old as T | null,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, queryClient, callback]);
}

/**
 * Combined hook for fetching data with real-time updates
 */
export function useSupabaseRealtimeQuery<T extends BaseRow>(
  tableName: string,
  options?: {
    select?: string;
    filter?: { column: string; value: unknown };
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    enabled?: boolean;
    onRealtimeEvent?: (payload: {
      eventType: 'INSERT' | 'UPDATE' | 'DELETE';
      new: T | null;
      old: T | null;
    }) => void;
  }
) {
  // Subscribe to real-time updates
  useSupabaseRealtime<T>(tableName, options?.onRealtimeEvent);

  // Return the query
  return useSupabaseQuery<T>(tableName, options);
}
