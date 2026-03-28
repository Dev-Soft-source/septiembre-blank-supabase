/**
 * Read Replica Manager for Database Load Distribution
 */
import { Pool } from 'pg';

class ReadReplicaManager {
  private replicas: Pool[] = [];
  private currentReplicaIndex = 0;

  constructor() {
    // Initialize read replicas in production
    if (process.env.NODE_ENV === 'production') {
      // Replica 1
      if (process.env.DB_REPLICA_1_HOST) {
        this.replicas.push(new Pool({
          user: process.env.DB_USER,
          host: process.env.DB_REPLICA_1_HOST,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD,
          port: parseInt(process.env.DB_REPLICA_1_PORT || '5433'),
          max: 50,
          ssl: { rejectUnauthorized: false }
        }));
      }

      // Replica 2  
      if (process.env.DB_REPLICA_2_HOST) {
        this.replicas.push(new Pool({
          user: process.env.DB_USER,
          host: process.env.DB_REPLICA_2_HOST,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD,
          port: parseInt(process.env.DB_REPLICA_2_PORT || '5434'),
          max: 50,
          ssl: { rejectUnauthorized: false }
        }));
      }
    }

    console.log(`Read replica manager initialized with ${this.replicas.length} replicas`);
  }

  getReplica(): Pool {
    if (this.replicas.length === 0) {
      // Fallback to primary if no replicas configured
      return require('./connection').default;
    }

    // Round-robin selection for load distribution
    const replica = this.replicas[this.currentReplicaIndex];
    this.currentReplicaIndex = (this.currentReplicaIndex + 1) % this.replicas.length;
    return replica;
  }

  async healthCheck(): Promise<{ healthy: boolean; replicaCount: number; errors: string[] }> {
    const errors: string[] = [];
    let healthyReplicas = 0;

    for (let i = 0; i < this.replicas.length; i++) {
      try {
        await this.replicas[i].query('SELECT 1');
        healthyReplicas++;
      } catch (error) {
        errors.push(`Replica ${i + 1}: ${error.message}`);
      }
    }

    return {
      healthy: healthyReplicas > 0,
      replicaCount: healthyReplicas,
      errors
    };
  }
}

export default new ReadReplicaManager();