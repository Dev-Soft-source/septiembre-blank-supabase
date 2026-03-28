
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting text extraction...');

try {
  // Run i18next-scanner
  execSync('npx i18next-scanner --config i18next-scanner.config.js', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Text extraction completed successfully!');
  
  // Auto-update user dashboard translations
  console.log('📝 Auto-updating user dashboard translations...');
  const userDashboardTexts = require('./user-dashboard-texts.js');
  userDashboardTexts.updateTranslations();
  console.log('✅ User dashboard translations updated!');
  
  // Check if extraction file was created
  const extractedFilePath = path.join(__dirname, '../src/i18n/locales/en.json');
  if (fs.existsSync(extractedFilePath)) {
    const stats = fs.statSync(extractedFilePath);
    console.log(`📄 Extracted file size: ${stats.size} bytes`);
    
    const content = JSON.parse(fs.readFileSync(extractedFilePath, 'utf8'));
    const keyCount = Object.keys(content).length;
    console.log(`🔑 Total translation keys extracted: ${keyCount}`);
  }
  
} catch (error) {
  console.error('❌ Error during text extraction:', error.message);
  process.exit(1);
}
