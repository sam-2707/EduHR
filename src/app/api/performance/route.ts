import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { teacherId, schoolId, generateInsights } = await request.json()

    if (generateInsights) {
      // Generate AI-powered performance insights
      const insights = await generatePerformanceInsights(teacherId, schoolId)
      return NextResponse.json(insights)
    }

    // Regular performance data retrieval
    const performanceData = await getPerformanceData(teacherId, schoolId)
    return NextResponse.json(performanceData)

  } catch (error) {
    console.error('Performance API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const teacherId = searchParams.get('teacherId')
    const type = searchParams.get('type') // 'overview', 'individual', 'insights'

    if (type === 'insights') {
      const insights = await generateSchoolInsights(schoolId!)
      return NextResponse.json(insights)
    }

    if (teacherId) {
      const data = await getTeacherPerformance(teacherId)
      return NextResponse.json(data)
    }

    const overview = await getSchoolPerformanceOverview(schoolId!)
    return NextResponse.json(overview)

  } catch (error) {
    console.error('Performance GET API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getPerformanceData(teacherId?: string, schoolId?: string) {
  const where: any = {}
  if (teacherId) where.teacherId = teacherId
  if (schoolId) where.teacher = { schoolId }

  const performances = await prisma.performance.findMany({
    where,
    include: {
      teacher: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          subjects: true,
          grades: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return {
    success: true,
    performances,
    stats: {
      total: performances.length,
      averageRating: performances.reduce((sum: number, p: any) => sum + p.rating, 0) / performances.length || 0,
      excellentCount: performances.filter((p: any) => p.rating >= 4.5).length,
      needsImprovementCount: performances.filter((p: any) => p.rating < 3.0).length
    }
  }
}

async function getTeacherPerformance(teacherId: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: {
      performances: {
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      attendances: {
        where: {
          date: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 3))
          }
        }
      },
      school: {
        select: { name: true, code: true }
      }
    }
  })

  if (!teacher) {
    throw new Error('Teacher not found')
  }

  // Calculate attendance rate
  const presentDays = teacher.attendances.filter((r: any) => r.status === 'PRESENT').length
  const totalDays = teacher.attendances.length
  const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0

  // Calculate performance trend
  const recentPerformances = teacher.performances.slice(0, 5)
  const averageRating = recentPerformances.reduce((sum: number, p: any) => sum + p.rating, 0) / recentPerformances.length || 0

  return {
    success: true,
    teacher: {
      ...teacher,
      stats: {
        attendanceRate: Math.round(attendanceRate),
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: teacher.performances.length,
        recentTrend: calculateTrend(recentPerformances)
      }
    }
  }
}

async function getSchoolPerformanceOverview(schoolId: string) {
  const teachers = await prisma.teacher.findMany({
    where: { schoolId },
    include: {
      performances: {
        where: {
          createdAt: {
            gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
        }
      },
      attendances: {
        where: {
          date: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 3))
          }
        }
      }
    }
  })

  const stats = {
    totalTeachers: teachers.length,
    averagePerformance: 0,
    attendanceRate: 0,
    topPerformers: 0,
    needsSupport: 0,
    departmentBreakdown: {} as Record<string, any>
  }

  teachers.forEach((teacher: any) => {
    // Performance calculations
    const avgRating = teacher.performances.reduce((sum: number, p: any) => sum + p.rating, 0) / teacher.performances.length || 0
    stats.averagePerformance += avgRating

    if (avgRating >= 4.5) stats.topPerformers++
    if (avgRating < 3.0) stats.needsSupport++

    // Attendance calculations
    const presentDays = teacher.attendances.filter((r: any) => r.status === 'PRESENT').length
    const totalDays = teacher.attendances.length
    if (totalDays > 0) {
      stats.attendanceRate += (presentDays / totalDays) * 100
    }

    // Department breakdown
    const dept = teacher.department || 'GENERAL'
    if (!stats.departmentBreakdown[dept]) {
      stats.departmentBreakdown[dept] = { count: 0, avgRating: 0, ratings: [] }
    }
    stats.departmentBreakdown[dept].count++
    stats.departmentBreakdown[dept].ratings.push(avgRating)
  })

  // Calculate averages
  stats.averagePerformance = stats.averagePerformance / teachers.length || 0
  stats.attendanceRate = stats.attendanceRate / teachers.length || 0

  // Finalize department breakdown
  Object.keys(stats.departmentBreakdown).forEach(dept => {
    const deptData = stats.departmentBreakdown[dept]
    deptData.avgRating = deptData.ratings.reduce((sum: number, r: number) => sum + r, 0) / deptData.ratings.length || 0
    delete deptData.ratings
  })

  return {
    success: true,
    stats: {
      ...stats,
      averagePerformance: Math.round(stats.averagePerformance * 10) / 10,
      attendanceRate: Math.round(stats.attendanceRate)
    }
  }
}

