const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001; // Changed to 3001 to avoid conflict with Next.js dev server

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static HTML files

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'nishit.wadhwani@tristone-partners.com',
    pass: 'gkstrwmpnkzvdlkz'  
  }
});

// Test email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send emails');
  }
});

// Standard email templates
const emailTemplates = {
  applicationReceived: {
    subject: 'Application Received - {position}',
    body: `Dear {candidateName},

Thank you for your interest in the {position} position at Tristone Strategic Partners LLP.

We have successfully received your application and our HR team will review it within 2-3 business days. You will receive an update on your application status soon.

Application Details:
- Position: {position}
- Applied Date: {appliedDate}
- Application ID: {applicationId}

If you have any questions, please don't hesitate to contact us.

Best regards,
HR Team
Tristone Strategic Partners LLP`
  },

  applicationRejected: {
    subject: 'Application Status Update - {position}',
    body: `Dear {candidateName},

Thank you for your interest in the {position} position at Tristone Strategic Partners LLP.

After careful consideration of your application, we have decided to move forward with other candidates who more closely match our current requirements.

We appreciate the time and effort you put into your application and encourage you to apply for future opportunities that align with your skills and experience.

Best regards,
HR Team
Tristone Strategic Partners LLP`
  },

  shortlistNotification: {
    subject: 'Great News - You\'ve Been Shortlisted!',
    body: `Dear {candidateName},

Congratulations! We are pleased to inform you that you have been shortlisted for the {position} role at Tristone Strategic Partners LLP.

Your application stood out among many qualified candidates, and we would like to invite you for the next stage of our selection process.

Our HR team will contact you within the next 2-3 business days to schedule an interview and discuss the next steps.

We look forward to speaking with you soon!

Best regards,
HR Team
Tristone Strategic Partners LLP`
  },

  interviewInvitation: {
    subject: 'Interview Invitation - {position}',
    body: `Dear {candidateName},

We are excited to invite you for an interview for the {position} position at Tristone Strategic Partners LLP.

Interview Details:
- Date: {interviewDate}
- Time: {interviewTime}
- Location: {location}
- Interviewer: {interviewer}
- Interview Type: {interviewType}

Please confirm your attendance by replying to this email or calling us at +91-XXXX-XXXX.

If you need to reschedule, please let us know at least 24 hours in advance.

We look forward to meeting you!

Best regards,
HR Team
Tristone Strategic Partners LLP`
  },

  interviewReminder: {
    subject: 'Interview Reminder - Tomorrow at {interviewTime}',
    body: `Dear {candidateName},

This is a friendly reminder about your upcoming interview for the {position} position.

Interview Details:
- Date: {interviewDate}
- Time: {interviewTime}
- Location: {location}
- Interviewer: {interviewer}

Please arrive 10 minutes early and bring a copy of your resume.

If you have any questions or need to reschedule, please contact us immediately.

Best regards,
HR Team
Tristone Strategic Partners LLP`
  },

  jobOffer: {
    subject: 'Job Offer - {position}',
    body: `Dear {candidateName},

We are delighted to offer you the position of {position} at Tristone Strategic Partners LLP!

After careful consideration of your qualifications and interview performance, we believe you would be a valuable addition to our team.

Offer Details:
- Position: {position}
- Start Date: {startDate}
- Salary: {salary}
- Benefits: {benefits}

Please review the attached offer letter and respond within 5 business days.

We look forward to welcoming you to our team!

Best regards,
HR Team
Tristone Strategic Partners LLP`
  },

  onboardingWelcome: {
    subject: 'Welcome to Tristone Strategic Partners LLP!',
    body: `Dear {candidateName},

Welcome to Tristone Strategic Partners LLP! We are thrilled to have you join our team.

Your first day is scheduled for {startDate}. Please arrive at 9:00 AM and report to the reception desk.

What to bring:
- Government-issued ID
- Bank account details
- Emergency contact information
- Any required documentation

You will receive a detailed onboarding schedule via email closer to your start date.

If you have any questions before your first day, please don't hesitate to contact us.

We're excited to have you on board!

Best regards,
HR Team
Tristone Strategic Partners LLP`
  }
};

// Helper function to replace template variables
function replaceTemplateVariables(template, variables) {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{${key}}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

// API endpoint to send email with template
app.post('/api/send-email', async (req, res) => {
  const { to, templateType, variables, customSubject, customMessage } = req.body;

  // Validate input
  if (!to || !templateType) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: to, templateType' 
    });
  }

  // Get template or use custom message
  let subject, message;
  if (templateType === 'custom' && customSubject && customMessage) {
    subject = customSubject;
    message = customMessage;
  } else if (emailTemplates[templateType]) {
    const template = emailTemplates[templateType];
    subject = replaceTemplateVariables(template.subject, variables || {});
    message = replaceTemplateVariables(template.body, variables || {});
  } else {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid template type or missing custom message' 
    });
  }

  // Email options
  const mailOptions = {
    from: 'nishit.wadhwani@tristone-partners.com',
    to: to,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin: 0; font-size: 24px;">Tristone Strategic Partners LLP</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0;">Recruitment & HR Management</p>
          </div>
          
          <h2 style="color: #1f2937; margin-bottom: 20px;">${subject}</h2>
          
          <div style="line-height: 1.6; color: #374151; white-space: pre-line;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Best regards,<br>
              HR Team<br>
              Tristone Strategic Partners LLP<br>
              📧 nishit.wadhwani@tristone-partners.com
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    
    res.json({ 
      success: true, 
      message: 'Email sent successfully!',
      messageId: info.messageId,
      templateUsed: templateType
    });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// API endpoint to get available templates
app.get('/api/templates', (req, res) => {
  const templateList = Object.keys(emailTemplates).map(key => ({
    type: key,
    name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    subject: emailTemplates[key].subject
  }));
  
  res.json({
    success: true,
    templates: templateList
  });
});

// API endpoint to preview template
app.post('/api/preview-template', (req, res) => {
  const { templateType, variables } = req.body;
  
  if (!emailTemplates[templateType]) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid template type' 
    });
  }
  
  const template = emailTemplates[templateType];
  const subject = replaceTemplateVariables(template.subject, variables || {});
  const message = replaceTemplateVariables(template.body, variables || {});
  
  res.json({
    success: true,
    subject,
    message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Email service running on http://localhost:${PORT}`);
  console.log(`📧 Email automation ready for HR system integration`);
});
