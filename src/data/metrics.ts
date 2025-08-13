export interface Metrics {
  users: number;
  servers: number;
  uptime: number;
}

// Default metrics for fallback
export const defaultMetrics: Metrics = {
  users: 0,
  servers: 0,
  uptime: 0,
}; 