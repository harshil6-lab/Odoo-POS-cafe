import { useEffect, useMemo, useState } from 'react';
import { fetchOrders } from '../services/orderService';
import { supabase } from '../services/supabaseClient';

export function useRealtimeOrders(filters = {}) {
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      setLoading(true);

      try {
        const parsedFilters = JSON.parse(filtersKey);
        const data = await fetchOrders(parsedFilters);

        if (active) {
          setOrders(data);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err.message ?? 'Unable to load orders.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    const channel = supabase
      .channel(`orders-feed-${filtersKey}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          loadOrders();
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [filtersKey, refreshTick]);

  return {
    orders,
    loading,
    error,
    refresh: () => setRefreshTick((value) => value + 1),
  };
}