'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  TrendingUp, 
  BookOpen,
  Award,
  Target,
  Users,
  Calendar,
  Clock,
  Star,
  ChevronRight,
  GraduationCap,
  Briefcase,
  ArrowUp,
  Building,
  FileText,
  CheckCircle,
  Play,
  Download,
  Plus
} from 'lucide-react'

interface LearningPath {
  id: string
  title: string
  description: string
  category: 'technical' | 'leadership' | 'soft-skills' | 'compliance'
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  progress: number
  status: 'not-started' | 'in-progress' | 'completed'
  modules: number
  completedModules: number
  dueDate?: string
}

interface SuccessionCandidate {
  id: string
  name: string
  currentPosition: string
  targetPosition: string
  department: string
  readinessLevel: number
  avatar?: string
  strengths: string[]
  developmentAreas: string[]
  learningPaths: LearningPath[]
  mentor?: string
  estimatedReadyDate: string
}

interface Position {
  id: string
  title: string
  department: string
  level: 'junior' | 'mid' | 'senior' | 'leadership'
  criticality: 'low' | 'medium' | 'high'
  currentHolder: string
  retirementDate?: string
  candidates: SuccessionCandidate[]
}

export default function SuccessionPlanningDashboard() {
  const [positions, setPositions] = useState<Position[]>([])
  const [candidates, setCandidates] = useState<SuccessionCandidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<SuccessionCandidate | null>(null)
  const [activeTab, setActiveTab] = useState<'succession' | 'development' | 'training'>('succession')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    const mockLearningPaths: LearningPath[] = [
      {
        id: '1',
        title: 'Educational Leadership Fundamentals',
        description: 'Core leadership skills for educational administrators',
        category: 'leadership',
        level: 'intermediate',
        duration: '8 weeks',
        progress: 75,
        status: 'in-progress',
        modules: 8,
        completedModules: 6,
        dueDate: '2024-11-30'
      },
      {
        id: '2',
        title: 'Advanced Teaching Methodologies',
        description: 'Modern teaching techniques and classroom management',
        category: 'technical',
        level: 'advanced',
        duration: '6 weeks',
        progress: 100,
        status: 'completed',
        modules: 6,
        completedModules: 6
      },
      {
        id: '3',
        title: 'POCSO Compliance Training',
        description: 'Mandatory compliance training for child protection',
        category: 'compliance',
        level: 'beginner',
        duration: '2 weeks',
        progress: 0,
        status: 'not-started',
        modules: 4,
        completedModules: 0,
        dueDate: '2024-10-15'
      }
    ]

    const mockCandidates: SuccessionCandidate[] = [
      {
        id: '1',
        name: 'Ms. Anjali Rao',
        currentPosition: 'TGT Mathematics',
        targetPosition: 'HOD Mathematics',
        department: 'Academic',
        readinessLevel: 85,
        strengths: ['Strong subject knowledge', 'Good communication', 'Student engagement'],
        developmentAreas: ['Leadership skills', 'Administrative experience', 'Team management'],
        learningPaths: mockLearningPaths,
        mentor: 'Mr. Rajesh Varma',
        estimatedReadyDate: '2025-03-01'
      },
      {
        id: '2',
        name: 'Mr. Suresh Kumar',
        currentPosition: 'HOD Science',
        targetPosition: 'Vice Principal',
        department: 'Administration',
        readinessLevel: 70,
        strengths: ['Leadership experience', 'Strategic thinking', 'Problem solving'],
        developmentAreas: ['Financial management', 'Policy development', 'Stakeholder management'],
        learningPaths: mockLearningPaths.slice(0, 2),
        mentor: 'Dr. Principal',
        estimatedReadyDate: '2025-06-01'
      }
    ]

    const mockPositions: Position[] = [
      {
        id: '1',
        title: 'HOD Mathematics',
        department: 'Academic',
        level: 'senior',
        criticality: 'high',
        currentHolder: 'Mr. Ramesh Gupta',
        retirementDate: '2025-03-31',
        candidates: [mockCandidates[0]]
      },
      {
        id: '2',
        title: 'Vice Principal',
        department: 'Administration',
        level: 'leadership',
        criticality: 'high',
        currentHolder: 'Mrs. Sunita Sharma',
        retirementDate: '2025-07-31',
        candidates: [mockCandidates[1]]
      }
    ]

    setTimeout(() => {
      setPositions(mockPositions)
      setCandidates(mockCandidates)
      setSelectedCandidate(mockCandidates[0])
      setLoading(false)
    }, 1000)
  }, [])

  const getReadinessColor = (level: number) => {
    if (level >= 80) return 'text-green-600'
    if (level >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'not-started': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800'
      case 'leadership': return 'bg-purple-100 text-purple-800'
      case 'soft-skills': return 'bg-green-100 text-green-800'
      case 'compliance': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
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
          <h1 className="text-3xl font-bold text-gray-900">Succession Planning & Learning Development</h1>
          <p className="text-gray-600 mt-1">Plan career progression and manage professional development</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export Plans
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Key Positions</p>
                <p className="text-2xl font-bold text-gray-900">{positions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ready Successors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {candidates.filter(c => c.readinessLevel >= 80).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Learning Paths</p>
                <p className="text-2xl font-bold text-gray-900">
                  {candidates.reduce((acc, c) => acc + c.learningPaths.filter(lp => lp.status === 'in-progress').length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Courses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {candidates.reduce((acc, c) => acc + c.learningPaths.filter(lp => lp.status === 'completed').length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'succession', label: 'Succession Planning', icon: ArrowUp },
            { id: 'development', label: 'Career Development', icon: Target },
            { id: 'training', label: 'Training Programs', icon: GraduationCap }
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

      {activeTab === 'succession' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical Positions */}
          <Card>
            <CardHeader>
              <CardTitle>Critical Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positions.map((position) => (
                  <div key={position.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{position.title}</h3>
                        <p className="text-sm text-gray-600">{position.department}</p>
                        <p className="text-xs text-gray-500">Current: {position.currentHolder}</p>
                      </div>
                      <Badge className={getCriticalityColor(position.criticality)}>
                        {position.criticality.toUpperCase()}
                      </Badge>
                    </div>
                    
                    {position.retirementDate && (
                      <div className="text-sm text-red-600 mb-3">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Retirement: {new Date(position.retirementDate).toLocaleDateString()}
                      </div>
                    )}
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Succession Candidates ({position.candidates.length})
                      </div>
                      <div className="space-y-2">
                        {position.candidates.map((candidate) => (
                          <div key={candidate.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={candidate.avatar} alt={candidate.name} />
                                <AvatarFallback className="text-xs">{getInitials(candidate.name)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{candidate.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-semibold ${getReadinessColor(candidate.readinessLevel)}`}>
                                {candidate.readinessLevel}%
                              </span>
                              <span className="text-xs text-gray-500">ready</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Succession Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle>Succession Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div 
                    key={candidate.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedCandidate?.id === candidate.id ? 'border-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={candidate.avatar} alt={candidate.name} />
                        <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                        <div className="text-sm text-gray-600">
                          {candidate.currentPosition} → {candidate.targetPosition}
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500">Readiness:</span>
                            <span className={`text-sm font-semibold ${getReadinessColor(candidate.readinessLevel)}`}>
                              {candidate.readinessLevel}%
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Ready by: {new Date(candidate.estimatedReadyDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'development' && selectedCandidate && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidate Info */}
          <Card>
            <CardHeader>
              <CardTitle>Development Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <Avatar className="h-16 w-16 mx-auto mb-3">
                  <AvatarImage src={selectedCandidate.avatar} alt={selectedCandidate.name} />
                  <AvatarFallback>{getInitials(selectedCandidate.name)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-gray-900">{selectedCandidate.name}</h3>
                <p className="text-sm text-gray-600">{selectedCandidate.currentPosition}</p>
                <p className="text-xs text-blue-600">Target: {selectedCandidate.targetPosition}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Readiness Level</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${selectedCandidate.readinessLevel}%` }}
                      ></div>
                    </div>
                    <span className={`font-semibold ${getReadinessColor(selectedCandidate.readinessLevel)}`}>
                      {selectedCandidate.readinessLevel}%
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                  <div className="space-y-1">
                    {selectedCandidate.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Development Areas</h4>
                  <div className="space-y-1">
                    {selectedCandidate.developmentAreas.map((area, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedCandidate.mentor && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Mentor</h4>
                    <p className="text-sm text-blue-600">{selectedCandidate.mentor}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Learning Paths */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Learning & Development Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedCandidate.learningPaths.map((path) => (
                    <div key={path.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{path.title}</h4>
                            <Badge className={getStatusColor(path.status)}>
                              {path.status.replace('-', ' ')}
                            </Badge>
                            <Badge className={getCategoryColor(path.category)}>
                              {path.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{path.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{path.duration}</span>
                            <span>{path.level} level</span>
                            <span>{path.completedModules}/{path.modules} modules</span>
                            {path.dueDate && (
                              <span>Due: {new Date(path.dueDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{path.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${path.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex space-x-2">
                          {path.status === 'not-started' && (
                            <Button size="sm">
                              <Play className="w-4 h-4 mr-1" />
                              Start Course
                            </Button>
                          )}
                          {path.status === 'in-progress' && (
                            <Button size="sm">
                              <BookOpen className="w-4 h-4 mr-1" />
                              Continue
                            </Button>
                          )}
                          {path.status === 'completed' && (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Certificate
                            </Button>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'training' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Training Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Educational Leadership Certificate',
                    category: 'leadership',
                    duration: '12 weeks',
                    level: 'advanced',
                    enrolled: 5,
                    description: 'Comprehensive leadership training for educational administrators'
                  },
                  {
                    title: 'Digital Teaching Methods',
                    category: 'technical',
                    duration: '6 weeks',
                    level: 'intermediate',
                    enrolled: 12,
                    description: 'Modern technology integration in classroom teaching'
                  },
                  {
                    title: 'Effective Communication',
                    category: 'soft-skills',
                    duration: '4 weeks',
                    level: 'beginner',
                    enrolled: 8,
                    description: 'Enhance communication skills for better stakeholder management'
                  }
                ].map((program, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{program.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getCategoryColor(program.category)}>
                          {program.category}
                        </Badge>
                        <Badge variant="outline">{program.level}</Badge>
                        <Badge variant="outline">{program.duration}</Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {program.enrolled} staff enrolled
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">Enroll</Button>
                      <Button variant="outline" size="sm">Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
