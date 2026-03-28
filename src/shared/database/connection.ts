/**
 * Enhanced Database Connection Pool for Scaling to 3,000 Concurrent Users
 */
import { Pool } from 'pg';

// Enhanced connection pooling configuration
const pool = new Pool({
  user: process.env.DB_USER || 'hotel_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hotel_living',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
  
  // Enhanced connection pooling for high scale
  max: process.env.NODE_ENV === 'production' ? 100 : 20, // Scale based on environment
  min: process.env.NODE_ENV === 'production' ? 20 : 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxUses: 7500,
  
  // Enable SSL in production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  
  // Additional optimizations
  application_name: 'hotel-living-app',
  statement_timeout: 30000,
  query_timeout: 30000,
});

// Connection health monitoring
pool.on('connect', (client) => {
  console.log(`Database client connected. Pool connections: ${pool.totalCount}`);
});

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

pool.on('remove', () => {
  console.log('Database client removed from pool');
});

export default pool;
export { pool };