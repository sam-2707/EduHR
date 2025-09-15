import { NextRequest, NextResponse } from 'next/server'
import { hrGuruAI, HRGuruContext } from '@/lib/hr-guru-ai'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { message, schoolId, sessionId } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      return NextResponse.json({
        success: true,
        response: "I'm HR Guru, your AI assistant! I'd love to help you with school administration tasks like recruitment, performance analytics, and compliance tracking. However, I need to be properly configured first. Please ask your administrator to set up the Groq API key in the environment variables.",
        intent: { intent: 'greeting', entities: {} },
        actionable: false,
        data: null
      })
    }

    // Create context for HR Guru AI
    const context: HRGuruContext = {
      employeeId: sessionId || 'demo-user',
      userRole: 'ADMIN',
      schoolId: schoolId || 'demo-school'
    }

    // Create or get chat session (with fallback)
    let session = null
    try {
      session = await prisma.chatSession.findFirst({
        where: {
          userId: context.employeeId || 'demo-user',
          userRole: 'ADMIN'
        },
        orderBy: { updatedAt: 'desc' }
      })

      if (!session) {
        session = await prisma.chatSession.create({
          data: {
            userId: context.employeeId || 'demo-user',
            userRole: 'ADMIN',
            schoolId: context.schoolId || 'demo-school'
          }
        })
      }

      // Save user message
      await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          content: message,
          role: 'USER'
        }
      })
    } catch (dbError) {
      console.warn('Database operations failed, continuing without persistence:', dbError)
    }

    // Process with HR Guru AI
    const aiResponse = await hrGuruAI.processUserMessage(message, context)

    // Save AI response with intent and entities (with fallback)
    try {
      if (session) {
        await prisma.chatMessage.create({
          data: {
            sessionId: session.id,
            content: aiResponse.response,
            role: 'ASSISTANT',
            intent: aiResponse.intent.intent,
            entities: aiResponse.intent.entities as any,
            response: {
              actionable: aiResponse.actionable,
              data: aiResponse.data
            } as any
          }
        })
      }
    } catch (dbError) {
      console.warn('Failed to save AI response to database:', dbError)
    }

    return NextResponse.json({
      success: true,
      response: aiResponse.response,
      intent: aiResponse.intent,
      actionable: aiResponse.actionable,
      data: aiResponse.data,
      sessionId: session?.id || 'temp-session'
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    
    // Provide helpful error responses based on the type of error
    if (error instanceof Error && error.message.includes('GROQ_API_KEY')) {
      return NextResponse.json({
        success: true,
        response: "I'm currently not configured properly. Please ask your administrator to set up the Groq API key to enable my AI capabilities.",
        intent: { intent: 'error', entities: {} },
        actionable: false,
        data: null
      })
    }

    if (error instanceof Error && error.message.includes('Database')) {
      return NextResponse.json({
        success: true,
        response: "I'm having trouble accessing the database right now. I can still help with general HR questions, but I can't access specific school data at the moment.",
        intent: { intent: 'error', entities: {} },
        actionable: false,
        data: null
      })
    }

    // Generic helpful response
    return NextResponse.json({
      success: true,
      response: "I'm experiencing some technical difficulties right now, but I'm still here to help! You can try asking me about HR policies, recruitment guidelines, or performance management best practices.",
      intent: { intent: 'error', entities: {} },
      actionable: false,
      data: null
    })
  }
}
