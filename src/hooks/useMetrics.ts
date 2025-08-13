import { useState, useEffect } from 'react';
import { Metrics, defaultMetrics } from '@/data/metrics';

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<Metrics>(defaultMetrics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: Replace with actual API endpoint
        // For now, simulate API call with realistic data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockMetrics: Metrics = {
          users: 52430,
          servers: 1247,
          uptime: 99.8,
        };
        
        setMetrics(mockMetrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
        // Fallback to default metrics on error
        setMetrics(defaultMetrics);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
}; 