import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Sample data for demonstration when database is not available
const sampleCandidates = [
  {
    id: 1,
    name: 'Anjali Verma',
    position: 'TGT Mathematics',
    email: 'anjali.verma@email.com',
    phone: '+91-9876543210',
    qualifications: {
      education: 'M.Sc Mathematics, B.Ed',
      ctet_score: 142,
      ctet_validity: '2026-08-15',
      experience: '3 years',
      subjects: ['Mathematics', 'Physics']
    },
    documents: {
      resume: 'uploaded',
      certificates: 'uploaded',
      ctet_certificate: 'verified',
      police_verification: 'pending'
    },
    screening_score: 92,
    status: 'shortlisted',
    submitted_date: '2025-03-01',
    background_check: {
      status: 'in_progress',
      police_verification: 'initiated',
      reference_check: 'pending',
      pocso_training: 'required'
    }
  },
  {
    id: 2,
    name: 'Rajesh Kumar Singh',
    position: 'PGT Physics',
    email: 'rajesh.singh@email.com',
    phone: '+91-9876543211',
    qualifications: {
      education: 'M.Sc Physics, B.Ed',
      ctet_score: 156,
      ctet_validity: '2025-12-20',
      experience: '5 years',
      subjects: ['Physics', 'Mathematics']
    },
    documents: {
      resume: 'uploaded',
      certificates: 'uploaded',
      ctet_certificate: 'verified',
      police_verification: 'completed'
    },
    screening_score: 96,
    status: 'interview_scheduled',
    submitted_date: '2025-02-28'
  }
]

// Enhanced POST endpoint to handle multiple user story actions

