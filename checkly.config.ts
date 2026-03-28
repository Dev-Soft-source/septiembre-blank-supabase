/**
 * Checkly Configuration for External Synthetic Monitoring
 * Runs tests every 5-10 minutes from multiple regions
 */

import { defineConfig } from 'checkly';

const config = defineConfig({
  projectName: 'Hotel Platform Monitoring',
  logicalId: 'hotel-platform',
  
  // Global settings
  repoUrl: 'https://github.com/your-org/hotel-platform',
  checks: {
    // Run tests every 5 minutes
    frequency: 5,
    
    // Multiple regions for global coverage
    locations: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
    
    // Retry policy
    retryStrategy: {
      type: 'FIXED',
      baseBackoffSeconds: 60,
      maxRetries: 2,
      maxDurationSeconds: 600,
      sameRegion: false
    },
    
    // Environment variables
    environmentVariables: [
      {
        key: 'ENVIRONMENT_URL',
        value: 'https://pgdzrvdwgoomjnnegkcn.supabase.co'
      }
    ],
    
    // Browser check defaults
    browserChecks: {
      frequency: 5,
      testMatch: '**/checkly/**/*.spec.ts',
      
      // Playwright configuration
      playwrightConfig: {
        use: {
          baseURL: process.env.ENVIRONMENT_URL || 'https://pgdzrvdwgoomjnnegkcn.supabase.co',
          viewport: { width: 1280, height: 720 },
          ignoreHTTPSErrors: false,
          video: 'retain-on-failure',
          screenshot: 'only-on-failure',
          trace: 'retain-on-failure'
        }
      }
    }
  },
  
  // CLI configuration
  cli: {
    runLocation: 'eu-west-1',
    privateRunLocation: false
  },
  
  // Alert channels
  alertChannels: [
    {
      id: 'email-alerts',
      type: 'EMAIL' as const,
      config: {
        address: 'alerts@yourcompany.com'
      }
    },
    {
      id: 'slack-alerts', 
      type: 'SLACK' as const,
      config: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/...'
      }
    }
  ],
  
  // Default alert settings
  alertSettings: {
    escalationSettings: {
      runBasedEscalation: {
        failedRunThreshold: 1
      }
    },
    
    // SSL certificate monitoring
    sslCheckSettings: {
      alertThreshold: 7, // Alert 7 days before expiry
      checkCollectionId: 'ssl-checks'
    },
    
    // Response time thresholds
    responseTimeSettings: {
      p95Threshold: 2000, // 2 seconds
      p99Threshold: 5000  // 5 seconds  
    }
  }
});

export default config;