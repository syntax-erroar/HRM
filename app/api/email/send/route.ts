import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'nishit.wadhwani@tristone-partners.com',
    pass: 'gkstrwmpnkzvdlkz'  
  }
})

// Standard email templates
const emailTemplates = {
  applicationReceived: {
    subject: 'Application Received - {position}',
    body: `Dear {candidateName},

Thank you for your interest in the {position} position at Tristone Partners.

We have successfully received your application for our global outsourcing advisory services team. Our HR team will review your qualifications for roles in investment research, due diligence, financial modeling, or accounting support within 2-3 business days.

Application Details:
- Position: {position}
- Applied Date: {appliedDate}
- Application ID: {applicationId}

As a global advisory firm serving clients across 10+ countries, we value candidates with strong analytical skills and international experience. You will receive an update on your application status soon.

If you have any questions, please don't hesitate to contact us.

Best regards,
HR Team
Tristone Partners
Global Outsourcing Advisory Firm`
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

We are excited to invite you for an interview for the {position} position at Tristone Partners.

As a global outsourcing advisory firm specializing in investment research, due diligence, financial modeling, and accounting support, we are looking for talented professionals to join our team serving clients across 10+ countries.

Interview Details:
- Date: {interviewDate}
- Time: {interviewTime}
- Location: {location}
- Interviewer: {interviewer}
- Interview Type: {interviewType}

Please prepare to discuss your experience in financial analysis, investment research, or accounting services. We value candidates with strong analytical skills and international exposure.

Please confirm your attendance by replying to this email or calling us at +91-XXXX-XXXX.

If you need to reschedule, please let us know at least 24 hours in advance.

We look forward to meeting you!

Best regards,
HR Team
Tristone Partners
Global Outsourcing Advisory Firm`
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

We are delighted to offer you the position of {position} at Tristone Partners!

After careful consideration of your qualifications and interview performance, we believe you would be a valuable addition to our global advisory services team. Your expertise in financial analysis and international experience align perfectly with our mission to provide high-quality research, due diligence, financial modeling, and accounting support to investment firms, family offices, and corporates worldwide.

Offer Details:
- Position: {position}
- Start Date: {startDate}
- Salary: {salary}
- Benefits: {benefits}

As a global outsourcing advisory firm founded in 2019, we operate from multiple locations including Mumbai, India, and serve clients across 10+ countries. You will be joining a dynamic team that delivers customized services to meet the unique needs of our diverse client base.

Please review the attached offer letter and respond within 5 business days.

We look forward to welcoming you to our team!

Best regards,
HR Team
Tristone Partners
Global Outsourcing Advisory Firm`
  },

  onboardingWelcome: {
    subject: 'Welcome to Tristone Partners!',
    body: `Dear {candidateName},

Welcome to Tristone Partners! We are thrilled to have you join our global advisory services team.

As a global outsourcing advisory firm founded in 2019, we specialize in providing high-quality research, due diligence, financial modeling, and accounting support to investment firms, family offices, and corporates across 10+ countries.

Your first day is scheduled for {startDate}. Please arrive at 9:00 AM and report to the reception desk.

What to bring:
- Government-issued ID
- Bank account details
- Emergency contact information
- Professional certifications (CA/CFA/CPA if applicable)
- Any required documentation

You will receive a detailed onboarding schedule via email closer to your start date. This will include introductions to our various service lines: Investment Research & Analysis, Due Diligence & Financial Modeling, Accounting & FP&A Services, and Family Office & Private Equity Support.

If you have any questions before your first day, please don't hesitate to contact us.

We're excited to have you on board!

Best regards,
HR Team
Tristone Partners
Global Outsourcing Advisory Firm`
  }
}

// Helper function to replace template variables
function replaceTemplateVariables(template: string, variables: Record<string, string>) {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{${key}}`, 'g')
    result = result.replace(regex, value)
  }
  return result
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, templateType, variables, customSubject, customMessage } = body

    // Validate input
    if (!to || !templateType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: to, templateType' },
        { status: 400 }
      )
    }

    // Get template or use custom message
    let subject, message
    if (templateType === 'custom' && customSubject && customMessage) {
      subject = customSubject
      message = customMessage
    } else if (emailTemplates[templateType as keyof typeof emailTemplates]) {
      const template = emailTemplates[templateType as keyof typeof emailTemplates]
      subject = replaceTemplateVariables(template.subject, variables || {})
      message = replaceTemplateVariables(template.body, variables || {})
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid template type or missing custom message' },
        { status: 400 }
      )
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
              <h1 style="color: #059669; margin: 0; font-size: 24px;">Tristone Partners</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0;">Global Outsourcing Advisory Firm</p>
              <p style="color: #9ca3af; margin: 2px 0 0 0; font-size: 12px;">Investment Research • Due Diligence • Financial Modeling • Accounting Support</p>
            </div>
            
            <h2 style="color: #1f2937; margin-bottom: 20px;">${subject}</h2>
            
            <div style="line-height: 1.6; color: #374151; white-space: pre-line;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Best regards,<br>
                HR Team<br>
                Tristone Partners<br>
                📧 nishit.wadhwani@tristone-partners.com<br>
                🌐 tristone-partners.com
              </p>
            </div>
          </div>
        </div>
      `
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent:', info.messageId)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully!',
      messageId: info.messageId,
      templateUsed: templateType
    })
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