async function handleWithSampleData(action: string | null, searchParams: URLSearchParams) {
  switch (action) {
    case 'screen_applications':
      return NextResponse.json({
        success: true,
        message: 'Using sample data - AI screening completed',
        screening_summary: {
          total_applications: sampleCandidates.length,
          highly_recommended: 1,
          recommended: 1,
          review_required: 0
        },
        candidates: sampleCandidates.map(c => ({
          ...c,
          final_screening_score: c.screening_score,
          recommendation: c.screening_score >= 90 ? 'Highly Recommended' : 'Recommended'
        }))
      })
    
    default:
      return NextResponse.json({
        success: true,
        candidates: sampleCandidates,
        total: sampleCandidates.length,
        note: 'Using sample data for demonstration'
      })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...applicationData } = body

    // Handle different actions based on user stories
    if (action) {
      switch (action) {
        case 'initiate_background_check':
          return await handleBackgroundCheckInitiation(body)
        case 'screen_applications':
          return await handleBulkScreening(body)
        case 'rank_candidates':
          return await handleCandidateRanking(body)
        default:
          return NextResponse.json(
            { error: 'Unknown action specified' },
            { status: 400 }
          )
      }
    }

    // Default: Create new application
    const application = await prisma.application.create({
      data: {
        firstName: applicationData.firstName,
        lastName: applicationData.lastName,
        email: applicationData.email,
        phone: applicationData.phone,
        position: applicationData.position,
        subjects: applicationData.subjects,
        qualification: applicationData.qualification,
        experience: applicationData.experience,
        cetScore: applicationData.cetScore,
        resumeUrl: applicationData.resumeUrl,
        schoolId: applicationData.schoolId
      }
    })

    // AI-powered screening
    const aiAnalysis = await screenApplicationWithAI(applicationData)
    
    // Update application with AI analysis
    const updatedApplication = await prisma.application.update({
      where: { id: application.id },
      data: {
        aiScore: aiAnalysis.score,
        aiRanking: aiAnalysis.ranking,
        aiAnalysis: aiAnalysis.analysis as any,
        status: aiAnalysis.score >= 70 ? 'SCREENING' : 'SUBMITTED'
      }
    })

    return NextResponse.json({
      success: true,
      application: updatedApplication,
      aiAnalysis
    })

  } catch (error) {
    console.error('Recruitment API Error:', error)
    
    // Fallback responses for when database is not available
    if (error instanceof Error && error.message.includes('prisma')) {
      const { action } = await request.json()
      return await handleFallbackActions(action)
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// EPIC 1.1 - User Story 1: Background check initiation
async function handleBackgroundCheckInitiation(body: any) {
  const { candidate_name, candidate_id, verification_types = ['police_verification', 'reference_check'] } = body
  
  try {
    // In real implementation, create background check record in database
    const backgroundCheck = {
      task_id: `BGV_${Date.now()}`,
      candidate_name: candidate_name || 'Candidate',
      candidate_id: candidate_id || null,
      verification_types,
      status: 'initiated',
      initiated_date: new Date().toISOString(),
      estimated_completion_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      assigned_team: 'Background Verification Team',
      checklist: [
        {
          item: 'Police Verification',
          status: 'initiated',
          estimated_days: 7,
          documents_required: ['Identity proof', 'Address proof', 'Character certificate']
        },
        {
          item: 'Reference Check',
          status: 'pending',
          estimated_days: 3,
          contacts_to_verify: ['Previous employer', 'Academic reference', 'Character reference']
        },
        {
          item: 'POCSO Training Verification',
          status: 'pending',
          estimated_days: 1,
          requirement: 'Valid POCSO training completion certificate'
        },
        {
          item: 'Document Authenticity Check',
          status: 'pending',
          estimated_days: 2,
          documents: ['Educational certificates', 'Experience certificates', 'CTET certificate']
        }
      ],
      next_steps: [
        'Police verification form submitted to local authority',
        'Reference check emails sent to provided contacts',
        'POCSO clearance verification initiated',
        'Document authenticity verification in progress'
      ]
    }

    return NextResponse.json({
      success: true,
      message: `Background verification successfully initiated for ${candidate_name}`,
      background_check: backgroundCheck,
      tracking_id: backgroundCheck.task_id
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to initiate background check',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// EPIC 2.1 - User Story 1: Bulk application screening
async function handleBulkScreening(body: any) {
  const { position_filter, min_ctet_score = 120, auto_rank = true } = body
  
  try {
    const where: any = {}
    if (position_filter) {
      where.position = { contains: position_filter, mode: 'insensitive' }
    }

    const applications = await prisma.application.findMany({ where })
    
    // AI-powered screening for each application
    const screenedApplications = await Promise.all(
      applications.map(async (app) => {
        // Skip if CTET score is below minimum
        if (app.cetScore && app.cetScore < min_ctet_score) {
          return {
            ...app,
            final_screening_score: 0,
            screening_feedback: [`CTET score ${app.cetScore} below minimum requirement ${min_ctet_score}`],
            recommendation: 'Does not meet minimum requirements'
          }
        }

        const aiAnalysis = await screenApplicationWithAI({
          firstName: app.firstName,
          lastName: app.lastName,
          position: app.position,
          qualification: app.qualification,
          experience: app.experience,
          cetScore: app.cetScore,
          subjects: app.subjects
        })

        return {
          ...app,
          final_screening_score: aiAnalysis.score,
          screening_feedback: aiAnalysis.analysis,
          recommendation: aiAnalysis.score >= 90 ? 'Highly Recommended' : 
                         aiAnalysis.score >= 80 ? 'Recommended' : 
                         aiAnalysis.score >= 70 ? 'Consider for Interview' : 'Review Required'
        }
      })
    )

    // Sort by score if auto_rank is enabled
    if (auto_rank) {
      screenedApplications.sort((a, b) => b.final_screening_score - a.final_screening_score)
    }

    return NextResponse.json({
      success: true,
      message: 'Bulk application screening completed',
      screening_summary: {
        total_applications: screenedApplications.length,
        highly_recommended: screenedApplications.filter(c => c.final_screening_score >= 90).length,
        recommended: screenedApplications.filter(c => c.final_screening_score >= 80 && c.final_screening_score < 90).length,
        consider_interview: screenedApplications.filter(c => c.final_screening_score >= 70 && c.final_screening_score < 80).length,
        review_required: screenedApplications.filter(c => c.final_screening_score < 70).length
      },
      candidates: screenedApplications,
      criteria_used: {
        position_filter: position_filter || 'all positions',
        min_ctet_score,
        auto_rank,
        evaluation_factors: ['Education', 'Experience', 'CTET Score', 'Subject Match']
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to screen applications',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Enhanced candidate ranking
async function handleCandidateRanking(body: any) {
  const { position_filter, min_experience = 0, subject_filter } = body
  
  try {
    const where: any = {}
    if (position_filter) {
      where.position = { contains: position_filter, mode: 'insensitive' }
    }
    if (min_experience > 0) {
      where.experience = { gte: min_experience }
    }

    let applications = await prisma.application.findMany({
      where,
      orderBy: { aiScore: 'desc' }
    })

    // Additional filtering by subject if specified
    if (subject_filter) {
      applications = applications.filter(app => 
        app.subjects.some(subject => 
          subject.toLowerCase().includes(subject_filter.toLowerCase())
        )
      )
    }

    const rankedCandidates = applications.map((candidate, index) => ({
      rank: index + 1,
      ...candidate,
      ranking_factors: {
        ai_score: candidate.aiScore || 0,
        ctet_score: candidate.cetScore || 0,
        experience_years: candidate.experience,
        education_level: candidate.qualification.some(q => q.includes('M.')) ? 'Masters' : 'Bachelors',
        subject_match_count: candidate.subjects.length,
        qualification_strength: candidate.qualification.length
      }
    }))

    return NextResponse.json({
      success: true,
      message: 'Candidates ranked successfully',
      ranked_candidates: rankedCandidates,
      ranking_criteria: {
        primary_factor: 'AI Screening Score',
        secondary_factors: ['CTET Score', 'Experience', 'Education Level'],
        filters_applied: {
          position: position_filter || 'all',
          min_experience,
          subject: subject_filter || 'all'
        }
      },
      statistics: {
        total_candidates: rankedCandidates.length,
        average_score: rankedCandidates.reduce((sum, c) => sum + (c.aiScore || 0), 0) / rankedCandidates.length,
        top_candidates: rankedCandidates.slice(0, 5)
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to rank candidates',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function handleFallbackActions(action: string) {
  switch (action) {
    case 'initiate_background_check':
      return NextResponse.json({
        success: true,
        message: 'Background verification process initiated (Demo Mode)',
        background_check: {
          task_id: `BGV_DEMO_${Date.now()}`,
          status: 'initiated',
          note: 'This is a demonstration. In production, this would create actual verification tasks.'
        }
      })
    
    case 'screen_applications':
      return NextResponse.json({
        success: true,
        message: 'Application screening completed (Demo Mode)',
        candidates: sampleCandidates,
        note: 'Using sample data for demonstration'
      })
    
    default:
      return NextResponse.json({
        success: false,
        error: 'Action not available in demo mode'
      }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const schoolId = searchParams.get('schoolId')
    const status = searchParams.get('status')
    const position = searchParams.get('position')
    const minScore = searchParams.get('minScore')

    // Handle specific actions for user stories
    if (action === 'background_check_status') {
      return await getBackgroundCheckStatus(searchParams)
    }

    if (action === 'substitute_teachers') {
      return await getSubstituteTeachers(searchParams)
    }

    // Default: List applications with filters
    const where: any = {}
    if (schoolId) where.schoolId = schoolId
    if (status) where.status = status
    if (position) where.position = { contains: position, mode: 'insensitive' }
    if (minScore) where.aiScore = { gte: parseInt(minScore) }

    const applications = await prisma.application.findMany({
      where,
      orderBy: [
        { aiScore: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        school: {
          select: { name: true, code: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      applications,
      filters_applied: {
        schoolId: schoolId || 'all',
        status: status || 'all',
        position: position || 'all',
        minScore: minScore || 'none'
      }
    })

  } catch (error) {
    console.error('Recruitment GET API Error:', error)
    
    // Fallback to sample data if database is not available
    const action = new URL(request.url).searchParams.get('action')
    if (action === 'substitute_teachers') {
      return NextResponse.json({
        success: true,
        substitute_teachers: [
          {
            name: 'Ms. Kavya Sharma',
            subjects: ['Mathematics', 'Physics'],
            grade_levels: ['8', '9', '10'],
            availability: 'Available tomorrow',
            experience: '4 years',
            contact: '+91-9876543213',
            current_status: 'free'
          },
          {
            name: 'Mr. Arjun Patel',
            subjects: ['Physics', 'Chemistry'],
            grade_levels: ['8', '9', '10', '11', '12'],
            availability: 'Available this week',
            experience: '6 years',
            contact: '+91-9876543214',
            current_status: 'free'
          }
        ],
        note: 'Using sample data for demonstration'
      })
    }
    
    return NextResponse.json({
      success: true,
      applications: sampleCandidates,
      note: 'Using sample data due to database connectivity issues'
    })
  }
}

// EPIC 1.1 - User Story 2: Find substitute teachers
async function getSubstituteTeachers(searchParams: URLSearchParams) {
  const grade = searchParams.get('grade')
  const subject = searchParams.get('subject')
  const date = searchParams.get('date')

  // In a real implementation, this would query a substitute teachers database
  const availableSubstitutes = [
    {
      id: 1,
      name: 'Ms. Kavya Sharma',
      subjects: ['Mathematics', 'Physics'],
      grade_levels: ['6', '7', '8', '9', '10'],
      qualifications: ['M.Sc Mathematics', 'B.Ed'],
      experience: '4 years',
      contact: '+91-9876543213',
      email: 'kavya.sharma@school.edu',
      availability: {
        date: date || 'tomorrow',
        time_slots: ['09:00-10:00', '10:00-11:00', '11:30-12:30'],
        status: 'available'
      },
      performance_rating: 4.5,
      last_substitution: '2025-03-05'
    },
    {
      id: 2,
      name: 'Mr. Arjun Patel',
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      grade_levels: ['8', '9', '10', '11', '12'],
      qualifications: ['M.Sc Physics', 'B.Ed'],
      experience: '6 years',
      contact: '+91-9876543214',
      email: 'arjun.patel@school.edu',
      availability: {
        date: date || 'tomorrow',
        time_slots: ['09:00-10:00', '11:30-12:30', '14:00-15:00'],
        status: 'available'
      },
      performance_rating: 4.7,
      last_substitution: '2025-03-03'
    },
    {
      id: 3,
      name: 'Mrs. Priya Reddy',
      subjects: ['English', 'Hindi', 'Social Science'],
      grade_levels: ['6', '7', '8', '9', '10'],
      qualifications: ['M.A English', 'B.Ed'],
      experience: '5 years',
      contact: '+91-9876543215',
      email: 'priya.reddy@school.edu',
      availability: {
        date: date || 'tomorrow',
        time_slots: ['10:00-11:00', '11:30-12:30', '13:00-14:00'],
        status: 'available'
      },
      performance_rating: 4.6,
      last_substitution: '2025-03-01'
    }
  ]

  // Filter by grade and subject
  let filteredSubstitutes = availableSubstitutes.filter(teacher => {
    let matches = true
    
    if (grade) {
      matches = matches && teacher.grade_levels.includes(grade)
    }
    
    if (subject) {
      matches = matches && teacher.subjects.some(s => 
        s.toLowerCase().includes(subject.toLowerCase())
      )
    }
    
    return matches
  })

  // Sort by performance rating
  filteredSubstitutes.sort((a, b) => b.performance_rating - a.performance_rating)

  return NextResponse.json({
    success: true,
    message: `Found ${filteredSubstitutes.length} available substitute teachers`,
    substitute_teachers: filteredSubstitutes,
    search_criteria: {
      grade: grade || 'any',
      subject: subject || 'any',
      date: date || 'tomorrow'
    },
    quick_actions: filteredSubstitutes.length > 0 ? [
      'Send notification to selected substitute',
      'Update class schedule',
      'Inform students about substitute teacher'
    ] : [
      'Check with nearby schools for substitute availability',
      'Consider rescheduling the class',
      'Check if senior students can assist'
    ]
  })
}

async function getBackgroundCheckStatus(searchParams: URLSearchParams) {
  const candidateId = searchParams.get('candidateId')
  const taskId = searchParams.get('taskId')
  
  if (!candidateId && !taskId) {
    return NextResponse.json({ 
      error: 'Either candidateId or taskId is required' 
    }, { status: 400 })
  }

  // In a real implementation, this would query background check records
  const backgroundCheck = {
    task_id: taskId || `BGV_${candidateId}`,
    candidate_id: candidateId,
    status: 'in_progress',
    initiated_date: '2025-03-10',
    estimated_completion: '2025-03-17',
    completion_percentage: 65,
    checks: [
      { 
        type: 'police_verification', 
        status: 'in_progress', 
        completion_percentage: 70,
        last_updated: '2025-03-12',
        notes: 'Verification request submitted to local police station'
      },
      { 
        type: 'reference_check', 
        status: 'completed', 
        completion_percentage: 100,
        last_updated: '2025-03-11',
        notes: 'All references verified successfully'
      },
      { 
        type: 'document_verification', 
        status: 'in_progress', 
        completion_percentage: 50,
        last_updated: '2025-03-12',
        notes: 'Educational certificates verified, employment records pending'
      },
      { 
        type: 'pocso_training', 
        status: 'pending', 
        completion_percentage: 0,
        last_updated: '2025-03-10',
        notes: 'Training certificate submission pending'
      }
    ],
    next_actions: [
      'Follow up with police station for verification status',
      'Request candidate to submit POCSO training certificate',
      'Verify employment records with previous institutions'
    ]
  }

  return NextResponse.json({
    success: true,
    background_check: backgroundCheck
  })
}

async function screenApplicationWithAI(applicationData: any) {
  const systemPrompt = `You are an AI recruitment specialist for Indian schools. Analyze this teaching application and provide:

1. Overall Score (0-100) based on:
   - Educational qualifications (B.Ed/M.Ed required)
   - Subject expertise match
   - CTET/TET scores
   - Teaching experience
   - Grade level suitability

2. Detailed Analysis with:
   - Strengths
   - Areas of concern
   - Qualification match
   - Experience relevance
   - Recommendation

3. Ranking category:
   - EXCELLENT (90-100): Immediate interview
   - GOOD (70-89): Consider for interview
   - AVERAGE (50-69): Review required
   - POOR (<50): Not suitable

Position: ${applicationData.position}
Subjects: ${applicationData.subjects.join(', ')}
Qualifications: ${applicationData.qualification.join(', ')}
Experience: ${applicationData.experience} years
CTET Score: ${applicationData.cetScore || 'Not provided'}

Return as JSON:
{
  "score": 85,
  "ranking": "GOOD",
  "analysis": {
    "strengths": ["Strong B.Ed qualification", "Relevant subject expertise"],
    "concerns": ["Limited experience", "No CTET score provided"],
    "qualificationMatch": "Excellent",
    "experienceRelevance": "Good",
    "recommendation": "Recommend for interview with focus on practical teaching skills"
  }
}`

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(applicationData) }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.1,
    max_tokens: 1000,
    response_format: { type: 'json_object' }
  })

  const result = completion.choices[0]?.message?.content
  if (!result) {
    throw new Error('No response from Groq API')
  }

  return JSON.parse(result)
}
