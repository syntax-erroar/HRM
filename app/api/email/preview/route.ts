import { NextRequest, NextResponse } from 'next/server'

// Standard email templates (same as in send route)
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
    const { templateType, variables } = body
    
    if (!emailTemplates[templateType as keyof typeof emailTemplates]) {
      return NextResponse.json(
        { success: false, error: 'Invalid template type' },
        { status: 400 }
      )
    }
    
    const template = emailTemplates[templateType as keyof typeof emailTemplates]
    const subject = replaceTemplateVariables(template.subject, variables || {})
    const message = replaceTemplateVariables(template.body, variables || {})
    
    return NextResponse.json({
      success: true,
      subject,
      message
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to preview template' },
      { status: 500 }
    )
  }
}
