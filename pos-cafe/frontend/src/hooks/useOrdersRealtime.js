import { useEffect, useState } from 'react';
import { fetchOrders, subscribeToOrders } from '../services/orderService';

export function useOrdersRealtime() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);

      try {
        const nextOrders = await fetchOrders();
        setOrders(nextOrders);
        setError('');
      } catch (err) {
        setError(err.message ?? 'Unable to load orders.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
    const unsubscribe = subscribeToOrders(loadOrders);
    return unsubscribe;
  }, []);

  return { orders, loading, error };
}