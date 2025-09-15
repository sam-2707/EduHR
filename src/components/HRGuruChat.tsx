'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface HRGuruChatProps {
  schoolId?: string
  className?: string
}

export default function HRGuruChat({ schoolId, className = '' }: HRGuruChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m HR Guru, your AI assistant for school administration. I can help you with teacher recruitment, performance analysis, compliance tracking, and answering HR policy questions. How can I assist you today?',
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          schoolId: schoolId || 'demo-school',
          sessionId: 'web-session-' + Date.now()
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Sorry, I couldn\'t process your request right now.',
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I\'m having trouble connecting right now. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className={`flex flex-col h-[500px] sm:h-[600px] lg:h-[700px] chat-container overflow-hidden relative ${className}`}>
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          HR Guru AI Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-scroll p-2 sm:p-4 space-y-3 sm:space-y-4 chat-messages" style={{ minHeight: '300px' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 sm:gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] rounded-lg px-3 py-2 sm:px-4 sm:py-2 chat-message ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2 sm:gap-3 justify-start">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              </div>
              <div className="bg-gray-100 rounded-lg px-3 py-2 sm:px-4 sm:py-2 flex items-center gap-2">
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                <span className="text-xs sm:text-sm text-gray-600">HR Guru is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
          {/* Extra space to ensure scrollbar visibility */}
          <div className="h-4"></div>
        </div>

        {/* Input Area */}
        <div className="border-t p-2 sm:p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask HR Guru about recruitment, performance, policies..."
              className="flex-1 text-sm chat-input"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-blue-600 hover:bg-blue-700 h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              ) : (
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Show me teacher performance analytics')}
              disabled={isLoading}
              className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 flex-shrink-0"
            >
              Performance Analytics
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Help me screen new teaching applications')}
              disabled={isLoading}
              className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 flex-shrink-0"
            >
              Recruitment Screening
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('What are the current compliance requirements?')}
              disabled={isLoading}
              className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 flex-shrink-0"
            >
              Compliance Info
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
