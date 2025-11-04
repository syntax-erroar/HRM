// Mock database for job templates - In production, this would be a real database

export interface JobTemplate {
  role: string
  jobDescription: string
  professionalSummary: string
  socialMessageTemplate: string
  category: string
}

// Mock database of job templates by role
export const jobTemplatesDB: Record<string, JobTemplate> = {
  "Senior Developer": {
    role: "Senior Developer",
    category: "Engineering",
    jobDescription: `About the Role:
We are seeking an experienced Senior Developer to join our growing engineering team at Tristone Partners. As a global outsourcing advisory firm, we provide high-quality research, due diligence, financial modeling, and accounting support to investment firms, family offices, and corporates worldwide.

Key Responsibilities:
• Design, develop, and maintain scalable software solutions for financial services clients
• Lead technical architecture decisions and code reviews
• Mentor junior developers and contribute to team growth
• Collaborate with cross-functional teams including analysts and product managers
• Implement best practices for code quality, testing, and deployment
• Work on client-facing applications handling sensitive financial data

Required Qualifications:
• 5+ years of professional software development experience
• Strong proficiency in modern programming languages (Python, JavaScript/TypeScript, Java)
• Experience with cloud platforms (AWS, Azure, or GCP)
• Solid understanding of database design and optimization
• Experience with RESTful API design and microservices architecture
• Excellent problem-solving and analytical skills

Preferred Qualifications:
• Experience in financial services or fintech industry
• Knowledge of financial modeling concepts
• Familiarity with data visualization tools
• Experience with CI/CD pipelines and DevOps practices

What We Offer:
• Competitive salary and benefits package
• Opportunity to work with global clients across 10+ countries
• Professional development and learning opportunities
• Flexible work arrangements
• Collaborative and innovative work environment`,
    professionalSummary: `Tristone Partners is a global outsourcing advisory firm founded in 2019, specializing in investment research, due diligence, financial modeling, and accounting support. Operating from Mumbai, India, with a presence across 10+ countries, we serve investment firms, family offices, and corporates with customized, high-quality services tailored to their unique needs.`,
    socialMessageTemplate: `🚀 We're Hiring: {jobTitle}

Join Tristone Partners - a global outsourcing advisory firm specializing in investment research and financial services!

📍 Location: {location}
💰 Salary: {salaryRange}
📋 Employment: {employmentType}
🎯 Experience: {experienceLevel}

What You'll Do:
• Lead development of financial service applications
• Work with global clients across 10+ countries
• Mentor team members and drive technical excellence

What We're Looking For:
• {experienceLevel} in software development
• Strong technical skills in modern tech stack
• Passion for financial technology

Why Tristone Partners?
✨ Work with top-tier financial institutions
✨ Global exposure and diverse projects
✨ Competitive compensation & benefits
✨ Professional growth opportunities

Ready to make an impact in financial services? Apply now!

#Hiring #TechJobs #{department} #SoftwareDevelopment #Fintech`
  },

  "Product Manager": {
    role: "Product Manager",
    category: "Product",
    jobDescription: `About the Role:
Tristone Partners is seeking a strategic Product Manager to lead product development initiatives that serve our global client base in investment research, due diligence, and financial advisory services.

Key Responsibilities:
• Define and execute product strategy for financial services platforms
• Work closely with engineering, design, and business teams
• Conduct market research and competitive analysis
• Develop product roadmaps aligned with business objectives
• Gather and prioritize product requirements from global stakeholders
• Define success metrics and track product performance
• Manage product lifecycle from concept to launch

Required Qualifications:
• 3-5 years of product management experience
• Strong analytical and data-driven decision-making skills
• Excellent communication and stakeholder management abilities
• Experience with agile methodologies
• Understanding of financial services industry (preferred)
• Ability to work across different time zones with global teams

Preferred Qualifications:
• MBA or relevant advanced degree
• Experience with B2B SaaS products
• Knowledge of investment research or financial modeling
• Technical background or strong technical acumen

What We Offer:
• Opportunity to shape products used by top financial institutions
• Work with international teams and clients
• Competitive compensation package
• Professional development opportunities
• Flexible remote work options`,
    professionalSummary: `Tristone Partners is a global outsourcing advisory firm providing specialized services in investment research, due diligence, financial modeling, and accounting support to leading investment firms, family offices, and corporates across 10+ countries since 2019.`,
    socialMessageTemplate: `📢 Exciting Opportunity: {jobTitle}

Tristone Partners is looking for a talented Product Manager to join our team!

📍 Location: {location}
💰 Salary: {salaryRange}
📋 Type: {employmentType}
⭐ Experience: {experienceLevel}

What You'll Own:
• Product strategy for global financial services platform
• Cross-functional collaboration with engineering & design
• Direct impact on products used by top financial institutions

What We Need:
• {experienceLevel} in product management
• Strong analytical and communication skills
• Passion for financial technology

Why Join Us?
🌍 Global exposure across 10+ countries
📈 Work with leading investment firms
💡 Shape innovative financial solutions
🚀 Fast-growing company with huge impact

Interested? Apply today!

#ProductManagement #Hiring #{department} #Fintech #CareerOpportunity`
  },

  "UX Designer": {
    role: "UX Designer",
    category: "Design",
    jobDescription: `About the Role:
We are looking for a creative UX Designer to craft exceptional user experiences for our financial services platforms at Tristone Partners, where we serve global clients in investment research and financial advisory.

Key Responsibilities:
• Design intuitive user interfaces for financial applications
• Conduct user research and usability testing
• Create wireframes, prototypes, and high-fidelity designs
• Collaborate with product managers and engineers
• Develop and maintain design systems
• Ensure accessibility and responsive design principles
• Present design concepts to stakeholders

Required Qualifications:
• 3-5 years of UX/UI design experience
• Strong portfolio demonstrating user-centered design
• Proficiency in design tools (Figma, Sketch, Adobe XD)
• Understanding of responsive and mobile-first design
• Experience with prototyping and user testing
• Excellent visual design skills

Preferred Qualifications:
• Experience designing for financial services or data-heavy applications
• Knowledge of design systems and component libraries
• Understanding of front-end development (HTML/CSS)
• Experience with data visualization design

What We Offer:
• Opportunity to design for global financial institutions
• Collaborative and creative work environment
• Professional development and design conferences
• Competitive salary and benefits
• Flexible work arrangements`,
    professionalSummary: `Tristone Partners delivers world-class outsourcing advisory services in investment research, due diligence, financial modeling, and accounting support to a global clientele spanning investment firms, family offices, and corporates across more than 10 countries.`,
    socialMessageTemplate: `🎨 We're Hiring: {jobTitle}

Design exceptional experiences for global financial platforms at Tristone Partners!

📍 Location: {location}
💰 Compensation: {salaryRange}
📋 Type: {employmentType}
🎯 Level: {experienceLevel}

Your Impact:
• Design products for top-tier financial institutions
• Create intuitive interfaces for complex financial data
• Work with a global, collaborative team

What You Bring:
• {experienceLevel} in UX/UI design
• Strong portfolio of user-centered designs
• Passion for solving complex design challenges

Why Tristone?
✨ Work on innovative financial products
✨ Global reach across 10+ countries
✨ Creative freedom & ownership
✨ Competitive package & growth opportunities

Let's create something amazing together! Apply now 🚀

#UXDesign #UIDesign #Hiring #{department} #DesignJobs #Fintech`
  },

  "Financial Analyst": {
    role: "Financial Analyst",
    category: "Finance",
    jobDescription: `About the Role:
Tristone Partners is seeking a detail-oriented Financial Analyst to support our global advisory services in investment research, due diligence, and financial modeling for top-tier investment firms and family offices.

Key Responsibilities:
• Conduct comprehensive financial analysis and modeling
• Perform due diligence on investment opportunities
• Prepare detailed investment research reports
• Analyze financial statements and market trends
• Support client deliverables with data-driven insights
• Collaborate with cross-functional teams on complex projects
• Present findings to senior stakeholders and clients

Required Qualifications:
• 2-4 years of experience in financial analysis or investment research
• Strong Excel and financial modeling skills
• Bachelor's degree in Finance, Economics, or related field
• Excellent analytical and quantitative abilities
• Strong attention to detail and accuracy
• Ability to work with international teams

Preferred Qualifications:
• CFA Level 1 or progress toward CFA certification
• Experience in investment banking, private equity, or consulting
• Knowledge of various industries and sectors
• Advanced degree (MBA, MSF) is a plus

What We Offer:
• Exposure to diverse global investment opportunities
• Work with leading investment firms and family offices
• Professional development and CFA study support
• Competitive compensation
• International collaboration opportunities`,
    professionalSummary: `Tristone Partners, established in 2019, is a leading global outsourcing advisory firm specializing in investment research, due diligence, financial modeling, and accounting support for investment firms, family offices, and corporates across 10+ countries worldwide.`,
    socialMessageTemplate: `💼 Join Our Team: {jobTitle}

Tristone Partners - Global leader in investment research & financial advisory

📍 Location: {location}
💰 Salary: {salaryRange}
📋 Type: {employmentType}
🎓 Experience: {experienceLevel}

What You'll Do:
• Investment research & due diligence for global clients
• Financial modeling for top-tier investment firms
• Work on diverse projects across industries

Requirements:
• {experienceLevel} in financial analysis
• Strong Excel & modeling skills
• CFA progress (preferred)

Why Tristone Partners?
🌍 Global exposure to 10+ countries
📊 Work with leading investment firms
📈 Career growth & CFA support
💡 Diverse, challenging projects

Build your finance career with us! Apply today 🚀

#FinancialAnalyst #InvestmentResearch #Hiring #{department} #Finance #CFA`
  },

  "Data Scientist": {
    role: "Data Scientist",
    category: "Engineering",
    jobDescription: `About the Role:
Tristone Partners is looking for a Data Scientist to leverage data analytics and machine learning to enhance our financial advisory services and deliver actionable insights to our global clients.

Key Responsibilities:
• Develop predictive models for investment analysis
• Analyze large financial datasets to extract insights
• Build data pipelines and automation tools
• Create data visualizations and dashboards
• Collaborate with analysts and engineers on data-driven solutions
• Apply machine learning techniques to financial problems
• Present findings to clients and stakeholders

Required Qualifications:
• 3+ years of experience in data science or analytics
• Strong programming skills (Python, R, SQL)
• Experience with machine learning frameworks (scikit-learn, TensorFlow)
• Proficiency in data visualization tools (Tableau, Power BI, or similar)
• Solid understanding of statistics and mathematics
• Experience working with large datasets

Preferred Qualifications:
• Experience in financial services or fintech
• Knowledge of time series analysis and forecasting
• Familiarity with cloud platforms (AWS, Azure, GCP)
• Advanced degree in Data Science, Statistics, or related field

What We Offer:
• Work on cutting-edge financial analytics projects
• Collaborate with global investment firms
• Access to advanced tools and technologies
• Competitive compensation and benefits
• Professional development opportunities`,
    professionalSummary: `Tristone Partners provides specialized outsourcing advisory services including investment research, due diligence, financial modeling, and accounting support to a diverse global client base of investment firms, family offices, and corporates operating across 10+ countries since 2019.`,
    socialMessageTemplate: `🤖 Now Hiring: {jobTitle}

Join Tristone Partners and apply data science to global financial services!

📍 Location: {location}
💰 Compensation: {salaryRange}
📋 Type: {employmentType}
🎯 Experience: {experienceLevel}

Your Role:
• Build ML models for investment analysis
• Work with global financial datasets
• Create insights for top investment firms

What We Seek:
• {experienceLevel} in data science
• Strong Python/R & ML expertise
• Passion for financial technology

What We Offer:
🌟 Work on cutting-edge financial analytics
🌍 Global client exposure (10+ countries)
📊 Access to advanced tools & data
🚀 High-impact, challenging projects

Transform financial services with data! Apply now 📈

#DataScience #MachineLearning #Hiring #{department} #AI #Fintech`
  }
}

// Get all available job roles
export function getAvailableRoles(): string[] {
  return Object.keys(jobTemplatesDB)
}

// Get template by role
export function getJobTemplate(role: string): JobTemplate | null {
  return jobTemplatesDB[role] || null
}

// Get roles by category
export function getRolesByCategory(category: string): string[] {
  return Object.values(jobTemplatesDB)
    .filter(template => template.category === category)
    .map(template => template.role)
}

// Get all categories
export function getCategories(): string[] {
  const categories = new Set(Object.values(jobTemplatesDB).map(t => t.category))
  return Array.from(categories)
}
