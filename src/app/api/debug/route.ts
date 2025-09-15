import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    hasGroqApiKey: !!process.env.GROQ_API_KEY,
    keyLength: process.env.GROQ_API_KEY?.length || 0,
    keyPreview: process.env.GROQ_API_KEY ? `${process.env.GROQ_API_KEY.substring(0, 10)}...` : 'Not found'
  })
}
