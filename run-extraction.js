// Run the extraction script directly
const { updateTranslations } = require('./scripts/user-dashboard-texts.js');

console.log('🚀 Running User Dashboard translation extraction...');
updateTranslations();
console.log('✅ Extraction complete!');