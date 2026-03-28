/**
 * Performance Benchmark Script for Scaling Validation
 */
const http = require('http');

async function runBenchmark(concurrent, duration = 60) {
  console.log(`\n🚀 Running benchmark: ${concurrent} concurrent users for ${duration}s`);
  
  const results = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    errorRate: 0
  };

  const promises = [];
  const startTime = Date.now();
  
  for (let i = 0; i < concurrent; i++) {
    promises.push(simulateUser(duration * 1000, results));
  }
  
  await Promise.all(promises);
  
  const endTime = Date.now();
  const actualDuration = (endTime - startTime) / 1000;
  
  results.errorRate = (results.failedRequests / results.totalRequests) * 100;
  
  console.log(`📊 Results for ${concurrent} concurrent users:`);
  console.log(`   Total requests: ${results.totalRequests}`);
  console.log(`   Successful: ${results.successfulRequests}`);
  console.log(`   Failed: ${results.failedRequests}`);
  console.log(`   Error rate: ${results.errorRate.toFixed(2)}%`);
  console.log(`   Avg response time: ${results.averageResponseTime.toFixed(2)}ms`);
  console.log(`   RPS: ${(results.totalRequests / actualDuration).toFixed(2)}`);
  
  return results;
}

async function simulateUser(duration, results) {
  const endTime = Date.now() + duration;
  
  while (Date.now() < endTime) {
    const start = Date.now();
    
    try {
      await makeRequest();
      results.successfulRequests++;
      const responseTime = Date.now() - start;
      results.averageResponseTime = (results.averageResponseTime + responseTime) / 2;
    } catch (error) {
      results.failedRequests++;
    }
    
    results.totalRequests++;
    
    // Random delay between requests (100-500ms)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 100));
  }
}

function makeRequest() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/health',
      method: 'GET'
    }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve();
      } else {
        reject(new Error(`HTTP ${res.statusCode}`));
      }
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Timeout')));
    req.end();
  });
}

// Run benchmark for different user loads
async function main() {
  console.log('🎯 Hotel Living Scaling Benchmark\n');
  
  await runBenchmark(1000);  // 1,000 concurrent users
  await runBenchmark(2000);  // 2,000 concurrent users  
  await runBenchmark(3000);  // 3,000 concurrent users
  
  console.log('\n✅ Benchmark completed');
}

if (require.main === module) {
  main().catch(console.error);
}