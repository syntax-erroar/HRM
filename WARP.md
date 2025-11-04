# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Main Application
```bash
# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint the codebase
npm run lint
# Alternative: eslint .
```

### Email Service (Separate Backend)
```bash
# Start email service (port 3001) - Required for email functionality
cd email-service
npm install
npm start

# Test email service
cd email-service
node test-email.js

# Test API endpoint directly
curl http://localhost:3001/api/templates
```

### Testing Email Integration
```bash
# Test email service from PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/templates" -Method Get

# Test sending email
Invoke-RestMethod -Uri "http://localhost:3001/api/send-email" -Method Post `
  -ContentType "application/json" `
  -Body '{"to":"test@example.com","templateType":"applicationReceived","variables":{"candidateName":"Test","position":"Developer"}}'
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript with React 19
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Email Backend**: Separate Node.js/Express service with Nodemailer
- **Authentication**: Custom context-based auth (localStorage)
- **State Management**: React Context + hooks
- **Icons**: Lucide React
- **Charts**: Recharts

### Project Structure
```
hr-automation-system/
├── app/                      # Next.js App Router pages and API routes
│   ├── api/email/           # Email API endpoints (send, preview, templates)
│   ├── candidates/          # Candidate management UI
│   ├── interviews/          # Interview scheduling UI
│   ├── emails/              # Email management UI
│   ├── job-requests/        # Job posting workflows
│   ├── login/               # Authentication page
│   └── page.tsx             # Dashboard (home page)
├── components/              # React components
│   ├── ui/                  # shadcn/ui base components
│   ├── candidate-*.tsx      # Candidate management components
│   ├── protected-route.tsx  # Auth wrapper component
│   ├── sidebar.tsx          # Main navigation
│   └── dashboard.tsx        # Dashboard component
├── lib/                     # Utilities and contexts
│   ├── auth-context.tsx     # Authentication context provider
│   ├── email-service.ts     # Email service client integration
│   └── utils.ts             # Utility functions
├── hooks/                   # Custom React hooks
├── email-service/           # Standalone Node.js email backend (port 3001)
│   ├── server.js            # Express server with email templates
│   └── test-email.js        # Email testing script
└── public/                  # Static assets
```

### Key Architectural Patterns

#### Dual-Service Architecture
This system runs **two separate services**:
1. **Next.js frontend + API routes** (port 3000) - Main application
2. **Node.js email service** (port 3001) - Email automation backend

Both must be running for full functionality. The frontend calls the email service via `lib/email-service.ts`.

#### Authentication Flow
- Custom auth context (`lib/auth-context.tsx`) manages user sessions
- Three user roles with different access levels:
  - `"hr_admin"` - Full system access (all features including settings and approvals)
  - `"hr_team"` - Day-to-day HR operations (no settings or approvals)
  - `"hiring_manager"` - Limited to requisitions and candidate management
- Roles are assigned via mock database lookup (in production: real database)
- User cannot select role at login - role is determined by email/user ID
- Session stored in localStorage (simulate backend auth)
- Protected routes use `ProtectedRoute` component wrapper
- Login page at `/login`, unauthorized redirect to `/unauthorized`

**Mock User Database** (`lib/auth-context.tsx`):
- `hradmin@tristone.com` → HR Admin role
- `hr@tristone.com` → HR Team role
- `manager@tristone.com` → Hiring Manager role

#### Email Automation System
The email system is the core differentiator of this HR platform:

**Email Templates** (7 predefined types):
- `applicationReceived` - Confirmation when application received
- `applicationRejected` - Rejection notification
- `shortlistNotification` - Candidate shortlisted
- `interviewInvitation` - Interview scheduling
- `interviewReminder` - Interview reminder
- `jobOffer` - Job offer letter
- `onboardingWelcome` - Welcome email for new hires

**Email Flow**:
1. Frontend calls `emailService` methods from `lib/email-service.ts`
2. Makes POST to `/api/email/send` (Next.js API route)
3. API route uses nodemailer to send via SMTP (Office365)
4. Variables like `{candidateName}`, `{position}`, `{interviewDate}` auto-replace in templates

**Email Service Integration Points**:
- `lib/email-service.ts` - Frontend client (singleton pattern)
- `app/api/email/send/route.ts` - Next.js API handler with email templates
- `app/api/email/templates/route.ts` - Get available templates
- `app/api/email/preview/route.ts` - Preview emails before sending

#### Candidate Data Model
```typescript
interface Candidate {
  id: number
  fullName: string
  email: string
  phone: string
  position: string
  experience: string
  status: "new" | "reviewing" | "shortlisted" | "rejected"
  appliedDate: string
  resume: string
}
```

#### Component Patterns
- **Client Components**: Most components use `"use client"` directive (Next.js App Router)
- **shadcn/ui**: UI components from shadcn (Radix UI primitives)
- **Modal Pattern**: Candidate detail modal includes tabs for info/email/history
- **Status Badge System**: Visual status indicators with color-coded badges

## Important Configuration

### TypeScript Configuration
- **Build errors ignored**: `next.config.mjs` has `typescript.ignoreBuildErrors: true`
- When adding new features, be aware TypeScript errors may not fail the build
- Path alias: `@/*` maps to root directory

### Email SMTP Configuration
Email credentials are hardcoded in `app/api/email/send/route.ts`:
- **SMTP Host**: smtp.office365.com
- **Port**: 587
- **Email**: nishit.wadhwani@tristone-partners.com
- **Note**: For production, move credentials to environment variables

### Environment Variables
The system expects `.env.local` file (not currently in use, but documented in README):
```env
EMAIL_SERVICE_URL=http://localhost:3001
EMAIL_FROM=noreply@yourcompany.com
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASS=your-app-password
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## Development Workflow

### Starting the Full System
1. **Terminal 1** - Start email service:
   ```bash
   cd email-service
   npm install
   npm start
   ```

2. **Terminal 2** - Start Next.js app:
   ```bash
   npm run dev
   ```

3. Access at http://localhost:3000

### Adding New Email Templates
1. Add template definition to `app/api/email/send/route.ts` in `emailTemplates` object
2. Add convenience method to `lib/email-service.ts` EmailService class
3. Template variables use `{variableName}` format - automatically replaced

### Adding New Pages
- Create page in `app/[route]/page.tsx` (Next.js App Router)
- Wrap with `<ProtectedRoute>` for auth-required pages
- Add `<ProtectedRoute allowedRoles={["hr"]}>` for role restrictions
- Update `components/sidebar.tsx` for navigation

### Working with Candidate Data
- Candidate data is currently mock/local (no database)
- Status changes should trigger email automation via `emailService`
- When status changes to "shortlisted", call `emailService.sendShortlistNotification()`
- When status changes to "rejected", call `emailService.sendRejection()`

## Common Patterns

### Using Email Service
```typescript
import { emailService } from '@/lib/email-service'

// Send predefined template
await emailService.sendApplicationReceived(
  candidate.email,
  candidate.fullName,
  candidate.position
)

// Send custom email
await emailService.sendCustomEmail(
  candidate.email,
  'Custom Subject',
  'Custom message body'
)
```

### Auth-Protected Component
```typescript
import { ProtectedRoute } from "@/components/protected-route"

export default function SomePage() {
  return (
    <ProtectedRoute allowedRoles={["hr_admin", "hr_team"]}>
      {/* Page content */}
    </ProtectedRoute>
  )
}
```

### Using Auth Context
```typescript
import { useAuth } from "@/lib/auth-context"

