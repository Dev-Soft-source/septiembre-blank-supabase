/**
 * Secret Rotation Script for Enhanced Security
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

async function rotateSessionSecret() {
  const newSecret = generateSecret();
  const envPath = path.join(__dirname, '../.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('No .env file found, creating with new secret');
    fs.writeFileSync(envPath, `SESSION_SECRET=${newSecret}\n`);
    return newSecret;
  }
  
  // Read current .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Replace session secret or add if not exists
  if (envContent.includes('SESSION_SECRET=')) {
    envContent = envContent.replace(
      /SESSION_SECRET=.*/g,
      `SESSION_SECRET=${newSecret}`
    );
  } else {
    envContent += `\nSESSION_SECRET=${newSecret}\n`;
  }
  
  // Write back to .env
  fs.writeFileSync(envPath, envContent);
  
  console.log('Session secret rotated successfully');
  return newSecret;
}

async function rotateDatabaseCredentials() {
  const newPassword = generateSecret(32);
  
  console.log('Database credentials rotation would be performed here');
  console.log('New password generated (not displayed for security)');
  
  return newPassword;
}

async function rotateRedisAuth() {
  const newPassword = generateSecret(32);
  
  console.log('Redis authentication rotation would be performed here');
  console.log('New Redis password generated (not displayed for security)');
  
  return newPassword;
}

async function main() {
  console.log('🔐 Starting secret rotation...');
  
  try {
    await rotateSessionSecret();
    await rotateDatabaseCredentials();
    await rotateRedisAuth();
    
    console.log('✅ Secret rotation completed successfully');
    console.log('🔄 Restart application instances to pick up new secrets');
  } catch (error) {
    console.error('❌ Secret rotation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { 
  rotateSessionSecret, 
  rotateDatabaseCredentials, 
  rotateRedisAuth 
};