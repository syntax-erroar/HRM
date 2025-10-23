const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up HR Email Automation Service...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.log('❌ package.json not found. Please run this script from the email-service directory.');
  process.exit(1);
}

try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n✅ Dependencies installed successfully!');
  console.log('\n📧 Email service setup complete!');
  console.log('\n🚀 To start the email service:');
  console.log('   npm start');
  console.log('\n🔧 For development with auto-reload:');
  console.log('   npm run dev');
  console.log('\n📝 Make sure to update the email credentials in server.js');
  console.log('   - Update SMTP settings');
  console.log('   - Update sender email and password');
  
} catch (error) {
  console.error('❌ Error during setup:', error.message);
  process.exit(1);
}