async function generatePerformanceInsights(teacherId: string, schoolId: string) {
  const teacher = await getTeacherPerformance(teacherId)
  const schoolOverview = await getSchoolPerformanceOverview(schoolId)

  const systemPrompt = `You are an AI performance analyst for Indian schools. Analyze this teacher's performance data and provide actionable insights.

Generate insights covering:
1. Performance Summary
2. Strengths & Growth Areas  
3. Comparison with School Average
4. Specific Recommendations
5. Risk Assessment (retention likelihood)
6. Development Opportunities

Return as JSON:
{
  "summary": "Brief performance overview",
  "strengths": ["strength1", "strength2"],
  "growthAreas": ["area1", "area2"],
  "schoolComparison": "Above/Below/At average with context",
  "recommendations": ["action1", "action2"],
  "riskLevel": "LOW/MEDIUM/HIGH",
  "retentionLikelihood": 85,
  "developmentPlan": ["step1", "step2"]
}`

  const performanceData = {
    teacher: teacher.teacher,
    schoolStats: schoolOverview.stats
  }

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(performanceData) }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.2,
    max_tokens: 1500,
    response_format: { type: 'json_object' }
  })

  const result = completion.choices[0]?.message?.content
  if (!result) {
    throw new Error('No response from Groq AI')
  }

  return {
    success: true,
    insights: JSON.parse(result),
    generatedAt: new Date().toISOString()
  }
}

async function generateSchoolInsights(schoolId: string) {
  const overview = await getSchoolPerformanceOverview(schoolId)
  
  const systemPrompt = `You are an AI analyst for Indian school administration. Analyze this school's performance data and provide strategic insights.

Generate insights covering:
1. Overall Performance Health
2. Department Analysis
3. Retention Risks
4. Improvement Opportunities
5. Resource Allocation Recommendations
6. Benchmarking Insights

Return as JSON:
{
  "healthScore": 85,
  "overallAssessment": "Brief assessment",
  "departmentInsights": {
    "topPerforming": ["dept1", "dept2"],
    "needsAttention": ["dept1"],
    "recommendations": ["rec1", "rec2"]
  },
  "retentionRisks": {
    "highRisk": 3,
    "mediumRisk": 5,
    "actionItems": ["action1", "action2"]
  },
  "opportunities": ["opp1", "opp2"],
  "resourceAllocation": ["allocation1", "allocation2"],
  "benchmarkComparison": "How school compares to standards"
}`

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(overview) }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.2,
    max_tokens: 1500,
    response_format: { type: 'json_object' }
  })

  const result = completion.choices[0]?.message?.content
  if (!result) {
    throw new Error('No response from Groq AI')
  }

  return {
    success: true,
    insights: JSON.parse(result),
    generatedAt: new Date().toISOString()
  }
}

function calculateTrend(performances: any[]) {
  if (performances.length < 2) return 'STABLE'
  
  const recent = performances.slice(0, 3)
  const older = performances.slice(3, 6)
  
  const recentAvg = recent.reduce((sum, p) => sum + p.rating, 0) / recent.length
  const olderAvg = older.reduce((sum, p) => sum + p.rating, 0) / older.length || recentAvg
  
  const difference = recentAvg - olderAvg
  
  if (difference > 0.3) return 'IMPROVING'
  if (difference < -0.3) return 'DECLINING'
  return 'STABLE'
}
