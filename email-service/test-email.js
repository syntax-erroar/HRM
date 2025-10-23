const fetch = require('node-fetch');

const EMAIL_SERVICE_URL = 'http://localhost:3001';

async function testEmailService() {
  console.log('🧪 Testing HR Email Automation Service...\n');

  try {
    // Test 1: Get available templates
    console.log('1️⃣ Testing template list...');
    const templatesResponse = await fetch(`${EMAIL_SERVICE_URL}/api/templates`);
    const templates = await templatesResponse.json();
    
    if (templates.success) {
      console.log('✅ Templates loaded successfully');
      console.log(`📧 Available templates: ${templates.templates.length}`);
      templates.templates.forEach(template => {
        console.log(`   - ${template.name} (${template.type})`);
      });
    } else {
      console.log('❌ Failed to load templates');
    }

    // Test 2: Preview a template
    console.log('\n2️⃣ Testing template preview...');
    const previewResponse = await fetch(`${EMAIL_SERVICE_URL}/api/preview-template`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateType: 'applicationReceived',
        variables: {
          candidateName: 'John Doe',
          position: 'Software Developer',
          appliedDate: new Date().toLocaleDateString(),
          applicationId: 'APP-12345'
        }
      })
    });
    
    const preview = await previewResponse.json();
    if (preview.success) {
      console.log('✅ Template preview successful');
      console.log(`📝 Subject: ${preview.subject}`);
      console.log(`📄 Message preview: ${preview.message.substring(0, 100)}...`);
    } else {
      console.log('❌ Template preview failed');
    }

    // Test 3: Send test email (commented out to avoid sending real emails)
    console.log('\n3️⃣ Testing email sending (DRY RUN)...');
    console.log('⚠️  Skipping actual email send to avoid spam');
    console.log('💡 To test actual email sending, uncomment the code below');
    
    /*
    const emailResponse = await fetch(`${EMAIL_SERVICE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'test@example.com',
        templateType: 'applicationReceived',
        variables: {
          candidateName: 'Test User',
          position: 'Test Position',
          appliedDate: new Date().toLocaleDateString(),
          applicationId: 'APP-TEST'
        }
      })
    });
    
    const emailResult = await emailResponse.json();
    if (emailResult.success) {
      console.log('✅ Test email sent successfully');
      console.log(`📧 Message ID: ${emailResult.messageId}`);
    } else {
      console.log('❌ Test email failed');
      console.log(`Error: ${emailResult.error}`);
    }
    */

    console.log('\n🎉 Email service test completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start the email service: npm start');
    console.log('   2. Start the HR system frontend');
    console.log('   3. Test email sending from the candidate detail modal');
    console.log('   4. Verify emails are received in the configured email account');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Make sure the email service is running:');
    console.log('   cd email-service && npm start');
  }
}

// Run the test
testEmailService();
