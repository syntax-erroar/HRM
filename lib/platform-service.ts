// Platform Integration Service for Job Posting
// This service handles integration with various job platforms

export interface JobPostingData {
  id: string
  title: string
  description: string
  company: string
  location: string
  salaryRange?: string
  employmentType: string
  experienceLevel: string
  department: string
  platforms: string[]
  socialMessage?: string
}

export interface PlatformResponse {
  success: boolean
  platform: string
  jobId?: string
  url?: string
  error?: string
}

export interface PublishResult {
  success: boolean
  results: PlatformResponse[]
  totalPublished: number
  errors: string[]
}

export class PlatformService {
  private static instance: PlatformService
  private apiKeys: Record<string, string> = {}

  static getInstance(): PlatformService {
    if (!PlatformService.instance) {
      PlatformService.instance = new PlatformService()
    }
    return PlatformService.instance
  }

  setApiKey(platform: string, apiKey: string): void {
    this.apiKeys[platform] = apiKey
  }

  async publishJob(jobData: JobPostingData): Promise<PublishResult> {
    const results: PlatformResponse[] = []
    const errors: string[] = []
    let totalPublished = 0

    // Simulate publishing to each platform
    for (const platform of jobData.platforms) {
      try {
        const result = await this.publishToPlatform(platform, jobData)
        results.push(result)
        
        if (result.success) {
          totalPublished++
        } else {
          errors.push(`${platform}: ${result.error}`)
        }
      } catch (error) {
        const errorResponse: PlatformResponse = {
          success: false,
          platform,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
        results.push(errorResponse)
        errors.push(`${platform}: ${errorResponse.error}`)
      }
    }

    return {
      success: totalPublished > 0,
      results,
      totalPublished,
      errors
    }
  }

  private async publishToPlatform(platform: string, jobData: JobPostingData): Promise<PlatformResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Simulate different success rates for different platforms
    const successRates: Record<string, number> = {
      linkedin: 0.95,
      indeed: 0.90,
      glassdoor: 0.85,
      angel: 0.80,
      dice: 0.75,
      ziprecruiter: 0.70
    }

    const successRate = successRates[platform] || 0.5
    const isSuccess = Math.random() < successRate

    if (isSuccess) {
      const jobId = `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const url = this.generateJobUrl(platform, jobId)
      
      return {
        success: true,
        platform,
        jobId,
        url
      }
    } else {
      const errorMessages = [
        'API rate limit exceeded',
        'Invalid job data format',
        'Authentication failed',
        'Platform temporarily unavailable',
        'Job posting quota exceeded'
      ]
      
      return {
        success: false,
        platform,
        error: errorMessages[Math.floor(Math.random() * errorMessages.length)]
      }
    }
  }

  private generateJobUrl(platform: string, jobId: string): string {
    const baseUrls: Record<string, string> = {
      linkedin: 'https://linkedin.com/jobs/view',
      indeed: 'https://indeed.com/viewjob',
      glassdoor: 'https://glassdoor.com/job-listing',
      angel: 'https://angel.co/company/jobs',
      dice: 'https://dice.com/jobs/detail',
      ziprecruiter: 'https://ziprecruiter.com/jobs'
    }

    const baseUrl = baseUrls[platform] || 'https://example.com/jobs'
    return `${baseUrl}/${jobId}`
  }

  async getJobStatus(platform: string, jobId: string): Promise<{
    status: 'active' | 'paused' | 'expired' | 'error'
    views?: number
    applications?: number
    lastUpdated?: string
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const statuses: Array<'active' | 'paused' | 'expired' | 'error'> = ['active', 'paused', 'expired']
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    return {
      status,
      views: Math.floor(Math.random() * 1000),
      applications: Math.floor(Math.random() * 50),
      lastUpdated: new Date().toISOString()
    }
  }

  async pauseJob(platform: string, jobId: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return Math.random() > 0.1 // 90% success rate
  }

  async resumeJob(platform: string, jobId: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return Math.random() > 0.1 // 90% success rate
  }

  async deleteJob(platform: string, jobId: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return Math.random() > 0.05 // 95% success rate
  }

  // Get platform-specific requirements
  getPlatformRequirements(platform: string): {
    requiredFields: string[]
    maxDescriptionLength: number
    maxTitleLength: number
    supportedFormats: string[]
  } {
    const requirements: Record<string, any> = {
      linkedin: {
        requiredFields: ['title', 'description', 'location', 'employmentType'],
        maxDescriptionLength: 5000,
        maxTitleLength: 100,
        supportedFormats: ['text', 'html']
      },
      indeed: {
        requiredFields: ['title', 'description', 'location'],
        maxDescriptionLength: 10000,
        maxTitleLength: 150,
        supportedFormats: ['text', 'html']
      },
      glassdoor: {
        requiredFields: ['title', 'description', 'location', 'salaryRange'],
        maxDescriptionLength: 8000,
        maxTitleLength: 120,
        supportedFormats: ['text', 'html']
      },
      angel: {
        requiredFields: ['title', 'description', 'location'],
        maxDescriptionLength: 3000,
        maxTitleLength: 80,
        supportedFormats: ['text']
      },
      dice: {
        requiredFields: ['title', 'description', 'location'],
        maxDescriptionLength: 6000,
        maxTitleLength: 100,
        supportedFormats: ['text', 'html']
      },
      ziprecruiter: {
        requiredFields: ['title', 'description', 'location'],
        maxDescriptionLength: 7000,
        maxTitleLength: 100,
        supportedFormats: ['text', 'html']
      }
    }

    return requirements[platform] || {
      requiredFields: ['title', 'description'],
      maxDescriptionLength: 5000,
      maxTitleLength: 100,
      supportedFormats: ['text']
    }
  }

  // Validate job data against platform requirements
  validateJobData(jobData: JobPostingData): {
    isValid: boolean
    errors: Record<string, string[]>
  } {
    const errors: Record<string, string[]> = {}
    let isValid = true

    for (const platform of jobData.platforms) {
      const requirements = this.getPlatformRequirements(platform)
      const platformErrors: string[] = []

      // Check required fields
      for (const field of requirements.requiredFields) {
        if (!jobData[field as keyof JobPostingData]) {
          platformErrors.push(`${field} is required for ${platform}`)
          isValid = false
        }
      }

      // Check description length
      if (jobData.description && jobData.description.length > requirements.maxDescriptionLength) {
        platformErrors.push(`Description too long for ${platform} (max ${requirements.maxDescriptionLength} characters)`)
        isValid = false
      }

      // Check title length
      if (jobData.title && jobData.title.length > requirements.maxTitleLength) {
        platformErrors.push(`Title too long for ${platform} (max ${requirements.maxTitleLength} characters)`)
        isValid = false
      }

      if (platformErrors.length > 0) {
        errors[platform] = platformErrors
      }
    }

    return { isValid, errors }
  }
}

export const platformService = PlatformService.getInstance()
