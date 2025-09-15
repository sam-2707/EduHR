import Groq from 'groq-sdk'

export interface HRGuruContext {
  userRole: string
  schoolId?: string
  employeeId?: string
  context?: any
}

export interface HRIntent {
  intent: string
  entities: Record<string, any>
  confidence: number
  action?: string
  parameters?: Record<string, any>
}

export class HRGuruAI {
  private getGroqClient() {
    return new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  }

  async processUserMessage(message: string, context: HRGuruContext): Promise<{
    response: string
    intent: HRIntent
    actionable: boolean
    data?: any
  }> {
    try {
      // Check if Groq API is available
      console.log('Checking Groq API key:', process.env.GROQ_API_KEY ? 'Present' : 'Missing')
      if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
        console.log('Using fallback response - API key not configured')
        return this.getFallbackResponse(message)
      }

      console.log('Using Groq AI for processing message')
      // First, analyze the intent and extract entities
      const intentAnalysis = await this.analyzeIntent(message, context)
      
      // Generate appropriate response based on intent
      const response = await this.generateResponse(message, intentAnalysis, context)
      
      // Check if this requires any action (like database queries, reports, etc.)
      const actionable = this.isActionableIntent(intentAnalysis.intent)
      
      let data = null
      if (actionable) {
        data = await this.executeAction(intentAnalysis, context)
      }
      
      return {
        response,
        intent: intentAnalysis,
        actionable,
        data
      }
    } catch (error) {
      console.error('HR Guru AI Error:', error)
      return {
        response: "I apologize, but I'm experiencing technical difficulties. Please try again or contact your HR administrator for assistance.",
        intent: { intent: 'error', entities: {}, confidence: 0 },
        actionable: false
      }
    }
  }

  private async analyzeIntent(message: string, context: HRGuruContext): Promise<HRIntent> {
    const systemPrompt = `You are HR Guru, an AI assistant for Indian schools. Analyze the user's message and extract:
    1. Intent (what they want to do)
    2. Entities (specific data they mentioned)
    3. Confidence level (0-1)
    4. Action needed (if any)
    5. Parameters for the action

    User Role: ${context.userRole}
    
    Common intents include:
    - background_check_initiation (for "Initiate police verification for new hire")
    - find_substitute_teacher (for "Who are available substitute teachers")
    - policy_question (for LTC, leave policies, compliance questions)
    - certification_expiry_report (for "teachers whose certifications are expiring")
    - document_generation (for "draft appointment letter")
    - recruitment_screening (for "screen resumes and rank candidates")
    - onboarding_checklist (for new teacher onboarding)
    - performance_analysis (for "analyze student performance data")
    - development_recommendations (for "recommend professional development")
    - payroll_calculation (for "calculate salaries")
    - attendance_anomaly (for "flag attendance anomalies")
    - retention_risk_analysis (for "identify teachers at high risk of leaving")
    - leave_application
    - compliance_check
    - teacher_performance

    Return as JSON with this structure:
    {
      "intent": "intent_name",
      "entities": {"key": "value"},
      "confidence": 0.95,
      "action": "action_name",
      "parameters": {"param": "value"}
    }`

    const groq = this.getGroqClient()
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    })

    const result = completion.choices[0]?.message?.content
    if (!result) {
      throw new Error('No response from Groq API')
    }

    return JSON.parse(result) as HRIntent
  }

  private async generateResponse(
    message: string, 
    intent: HRIntent, 
    context: HRGuruContext
  ): Promise<string> {
    const systemPrompt = `You are HR Guru, a conversational AI assistant for Indian schools. You help with HR tasks, policy questions, and administrative workflows.

    User Role: ${context.userRole}
    Intent: ${intent.intent}
    Entities: ${JSON.stringify(intent.entities)}
    
    Guidelines:
    - Be helpful, professional, and specific to Indian school systems
    - Reference relevant policies (CBSE, ICSE, State Boards)
    - Mention compliance requirements (PF, ESI, POCSO, etc.) when relevant
    - Provide actionable next steps
    - Use simple, clear language
    - Be empathetic for leave/personal matters
    
    For teachers asking about policies, provide step-by-step guidance.
    For HR staff, focus on process efficiency and compliance.
    For HODs, emphasize quick solutions and department needs.
    For principals, provide strategic insights and oversight information.`

    const groq = this.getGroqClient()
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 800
    })

    return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.'
  }

  private isActionableIntent(intent: string): boolean {
    const actionableIntents = [
      'background_check_initiation',
      'find_substitute_teacher',
      'certification_expiry_report',
      'document_generation',
      'recruitment_screening',
      'onboarding_checklist',
      'performance_analysis',
      'development_recommendations',
      'payroll_calculation',
      'attendance_anomaly',
      'retention_risk_analysis',
      'report_generation',
      'background_verification',
      'certificate_tracking',
      'payroll_query',
      'teacher_performance',
      'compliance_check'
    ]
    return actionableIntents.includes(intent)
  }

  private async executeAction(intent: HRIntent, context: HRGuruContext): Promise<any> {
    switch (intent.intent) {
      case 'background_check_initiation':
        return this.initiateBackgroundCheck(intent.entities, context)
      
      case 'find_substitute_teacher':
        return this.findSubstituteTeachers(intent.entities, context)
      
      case 'certification_expiry_report':
        return this.generateCertificationReport(intent.entities, context)
      
      case 'document_generation':
        return this.generateDocument(intent.entities, context)
      
      case 'recruitment_screening':
        return this.screenApplications(intent.entities, context)
      
      case 'onboarding_checklist':
        return this.generateOnboardingChecklist(intent.entities, context)
      
      case 'performance_analysis':
        return this.analyzePerformance(intent.entities, context)
      
      case 'development_recommendations':
        return this.recommendDevelopment(intent.entities, context)
      
      case 'payroll_calculation':
        return this.calculatePayroll(intent.entities, context)
      
      case 'attendance_anomaly':
        return this.detectAttendanceAnomalies(intent.entities, context)
      
      case 'retention_risk_analysis':
        return this.analyzeRetentionRisk(intent.entities, context)
      
      case 'report_generation':
        return this.generateReport(intent.entities, context)
      
      case 'certificate_tracking':
        return this.trackCertificates(intent.entities, context)
      
      case 'teacher_performance':
        return this.getTeacherPerformance(intent.entities, context)
      
      default:
        return null
    }
  }

  private async findSubstituteTeachers(entities: any, context: HRGuruContext): Promise<any> {
    // This would query the database for available substitute teachers
    // For now, return mock data
    return {
      availableTeachers: [
        {
          id: '1',
          name: 'Mr. Ravi Kumar',
          subjects: ['Physics', 'Mathematics'],
          grades: ['8', '9', '10'],
          experience: 5,
          availability: 'Full day',
          contact: '+91 98765 43210'
        },
        {
          id: '2',
          name: 'Ms. Priya Singh',
          subjects: ['Physics', 'Chemistry'],
          grades: ['8', '9'],
          experience: 3,
          availability: '2-5 PM',
          contact: '+91 98765 43211'
        }
      ],
      requestedSubject: entities.subject || 'Physics',
      requestedGrade: entities.grade || '8',
      requestedDate: entities.date || 'tomorrow'
    }
  }

  private async generateReport(entities: any, context: HRGuruContext): Promise<any> {
    // Mock report generation
    return {
      reportType: entities.reportType || 'certificate_expiry',
      generatedAt: new Date().toISOString(),
      data: [
        {
          teacherName: 'Ms. Anjali Sharma',
          certificateType: 'B.Ed',
          expiryDate: '2024-12-15',
          daysToExpiry: 45
        },
        {
          teacherName: 'Mr. Rohit Patel',
          certificateType: 'POCSO Training',
          expiryDate: '2024-11-30',
          daysToExpiry: 30
        }
      ]
    }
  }

  private async trackCertificates(entities: any, context: HRGuruContext): Promise<any> {
    // Mock certificate tracking
    return {
      totalTeachers: 45,
      expiringWithin30Days: 3,
      expiringWithin60Days: 7,
      upToDate: 35
    }
  }

  private async screenApplications(entities: any, context: HRGuruContext): Promise<any> {
    // Mock application screening
    return {
      totalApplications: 15,
      aiScreened: 12,
      topCandidates: [
        {
          name: 'Dr. Kavita Verma',
          score: 92,
          qualification: 'M.Sc Physics, B.Ed',
          experience: 8,
          cetScore: 85
        },
        {
          name: 'Mr. Arun Kumar',
          score: 87,
          qualification: 'M.A Mathematics, B.Ed',
          experience: 5,
          cetScore: 78
        }
      ]
    }
  }

  private async getTeacherPerformance(entities: any, context: HRGuruContext): Promise<any> {
    // Mock performance data
    return {
      teacherName: entities.teacherName || 'Ms. Priya Sharma',
      currentRating: 4.2,
      studentFeedback: 4.1,
      parentFeedback: 4.3,
      attendance: 96,
      riskScore: 0.15,
      recommendations: [
        'Continue excellent teaching methods',
        'Consider advanced training in digital pedagogy'
      ]
    }
  }

  // New methods for specific user stories

  private async initiateBackgroundCheck(entities: any, context: HRGuruContext): Promise<any> {
    // EPIC 1.1 - User Story 1: "Initiate police verification and reference check for our new hire, Anjali Verma"
    const candidateName = entities.candidate_name || entities.name || 'the candidate'
    return {
      task_id: `BGV_${Date.now()}`,
      candidate: candidateName,
      verification_types: ['police_verification', 'reference_check'],
      status: 'initiated',
      estimated_completion: '7-10 business days',
      assigned_team: 'Background Verification Team',
      next_steps: [
        'Police verification form submitted to local authority',
        'Reference check emails sent to provided contacts',
        'POCSO clearance verification initiated'
      ]
    }
  }

  private async generateCertificationReport(entities: any, context: HRGuruContext): Promise<any> {
    // EPIC 1.3 - User Story 1: "Generate a report of all teachers whose B.Ed certifications are expiring"
    const timeframe = entities.time_period || '6 months'
    const certificationType = entities.certification_type || 'B.Ed'
    
    return {
      report_id: `CERT_RPT_${Date.now()}`,
      certification_type: certificationType,
      timeframe: timeframe,
      total_teachers_affected: 12,
      urgent_cases: 3,
      teachers: [
        { name: 'Ms. Priya Sharma', subject: 'Mathematics', expiry_date: '2025-12-15', days_remaining: 92 },
        { name: 'Mr. Rajesh Kumar', subject: 'Science', expiry_date: '2026-01-20', days_remaining: 128 },
        { name: 'Mrs. Sunita Devi', subject: 'English', expiry_date: '2025-11-30', days_remaining: 77 }
      ],
      actions_required: [
        'Send renewal reminders to affected teachers',
        'Schedule certification training sessions',
        'Update compliance tracking system'
      ]
    }
  }

  private async generateDocument(entities: any, context: HRGuruContext): Promise<any> {
    // EPIC 1.3 - User Story 2: "draft an appointment letter for a new TGT Social Science teacher"
    const position = entities.position || entities.position_type || 'Teacher'
    const subject = entities.subject || 'General'
    const contractType = entities.contract_type || 'Regular'
    
    return {
      document_id: `DOC_${Date.now()}`,
      document_type: 'appointment_letter',
      position: `${position} - ${subject}`,
      contract_type: contractType,
      template_used: 'TGT_Appointment_Template_2024',
      status: 'draft_ready',
      next_steps: [
        'Review draft document',
        'Fill candidate-specific details',
        'Get principal approval',
        'Send for final signature'
      ],
      estimated_completion: '24 hours'
    }
  }

  private async generateOnboardingChecklist(entities: any, context: HRGuruContext): Promise<any> {
    // EPIC 2.1 - User Story 2: Personalized onboarding checklist
    return {
      checklist_id: `ONBOARD_${Date.now()}`,
      employee_type: 'new_teacher',
      completion_status: '0/12 completed',
      tasks: [
        { task: 'Submit joining documents', status: 'pending', priority: 'high' },
        { task: 'Complete POCSO training', status: 'pending', priority: 'high' },
        { task: 'Biometric registration', status: 'pending', priority: 'medium' },
        { task: 'School handbook review', status: 'pending', priority: 'medium' },
        { task: 'Curriculum familiarization', status: 'pending', priority: 'medium' },
        { task: 'Class allocation briefing', status: 'pending', priority: 'low' }
      ],
      estimated_completion: '2-3 weeks'
    }
  }

  private async analyzePerformance(entities: any, context: HRGuruContext): Promise<any> {
    // EPIC 2.2 - User Story 1: Analyze student performance and parent feedback for appraisal
    const teacherName = entities.teacher_name || entities.name || 'the teacher'
    
    return {
      analysis_id: `PERF_${Date.now()}`,
      teacher: teacherName,
      performance_period: 'Academic Year 2024-25',
      student_performance_score: 4.2,
      parent_feedback_score: 4.5,
      peer_evaluation_score: 4.3,
      overall_rating: 4.33,
      strengths: [
        'Excellent student engagement',
        'Strong subject knowledge',
        'Good communication with parents'
      ],
      areas_for_improvement: [
        'Digital teaching tools usage',
        'Assessment variety'
      ],
      appraisal_recommendation: 'Exceeds expectations - Recommend for promotion'
    }
  }

  private async recommendDevelopment(entities: any, context: HRGuruContext): Promise<any> {
    // EPIC 2.2 - User Story 2: Recommend professional development based on performance
    const teacherName = entities.teacher_name || entities.name || 'the teacher'
    
    return {
      recommendation_id: `DEV_${Date.now()}`,
      teacher: teacherName,
      recommendations: [
        {
          course: 'Advanced Digital Pedagogy',
          provider: 'NCERT',
          duration: '40 hours',
          relevance_score: 0.92,
          reason: 'Based on need for digital teaching enhancement'
        },
        {
          course: 'Student Assessment Strategies',
          provider: 'CBSE Training Institute',
          duration: '30 hours',
          relevance_score: 0.87,
          reason: 'To improve assessment variety and effectiveness'
        }
      ],
      career_path_alignment: 'Senior Teacher Track',
      priority: 'High'
    }
  }

  private async calculatePayroll(entities: any, context: HRGuruContext): Promise<any> {
    // EPIC 2.3 - User Story 1: Automatic salary calculation
    const employeeName = entities.employee_name || entities.name || 'the employee'
    
    return {
      payroll_id: `PAY_${Date.now()}`,
      employee: employeeName,
      pay_period: 'March 2025',
      basic_salary: 45000,
      allowances: {
        hra: 18000,
        transport: 2000,
        special: 5000
      },
      deductions: {
        pf: 5400,
        esi: 675,
        professional_tax: 200,
        tds: 3200
      },
      gross_salary: 70000,
      net_salary: 60525,
      attendance_days: 22,
      leave_days: 1,
      calculation_status: 'auto_calculated'
    }
  }

  private async detectAttendanceAnomalies(entities: any, context: HRGuruContext): Promise<any> {
    // EPIC 2.3 - User Story 2: Flag attendance anomalies
    return {
      anomaly_report_id: `ANOM_${Date.now()}`,
      scan_period: 'Last 30 days',
      anomalies_found: 5,
      flagged_cases: [
        {
          employee: 'Mr. Vikash Sharma',
          date: '2025-03-10',
          issue: 'Marked present but no biometric entry',
          severity: 'high'
        },
        {
          employee: 'Ms. Rekha Patel',
          date: '2025-03-08',
          issue: 'Multiple biometric entries',
          severity: 'medium'
        }
      ],
      recommended_actions: [
        'Manual verification required for flagged entries',
        'Update biometric system calibration',
        'Send reminder about proper attendance marking'
      ]
    }
  }

  private async analyzeRetentionRisk(entities: any, context: HRGuruContext): Promise<any> {
    // EPIC 2.4: Predictive analytics for faculty retention
    return {
      analysis_id: `RETENTION_${Date.now()}`,
      risk_assessment_date: new Date().toISOString(),
      high_risk_teachers: [
        {
          name: 'Mr. Arjun Singh',
          subject: 'Physics',
          risk_score: 0.78,
          risk_factors: ['Increased leave frequency', 'Performance decline', 'Low engagement'],
          tenure: '2 years',
          intervention_recommended: 'Career development discussion'
        },
        {
          name: 'Ms. Kavya Reddy',
          subject: 'Chemistry',
          risk_score: 0.72,
          risk_factors: ['Market salary gap', 'Limited growth opportunities'],
          tenure: '3 years',
          intervention_recommended: 'Salary review and promotion consideration'
        }
      ],
      medium_risk_teachers: 5,
      low_risk_teachers: 23,
      overall_retention_health: 'Good',
      recommendations: [
        'Focus on career development for high-risk staff',
        'Review compensation structure',
        'Implement mentorship programs'
      ]
    }
  }

  private getFallbackResponse(message: string): {
    response: string
    intent: HRIntent
    actionable: boolean
    data?: any
  } {
    const lowerMessage = message.toLowerCase()
    
    // Enhanced fallback responses for specific user stories
    
    // Background check initiation
    if (lowerMessage.includes('initiate') && (lowerMessage.includes('police') || lowerMessage.includes('verification') || lowerMessage.includes('background'))) {
      return {
        response: "I can help you initiate background verification! For police verification and reference checks, I typically create verification tasks, assign them to the appropriate team, and track progress. The process usually includes police clearance, reference verification, and POCSO certification. Would you like me to guide you through the manual process until I'm fully configured?",
        intent: { intent: 'background_check_initiation', entities: {}, confidence: 0.9 },
        actionable: true,
        data: {
          process_steps: [
            "Collect candidate's consent and documents",
            "Submit police verification application",
            "Send reference check requests",
            "Verify POCSO clearance",
            "Track completion status"
          ]
        }
      }
    }

    // Substitute teacher queries
    if (lowerMessage.includes('substitute') || lowerMessage.includes('replacement') && lowerMessage.includes('teacher')) {
      return {
        response: "I can help you find substitute teachers! I typically analyze teacher availability, subject expertise, and current schedules. For immediate needs, I recommend checking the substitute teacher database for qualified staff who match the required subject and grade level. Would you like me to guide you through the selection criteria?",
        intent: { intent: 'find_substitute_teacher', entities: {}, confidence: 0.9 },
        actionable: true,
        data: {
          selection_criteria: [
            "Subject qualification match",
            "Grade level experience",
            "Current availability",
            "Previous performance ratings",
            "Emergency contact accessibility"
          ]
        }
      }
    }

    // Certification and expiry reports
    if (lowerMessage.includes('certification') && (lowerMessage.includes('expir') || lowerMessage.includes('report'))) {
      return {
        response: "I can generate certification expiry reports! I typically track B.Ed, M.Ed, CTET, and other professional certifications. This helps ensure compliance and timely renewals. The report usually includes teacher names, subjects, expiry dates, and recommended actions. Would you like me to explain the manual tracking process?",
        intent: { intent: 'certification_expiry_report', entities: {}, confidence: 0.9 },
        actionable: true,
        data: {
          tracked_certifications: [
            "B.Ed/M.Ed degrees",
            "CTET/TET certificates",
            "Subject-specific certifications",
            "POCSO training certificates",
            "Computer literacy certificates"
          ]
        }
      }
    }

    // Document generation
    if (lowerMessage.includes('draft') || lowerMessage.includes('generate') && (lowerMessage.includes('letter') || lowerMessage.includes('document'))) {
      return {
        response: "I can help with document generation! I typically draft appointment letters, offer letters, and other HR documents using approved templates. For teaching positions, I ensure all regulatory requirements are included, such as salary structure, probation terms, and compliance clauses. Would you like guidance on the required components?",
        intent: { intent: 'document_generation', entities: {}, confidence: 0.9 },
        actionable: true,
        data: {
          document_types: [
            "Appointment letters for TGT/PGT/PRT",
            "Offer letters with salary details",
            "Probation completion letters",
            "Promotion letters",
            "Transfer orders"
          ]
        }
      }
    }

    // Payroll and salary calculations
    if (lowerMessage.includes('payroll') || lowerMessage.includes('salary') || lowerMessage.includes('calculate')) {
      return {
        response: "I can assist with payroll calculations! I typically handle automatic salary computation including basic pay, allowances (HRA, transport, special), and deductions (PF, ESI, Professional Tax, TDS). The system also factors in attendance, approved leaves, and overtime. Would you like me to explain the calculation components?",
        intent: { intent: 'payroll_calculation', entities: {}, confidence: 0.9 },
        actionable: true,
        data: {
          calculation_components: [
            "Basic salary + Grade pay",
            "HRA (based on city classification)",
            "Transport allowance",
            "PF deduction (12% of basic)",
            "ESI deduction (0.75% of gross)",
            "Professional Tax (state-specific)",
            "TDS calculation"
          ]
        }
      }
    }

    // Performance and retention analytics
    if (lowerMessage.includes('performance') || lowerMessage.includes('analytics') || lowerMessage.includes('retention')) {
      return {
        response: "Performance analytics are crucial for school management! I can help track teacher evaluations, student feedback analysis, parent satisfaction scores, and retention risk predictions. The system analyzes patterns to identify high-performing teachers and those who might need support. To access real-time analytics and AI insights, please ensure I'm properly configured with API access.",
        intent: { intent: 'performance_analysis', entities: {}, confidence: 0.9 },
        actionable: true,
        data: {
          analytics_types: [
            "Student academic performance correlation",
            "Parent feedback sentiment analysis",
            "Peer evaluation scores",
            "Leave pattern analysis",
            "Retention risk scoring",
            "Professional development recommendations"
          ]
        }
      }
    }
    
    // General recruitment queries
    if (lowerMessage.includes('recruitment') || lowerMessage.includes('hiring') || lowerMessage.includes('application') || lowerMessage.includes('screen')) {
      return {
        response: "I can help you with recruitment! For teacher hiring, I typically screen applications based on B.Ed qualification, CTET scores, subject expertise, and experience. I also rank candidates automatically and can help with interview scheduling. The system ensures compliance with RTE Act requirements and state regulations. Would you like guidance on the screening criteria?",
        intent: { intent: 'recruitment_screening', entities: {}, confidence: 0.9 },
        actionable: true,
        data: {
          screening_criteria: [
            "Essential qualifications (B.Ed/M.Ed)",
            "CTET/TET scores and validity",
            "Subject expertise and experience",
            "Language proficiency",
            "Additional certifications",
            "Reference verification"
          ]
        }
      }
    }

    // Leave and policy questions  
    if (lowerMessage.includes('leave') || lowerMessage.includes('policy') || lowerMessage.includes('ltc') || lowerMessage.includes('procedure')) {
      return {
        response: "I can help with HR policies and procedures! This includes leave policies (CL, EL, ML), LTC procedures, salary structures, and compliance requirements. I typically provide step-by-step guidance based on your school's handbook and government regulations. Would you like information about a specific policy?",
        intent: { intent: 'policy_question', entities: {}, confidence: 0.8 },
        actionable: false,
        data: {
          common_policies: [
            "Leave Travel Concession (LTC) procedure",
            "Maternity/Paternity leave policies",
            "Medical leave and reimbursement",
            "Casual and earned leave rules",
            "Transfer and posting guidelines",
            "Disciplinary procedures"
          ]
        }
      }
    }

    // Compliance and regulatory queries
    if (lowerMessage.includes('compliance') || lowerMessage.includes('cbse') || lowerMessage.includes('rte') || lowerMessage.includes('guidelines')) {
      return {
        response: "I can assist with compliance and regulatory requirements! This includes CBSE guidelines, RTE Act compliance, teacher-student ratios, qualification requirements, and documentation standards. I stay updated with the latest circulars and policy changes. Would you like information about specific compliance requirements?",
        intent: { intent: 'compliance_check', entities: {}, confidence: 0.8 },
        actionable: false,
        data: {
          compliance_areas: [
            "CBSE teacher-student ratio guidelines",
            "RTE Act qualification requirements",
            "POCSO training compliance",
            "Infrastructure standards",
            "Fee regulation compliance",
            "Academic calendar adherence"
          ]
        }
      }
    }
    
    // Default helpful response
    return {
      response: "Hello! I'm HR Guru, your AI assistant for school administration. I can help you with recruitment, performance analytics, compliance tracking, payroll management, and policy guidance. I'm designed specifically for Indian schools and understand regulations like RTE Act, CBSE guidelines, and state education policies. How can I assist you today?",
      intent: { intent: 'greeting', entities: {}, confidence: 0.7 },
      actionable: false,
      data: {
        capabilities: [
          "Teacher recruitment and screening",
          "Performance analytics and reporting",
          "Compliance and policy guidance",
          "Payroll and attendance management",
          "Document generation",
          "Background verification tracking"
        ]
      }
    }
  }
}

export const hrGuruAI = new HRGuruAI()
