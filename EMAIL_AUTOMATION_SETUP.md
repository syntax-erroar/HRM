# HR Email Automation Setup Guide

This guide will help you set up and test the email automation system for your HR recruitment platform.

## 🎯 What We've Built

### ✅ Completed Features:
1. **Email Service Backend** - Node.js service with Nodemailer
2. **Standard Email Templates** - 7 predefined templates for different scenarios
3. **Frontend Integration** - Enhanced candidate detail modal with email automation
4. **Automated Triggers** - Emails sent automatically when candidate status changes
5. **Custom Email Support** - Send custom emails with variable substitution

### 📧 Available Email Templates:
- **Application Received** - Confirmation when application is received
- **Application Rejected** - Rejection notification
- **Shortlist Notification** - Shortlist notification
- **Interview Invitation** - Interview scheduling
- **Interview Reminder** - Interview reminder
- **Job Offer** - Job offer letter
- **Onboarding Welcome** - Welcome email for new hires

## 🚀 Quick Start

### Step 1: Start the Email Service
```bash
# Option 1: Use the batch file (Windows)
start-email-service.bat

# Option 2: Use PowerShell (Windows)
.\start-email-service.ps1

# Option 3: Manual setup
cd email-service
npm install
npm start
```

### Step 2: Start the HR System
```bash
# In the main project directory
npm run dev
```

### Step 3: Test the Integration
1. Open your HR system in the browser
2. Go to the Candidates page
3. Click on any candidate to open the detail modal
4. Try the new "Email" tab
5. Test sending different types of emails

## 🔧 Configuration

### Email Settings (in `email-service/server.js`):
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'nishit.wadhwani@tristone-partners.com',
    pass: 'gkstrwmpnkzvdlkz'  
  }
});
```

### Frontend Integration (in `lib/email-service.ts`):
```typescript
// Update the base URL if needed
this.baseUrl = process.env.NEXT_PUBLIC_EMAIL_SERVICE_URL || 'http://localhost:3001';
```

## 🧪 Testing

### Test the Email Service:
```bash
cd email-service
node test-email.js
```

### Test from the Frontend:
1. Open candidate detail modal
2. Go to "Email" tab
3. Click "Send Custom Email"
4. Try different templates
5. Check your email inbox

## 📁 File Structure

```
hr-automation-system/
├── email-service/                 # Email automation backend
│   ├── server.js                 # Main email service
│   ├── package.json              # Dependencies
│   ├── test-email.js             # Test script
│   └── README.md                 # Service documentation
├── lib/
│   └── email-service.ts          # Frontend email integration
├── components/
│   ├── enhanced-email-modal.tsx   # Advanced email composer
│   └── candidate-detail-modal.tsx # Updated with email features
└── start-email-service.*         # Startup scripts
```

## 🎨 New Features Added

### 1. Enhanced Candidate Detail Modal
- **New "Email" tab** with quick email actions
- **Automated email triggers** when status changes
- **Custom email composer** with template support
- **Email history tracking** (ready for implementation)

### 2. Email Automation Backend
- **RESTful API** for email operations
- **Template management** with variable substitution
- **Professional HTML templates** with company branding
- **Error handling** and logging

### 3. Frontend Integration
- **Email service utility** for easy integration
- **Toast notifications** for user feedback
- **Loading states** during email sending
- **Template preview** functionality

## 🔄 How It Works

### Email Flow:
1. **User Action** → Candidate status change or manual email
2. **Frontend** → Calls email service API
3. **Backend** → Processes template and variables
4. **SMTP** → Sends email via configured provider
5. **Confirmation** → User gets success/error feedback

### Template Variables:
- `{candidateName}` - Candidate's full name
- `{position}` - Job position
- `{appliedDate}` - Application date
- `{interviewDate}` - Interview date
- `{interviewTime}` - Interview time
- And many more...

## 🚨 Troubleshooting

### Common Issues:

1. **Email service not starting**:
   - Check if port 3001 is available
   - Verify Node.js is installed
   - Run `npm install` in email-service directory

2. **Emails not sending**:
   - Verify SMTP credentials in server.js
   - Check network connectivity
   - Test with a simple email first

3. **Frontend not connecting**:
   - Ensure email service is running on port 3001
   - Check CORS settings
   - Verify API endpoints are accessible

4. **Templates not loading**:
   - Check browser console for errors
   - Verify email service is running
   - Test API endpoints directly

### Debug Commands:
```bash
# Test email service
curl http://localhost:3001/api/templates

# Test email sending
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","templateType":"applicationReceived","variables":{"candidateName":"Test User","position":"Test Position"}}'
```

## 🎉 Next Steps

### Immediate Improvements:
1. **Add email history tracking** to the database
2. **Implement email scheduling** for future sends
3. **Add email templates management** in the admin panel
4. **Create email analytics** dashboard

### Advanced Features:
1. **Email campaign management**
2. **A/B testing for email templates**
3. **Email automation workflows**
4. **Integration with calendar systems**

## 📞 Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all services are running
3. Test individual components separately
4. Check the email service README for detailed documentation

---

**🎯 You now have a fully functional email automation system!** 

The system will automatically send professional emails to candidates based on their status changes, and you can also send custom emails through the enhanced interface.
