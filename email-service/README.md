# HR Email Automation Service

This service provides automated email functionality for the HR recruitment system using Node.js and Nodemailer.

## Features

- **Predefined Email Templates**: Application received, rejection, shortlist, interview invitation, job offer, and onboarding emails
- **Custom Email Support**: Send custom emails with variable substitution
- **Template Preview**: Preview emails with test data before sending
- **Professional HTML Templates**: Beautiful, responsive email templates
- **Variable Substitution**: Dynamic content replacement in templates

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Email Settings**:
   - Update SMTP credentials in `server.js`
   - Modify sender email and password
   - Configure SMTP host and port

3. **Start the Service**:
   ```bash
   npm start
   ```

## API Endpoints

### Send Email
```http
POST /api/send-email
Content-Type: application/json

{
  "to": "candidate@example.com",
  "templateType": "applicationReceived",
  "variables": {
    "candidateName": "John Doe",
    "position": "Software Developer",
    "appliedDate": "2025-10-23"
  }
}
```

### Get Available Templates
```http
GET /api/templates
```

### Preview Template
```http
POST /api/preview-template
Content-Type: application/json

{
  "templateType": "interviewInvitation",
  "variables": {
    "candidateName": "John Doe",
    "position": "Software Developer",
    "interviewDate": "November 1, 2025"
  }
}
```

## Available Templates

1. **applicationReceived** - Confirmation when application is received
2. **applicationRejected** - Rejection notification
3. **shortlistNotification** - Shortlist notification
4. **interviewInvitation** - Interview scheduling
5. **interviewReminder** - Interview reminder
6. **jobOffer** - Job offer letter
7. **onboardingWelcome** - Welcome email for new hires

## Template Variables

- `{candidateName}` - Candidate's full name
- `{position}` - Job position
- `{appliedDate}` - Application date
- `{applicationId}` - Application ID
- `{interviewDate}` - Interview date
- `{interviewTime}` - Interview time
- `{location}` - Interview location
- `{interviewer}` - Interviewer name
- `{interviewType}` - Interview type
- `{salary}` - Offered salary
- `{startDate}` - Start date
- `{benefits}` - Benefits package

## Integration with Frontend

The service integrates with the HR system frontend through the `email-service.ts` utility:

```typescript
import { emailService } from '@/lib/email-service'

// Send application received email
await emailService.sendApplicationReceived(
  'candidate@example.com',
  'John Doe',
  'Software Developer'
)

// Send custom email
await emailService.sendCustomEmail(
  'candidate@example.com',
  'Custom Subject',
  'Custom message content'
)
```

## Development

- **Start with auto-reload**: `npm run dev`
- **Production start**: `npm start`
- **Port**: 3001 (configurable in server.js)

## Security Notes

- Store email credentials in environment variables for production
- Use secure SMTP connections (TLS/SSL)
- Implement rate limiting for email sending
- Add authentication for API endpoints in production

## Troubleshooting

1. **Email not sending**: Check SMTP credentials and network connectivity
2. **Template not found**: Verify template type exists in predefined templates
3. **Variables not replaced**: Ensure variable names match exactly (case-sensitive)
4. **CORS issues**: Configure CORS settings for frontend integration

## Support

For issues or questions, contact the development team or check the main HR system documentation.
