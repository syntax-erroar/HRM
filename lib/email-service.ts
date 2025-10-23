// Email automation service integration
export interface EmailVariables {
  candidateName?: string;
  position?: string;
  appliedDate?: string;
  applicationId?: string;
  interviewDate?: string;
  interviewTime?: string;
  location?: string;
  interviewer?: string;
  interviewType?: string;
  startDate?: string;
  salary?: string;
  benefits?: string;
  [key: string]: string | undefined;
}

export interface EmailTemplate {
  type: string;
  name: string;
  subject: string;
}

export interface SendEmailRequest {
  to: string;
  templateType: string;
  variables?: EmailVariables;
  customSubject?: string;
  customMessage?: string;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  messageId?: string;
  templateUsed?: string;
  error?: string;
}

export interface PreviewTemplateResponse {
  success: boolean;
  subject: string;
  message: string;
  error?: string;
}

class EmailService {
  private baseUrl: string;

  constructor() {
    // Use Next.js API routes instead of separate service
    this.baseUrl = '/api/email';
  }

  /**
   * Send an email using a predefined template
   */
  async sendEmail(request: SendEmailRequest): Promise<SendEmailResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get available email templates
   */
  async getTemplates(): Promise<EmailTemplate[]> {
    try {
      const response = await fetch(`${this.baseUrl}/templates`);
      const data = await response.json();
      return data.success ? data.templates : [];
    } catch (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
  }

  /**
   * Preview a template with variables
   */
  async previewTemplate(templateType: string, variables: EmailVariables): Promise<PreviewTemplateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateType, variables }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error previewing template:', error);
      return {
        success: false,
        subject: '',
        message: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send application received email
   */
  async sendApplicationReceived(candidateEmail: string, candidateName: string, position: string): Promise<SendEmailResponse> {
    return this.sendEmail({
      to: candidateEmail,
      templateType: 'applicationReceived',
      variables: {
        candidateName,
        position,
        appliedDate: new Date().toLocaleDateString(),
        applicationId: `APP-${Date.now()}`,
      },
    });
  }

  /**
   * Send rejection email
   */
  async sendRejection(candidateEmail: string, candidateName: string, position: string): Promise<SendEmailResponse> {
    return this.sendEmail({
      to: candidateEmail,
      templateType: 'applicationRejected',
      variables: {
        candidateName,
        position,
      },
    });
  }

  /**
   * Send shortlist notification
   */
  async sendShortlistNotification(candidateEmail: string, candidateName: string, position: string): Promise<SendEmailResponse> {
    return this.sendEmail({
      to: candidateEmail,
      templateType: 'shortlistNotification',
      variables: {
        candidateName,
        position,
      },
    });
  }

  /**
   * Send interview invitation
   */
  async sendInterviewInvitation(
    candidateEmail: string,
    candidateName: string,
    position: string,
    interviewDate: string,
    interviewTime: string,
    location: string,
    interviewer: string,
    interviewType: string = 'Video Call'
  ): Promise<SendEmailResponse> {
    return this.sendEmail({
      to: candidateEmail,
      templateType: 'interviewInvitation',
      variables: {
        candidateName,
        position,
        interviewDate,
        interviewTime,
        location,
        interviewer,
        interviewType,
      },
    });
  }

  /**
   * Send interview reminder
   */
  async sendInterviewReminder(
    candidateEmail: string,
    candidateName: string,
    position: string,
    interviewDate: string,
    interviewTime: string,
    location: string,
    interviewer: string
  ): Promise<SendEmailResponse> {
    return this.sendEmail({
      to: candidateEmail,
      templateType: 'interviewReminder',
      variables: {
        candidateName,
        position,
        interviewDate,
        interviewTime,
        location,
        interviewer,
      },
    });
  }

  /**
   * Send job offer
   */
  async sendJobOffer(
    candidateEmail: string,
    candidateName: string,
    position: string,
    startDate: string,
    salary: string,
    benefits: string
  ): Promise<SendEmailResponse> {
    return this.sendEmail({
      to: candidateEmail,
      templateType: 'jobOffer',
      variables: {
        candidateName,
        position,
        startDate,
        salary,
        benefits,
      },
    });
  }

  /**
   * Send onboarding welcome email
   */
  async sendOnboardingWelcome(
    candidateEmail: string,
    candidateName: string,
    position: string,
    startDate: string
  ): Promise<SendEmailResponse> {
    return this.sendEmail({
      to: candidateEmail,
      templateType: 'onboardingWelcome',
      variables: {
        candidateName,
        position,
        startDate,
      },
    });
  }

  /**
   * Send custom email
   */
  async sendCustomEmail(
    candidateEmail: string,
    subject: string,
    message: string
  ): Promise<SendEmailResponse> {
    return this.sendEmail({
      to: candidateEmail,
      templateType: 'custom',
      customSubject: subject,
      customMessage: message,
    });
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;
