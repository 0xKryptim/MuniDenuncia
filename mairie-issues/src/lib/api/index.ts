import type { DataAdapter } from './adapter';
import { mockAdapter } from './mockAdapter';
import { supabaseAdapter } from './supabaseAdapter';

const adapterType = (import.meta.env.VITE_DATA_ADAPTER || 'mock') as 'mock' | 'supabase';

export const api: DataAdapter = adapterType === 'supabase' ? supabaseAdapter : mockAdapter;

export const isRealtimeEnabled = import.meta.env.VITE_REALTIME === 'true' && adapterType === 'supabase';
