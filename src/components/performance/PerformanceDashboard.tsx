'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  TrendingUp, 
  TrendingDown,
  Star,
  Target,
  BookOpen,
  Users,
  Award,
  AlertTriangle,
  Calendar,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  Clock,
  MessageSquare
} from 'lucide-react'

interface PerformanceMetric {
  id: string
  name: string
  value: number
  target: number
  trend: 'up' | 'down' | 'stable'
  change: number
}

interface Goal {
  id: string
  title: string
  description: string
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue'
  progress: number
  dueDate: string
  category: 'academic' | 'professional' | 'personal'
}

interface Teacher {
  id: string
  name: string
  position: string
  department: string
  avatar?: string
  overallRating: number
  metrics: PerformanceMetric[]
  goals: Goal[]
  lastAppraisal: string
  nextAppraisal: string
  studentFeedback: number
  parentFeedback: number
  attendance: number
  achievements: string[]
}

export default function PerformanceDashboard() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'feedback' | 'development'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    const mockTeachers: Teacher[] = [
      {
        id: '1',
        name: 'Ms. Anjali Rao',
        position: 'TGT Mathematics',
        department: 'Academic',
        overallRating: 4.5,
        lastAppraisal: '2024-03-15',
        nextAppraisal: '2024-09-15',
        studentFeedback: 4.6,
        parentFeedback: 4.4,
        attendance: 96,
        achievements: ['Best Teacher Award 2024', 'Perfect Attendance', 'Student Choice Award'],
        metrics: [
          {
            id: '1',
            name: 'Student Performance',
            value: 88,
            target: 85,
            trend: 'up',
            change: 5
          },
          {
            id: '2',
            name: 'Class Engagement',
            value: 92,
            target: 90,
            trend: 'up',
            change: 3
          },
          {
            id: '3',
            name: 'Assignment Quality',
            value: 85,
            target: 80,
            trend: 'stable',
            change: 0
          }
        ],
        goals: [
          {
            id: '1',
            title: 'Complete Advanced Mathematics Course',
            description: 'Enroll and complete online advanced mathematics teaching methodology course',
            status: 'in-progress',
            progress: 75,
            dueDate: '2024-12-31',
            category: 'professional'
          },
          {
            id: '2',
            title: 'Improve Student Engagement',
            description: 'Implement interactive teaching methods to increase student participation',
            status: 'completed',
            progress: 100,
            dueDate: '2024-06-30',
            category: 'academic'
          }
        ]
      },
      {
        id: '2',
        name: 'Mr. Rajesh Varma',
        position: 'HOD Science',
        department: 'Academic',
        overallRating: 4.3,
        lastAppraisal: '2024-03-20',
        nextAppraisal: '2024-09-20',
        studentFeedback: 4.2,
        parentFeedback: 4.5,
        attendance: 94,
        achievements: ['Department Excellence Award', 'Research Publication'],
        metrics: [
          {
            id: '1',
            name: 'Department Performance',
            value: 90,
            target: 88,
            trend: 'up',
            change: 7
          },
          {
            id: '2',
            name: 'Teacher Mentoring',
            value: 95,
            target: 90,
            trend: 'up',
            change: 2
          },
          {
            id: '3',
            name: 'Curriculum Development',
            value: 87,
            target: 85,
            trend: 'stable',
            change: 1
          }
        ],
        goals: [
          {
            id: '1',
            title: 'Complete Leadership Training',
            description: 'Attend educational leadership and management training program',
            status: 'in-progress',
            progress: 60,
            dueDate: '2024-11-30',
            category: 'professional'
          }
        ]
      }
    ]

    setTimeout(() => {
      setTeachers(mockTeachers)
      setSelectedTeacher(mockTeachers[0])
      setLoading(false)
    }, 1000)
  }, [])

  const getMetricColor = (metric: PerformanceMetric) => {
    if (metric.value >= metric.target) return 'text-green-600'
    if (metric.value >= metric.target * 0.8) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'not-started': return 'bg-gray-100 text-gray-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return <BookOpen className="w-4 h-4" />
      case 'professional': return <Award className="w-4 h-4" />
      case 'personal': return <Star className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ))
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Management</h1>
          <p className="text-gray-600 mt-1">Track and manage teacher performance, goals, and development</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Reports
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Appraisal
          </Button>
        </div>
      </div>

      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-900">4.4</p>
                  <div className="flex ml-2">
                    {getRatingStars(4.4)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Goals Achieved</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Due Appraisals</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teachers List */}
        <Card>
          <CardHeader>
            <CardTitle>Teachers ({teachers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teachers.map((teacher) => (
                <div 
                  key={teacher.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTeacher?.id === teacher.id ? 'border-blue-500 bg-blue-50' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedTeacher(teacher)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={teacher.avatar} alt={teacher.name} />
                      <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                      <p className="text-sm text-gray-600">{teacher.position}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex">
                          {getRatingStars(teacher.overallRating)}
                        </div>
                        <span className="text-sm text-gray-500">{teacher.overallRating}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Next Review</div>
                      <div className="text-sm font-medium">
                        {new Date(teacher.nextAppraisal).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Teacher Details */}
        <div className="lg:col-span-2">
          {selectedTeacher ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedTeacher.avatar} alt={selectedTeacher.name} />
                      <AvatarFallback>{getInitials(selectedTeacher.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedTeacher.name}</CardTitle>
                      <p className="text-gray-600">{selectedTeacher.position} - {selectedTeacher.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {getRatingStars(selectedTeacher.overallRating)}
                    </div>
                    <span className="font-semibold">{selectedTeacher.overallRating}</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mt-4">
                  <nav className="-mb-px flex space-x-8">
                    {[
                      { id: 'overview', label: 'Overview', icon: BarChart3 },
                      { id: 'goals', label: 'Goals', icon: Target },
                      { id: 'feedback', label: 'Feedback', icon: MessageSquare },
                      { id: 'development', label: 'Development', icon: BookOpen }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </CardHeader>

              <CardContent>
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedTeacher.studentFeedback}</div>
                        <div className="text-sm text-gray-600">Student Feedback</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{selectedTeacher.parentFeedback}</div>
                        <div className="text-sm text-gray-600">Parent Feedback</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{selectedTeacher.attendance}%</div>
                        <div className="text-sm text-gray-600">Attendance</div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Performance Metrics</h4>
                      <div className="space-y-3">
                        {selectedTeacher.metrics.map((metric) => (
                          <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div>
                                <div className="font-medium text-gray-900">{metric.name}</div>
                                <div className="text-sm text-gray-500">Target: {metric.target}%</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <div className={`text-lg font-bold ${getMetricColor(metric)}`}>
                                  {metric.value}%
                                </div>
                                <div className="flex items-center space-x-1">
                                  {getTrendIcon(metric.trend)}
                                  <span className="text-sm text-gray-500">
                                    {metric.change > 0 ? '+' : ''}{metric.change}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recent Achievements</h4>
                      <div className="space-y-2">
                        {selectedTeacher.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="text-gray-700">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'goals' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-900">Goals & Objectives</h4>
                      <Button size="sm">
                        <Target className="w-4 h-4 mr-2" />
                        Add Goal
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedTeacher.goals.map((goal) => (
                        <div key={goal.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              {getCategoryIcon(goal.category)}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-medium text-gray-900">{goal.title}</h5>
                                  <Badge className={getStatusColor(goal.status)}>
                                    {goal.status.replace('-', ' ')}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                  <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                                  <span className="capitalize">{goal.category}</span>
                                </div>
                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span>Progress</span>
                                    <span>{goal.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${goal.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'feedback' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Feedback Summary</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-2xl font-bold text-blue-600">{selectedTeacher.studentFeedback}</div>
                              <div className="text-sm text-gray-600">Student Feedback</div>
                            </div>
                            <Users className="w-8 h-8 text-blue-600" />
                          </div>
                          <div className="mt-2 text-xs text-gray-500">Based on 45 responses</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-2xl font-bold text-green-600">{selectedTeacher.parentFeedback}</div>
                              <div className="text-sm text-gray-600">Parent Feedback</div>
                            </div>
                            <MessageSquare className="w-8 h-8 text-green-600" />
                          </div>
                          <div className="mt-2 text-xs text-gray-500">Based on 28 responses</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recent Comments</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="font-medium text-blue-900">Student Feedback</div>
                          <div className="text-blue-800 text-sm mt-1">
                            "Explains concepts very clearly and makes math interesting!"
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="font-medium text-green-900">Parent Feedback</div>
                          <div className="text-green-800 text-sm mt-1">
                            "My child's grades have improved significantly. Very dedicated teacher."
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'development' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Development Plan</h4>
                      <div className="space-y-3">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="font-medium">Advanced Teaching Methodologies</div>
                              <div className="text-sm text-gray-600">Recommended based on performance analysis</div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Award className="w-5 h-5 text-purple-600" />
                            <div>
                              <div className="font-medium">Educational Technology Integration</div>
                              <div className="text-sm text-gray-600">Enhance digital teaching skills</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Upcoming Training</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">CBSE Training Workshop</div>
                            <div className="text-sm text-gray-600">November 15, 2024</div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Enrolled</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-gray-500">Select a teacher to view performance details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
