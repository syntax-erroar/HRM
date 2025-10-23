# HR Automation System

A comprehensive Human Resources automation system built with Next.js, featuring candidate management, interview scheduling, email automation, and job request workflows.

## 🚀 Features

### Core Functionality
- **Candidate Management**: Track and manage job applicants with detailed profiles
- **Interview Scheduling**: Calendar-based interview scheduling with automated notifications
- **Email Automation**: Automated email workflows for recruitment processes
- **Job Request System**: Streamlined job posting and approval workflows
- **Dashboard Analytics**: Real-time insights into recruitment metrics

### Key Components
- **Authentication**: Secure login system with role-based access
- **Email Service**: Automated email notifications and templates
- **Calendar Integration**: Interview scheduling and management
- **Resume Screening**: AI-powered candidate filtering and ranking
- **Notification System**: Real-time updates and alerts

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Email Service**: Node.js email automation service
- **Authentication**: Custom auth context
- **Icons**: Lucide React
- **Charts**: Recharts for analytics

## 📁 Project Structure

```
hr-automation-system/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── candidates/        # Candidate management pages
│   ├── interviews/        # Interview scheduling
│   ├── emails/           # Email management
│   └── job-requests/     # Job request workflows
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── [feature-components]
├── lib/                   # Utility functions and contexts
├── hooks/                 # Custom React hooks
├── email-service/         # Node.js email automation
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/syntax-erroar/HRM.git
   cd HRM
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up email service**
   ```bash
   cd email-service
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start email service** (in separate terminal)
   ```bash
   cd email-service
   node server.js
   ```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Email Configuration
EMAIL_SERVICE_URL=http://localhost:3001
EMAIL_FROM=noreply@yourcompany.com
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASS=your-app-password

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 📧 Email Automation Setup

The system includes a comprehensive email automation service:

- **Templates**: Pre-built email templates for different recruitment stages
- **Automation**: Automated email sequences for candidate communication
- **Tracking**: Email delivery and engagement tracking
- **Customization**: Easy template customization and branding

See `EMAIL_AUTOMATION_SETUP.md` for detailed configuration instructions.

## 🎯 Key Features

### Dashboard
- Real-time recruitment metrics
- Upcoming interviews calendar
- Recent activity feed
- Quick action buttons

### Candidate Management
- Comprehensive candidate profiles
- Resume screening and filtering
- Application status tracking
- Communication history

### Interview Scheduling
- Calendar-based scheduling
- Automated notifications
- Interview feedback collection
- Conflict resolution

### Email Automation
- Template management
- Automated sequences
- Delivery tracking
- Custom branding

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Structure

- **Components**: Reusable UI components in `/components`
- **Pages**: Next.js pages in `/app`
- **API Routes**: Server-side logic in `/app/api`
- **Utils**: Helper functions in `/lib`
- **Hooks**: Custom React hooks in `/hooks`

## 📊 Features Overview

| Feature | Status | Description |
|---------|--------|-------------|
| Authentication | ✅ | Secure login with role-based access |
| Candidate Management | ✅ | Full CRUD operations for candidates |
| Interview Scheduling | ✅ | Calendar-based scheduling system |
| Email Automation | ✅ | Automated email workflows |
| Dashboard Analytics | ✅ | Real-time metrics and insights |
| Job Request System | ✅ | Streamlined job posting workflow |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Check the documentation in `/docs`
- Review the email automation setup guide

## 🔮 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Integration with popular ATS systems
- [ ] Mobile app for recruiters
- [ ] AI-powered candidate matching
- [ ] Advanced reporting and insights
- [ ] Multi-language support

---

Built with ❤️ for modern HR teams
