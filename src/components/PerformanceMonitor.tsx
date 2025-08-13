import React, { useEffect, useRef } from 'react';

interface PerformanceMonitorProps {
  loading: boolean;
  dataLength: number;
  label: string;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  loading, 
  dataLength, 
  label 
}) => {
  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading && startTimeRef.current === null) {
      startTimeRef.current = performance.now();
      console.log(`🚀 ${label} loading started at ${new Date().toISOString()}`);
    } else if (!loading && startTimeRef.current !== null) {
      endTimeRef.current = performance.now();
      const duration = endTimeRef.current - startTimeRef.current;
      console.log(`✅ ${label} loading completed in ${duration.toFixed(2)}ms`, { 
        dataLength,
        duration: `${duration.toFixed(2)}ms`
      });
      
      // Reset for next load
      startTimeRef.current = null;
      endTimeRef.current = null;
    }
  }, [loading, dataLength, label]);

  // Only render in development
  if (import.meta.env.PROD) {
    return null;
  }

  return null; // This component only logs, doesn't render anything
}; 