import { useEffect, useState } from 'react';
import { fetchTables, subscribeToTables } from '../services/orderService';

export function useTablesRealtime() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTables = async () => {
      setLoading(true);

      try {
        const nextTables = await fetchTables();
        setTables(nextTables);
        setError('');
      } catch (err) {
        setError(err.message ?? 'Unable to load tables.');
      } finally {
        setLoading(false);
      }
    };

    loadTables();
    const unsubscribe = subscribeToTables(loadTables);
    return unsubscribe;
  }, []);

  return { tables, loading, error };
}