function MyComponent() {
  const { user, login, logout } = useAuth()
  // user.role is "hr_admin", "hr_team", or "hiring_manager"
  
  // Role-based logic
  if (user?.role === "hr_admin") {
    // Full admin access
  } else if (user?.role === "hr_team") {
    // HR team member access
  } else if (user?.role === "hiring_manager") {
    // Hiring manager access
  }
}
```

## Troubleshooting

### Email Service Issues
- Verify port 3001 is available: `netstat -ano | findstr :3001` (Windows)
- Check email service is running: `curl http://localhost:3001/api/templates`
- SMTP errors: Verify credentials in `app/api/email/send/route.ts`
- CORS issues: Email service should allow localhost:3000 origin

### Build Issues
- TypeScript errors are suppressed by config - check manually with `tsc --noEmit`
- Missing dependencies: Run `npm install` in both root and `email-service/`
- Port conflicts: Ensure 3000 and 3001 are available

### Authentication Issues
- Auth is localStorage-based simulation with mock database
- User roles are assigned in `mockUserDatabase` in `lib/auth-context.tsx`
- Password validation exists but uses hardcoded "password" for all demo users
- Clear localStorage to reset session: `localStorage.clear()` in browser console
- To add new users: Add entry to `mockUserDatabase` object in `lib/auth-context.tsx`
