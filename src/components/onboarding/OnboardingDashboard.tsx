'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  UserCheck, 
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  Calendar,
  Book,
  Shield,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Download
} from 'lucide-react'

interface OnboardingTask {
  id: string
  title: string
  description: string
  category: 'documents' | 'training' | 'orientation' | 'setup'
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
  dueDate: string
  assignedTo: string
  priority: 'low' | 'medium' | 'high'
  documents?: string[]
}

interface NewHire {
  id: string
  name: string
  position: string
  department: string
  joiningDate: string
  email: string
  phone: string
  avatar?: string
  completionPercentage: number
  status: 'not-started' | 'in-progress' | 'completed'
  tasks: OnboardingTask[]
  mentor?: string
}

export default function OnboardingDashboard() {
  const [newHires, setNewHires] = useState<NewHire[]>([])
  const [selectedHire, setSelectedHire] = useState<NewHire | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    const mockTasks: OnboardingTask[] = [
      {
        id: '1',
        title: 'Submit Identity Documents',
        description: 'Upload Aadhaar, PAN Card, and Passport copies',
        category: 'documents',
        status: 'completed',
        dueDate: '2024-09-15',
        assignedTo: 'HR Team',
        priority: 'high',
        documents: ['aadhaar.pdf', 'pan.pdf']
      },
      {
        id: '2',
        title: 'Educational Certificates',
        description: 'Submit degree certificates, B.Ed, and other qualifications',
        category: 'documents',
        status: 'completed',
        dueDate: '2024-09-15',
        assignedTo: 'HR Team',
        priority: 'high',
        documents: ['degree.pdf', 'bed.pdf']
      },
      {
        id: '3',
        title: 'POCSO Training',
        description: 'Complete mandatory POCSO awareness training',
        category: 'training',
        status: 'in-progress',
        dueDate: '2024-09-20',
        assignedTo: 'Training Team',
        priority: 'high'
      },
      {
        id: '4',
        title: 'IT Account Setup',
        description: 'Create email account and provide system access',
        category: 'setup',
        status: 'completed',
        dueDate: '2024-09-16',
        assignedTo: 'IT Team',
        priority: 'medium'
      },
      {
        id: '5',
        title: 'Curriculum Familiarization',
        description: 'Review CBSE curriculum and school teaching methodology',
        category: 'orientation',
        status: 'pending',
        dueDate: '2024-09-25',
        assignedTo: 'Academic Head',
        priority: 'medium'
      },
      {
        id: '6',
        title: 'School Policies Review',
        description: 'Read and acknowledge school policies and procedures',
        category: 'orientation',
        status: 'pending',
        dueDate: '2024-09-22',
        assignedTo: 'HR Team',
        priority: 'medium'
      }
    ]

    const mockNewHires: NewHire[] = [
      {
        id: '1',
        name: 'Sunita Singh',
        position: 'PRT Teacher',
        department: 'Primary',
        joiningDate: '2024-09-15',
        email: 'sunita.singh@school.edu',
        phone: '+91 98765 43210',
        completionPercentage: 65,
        status: 'in-progress',
        tasks: mockTasks,
        mentor: 'Mrs. Priya Sharma'
      },
      {
        id: '2',
        name: 'Rahul Verma',
        position: 'TGT Mathematics',
        department: 'Secondary',
        joiningDate: '2024-09-18',
        email: 'rahul.verma@school.edu',
        phone: '+91 98765 43211',
        completionPercentage: 25,
        status: 'in-progress',
        tasks: mockTasks.map(task => ({ ...task, status: task.id <= '2' ? 'completed' : 'pending' })),
        mentor: 'Mr. Rajesh Varma'
      },
      {
        id: '3',
        name: 'Kavya Krishnan',
        position: 'TGT Science',
        department: 'Secondary',
        joiningDate: '2024-09-20',
        email: 'kavya.krishnan@school.edu',
        phone: '+91 98765 43212',
        completionPercentage: 10,
        status: 'not-started',
        tasks: mockTasks.map(task => ({ ...task, status: 'pending' })),
        mentor: 'Dr. Suresh Kumar'
      }
    ]

    setTimeout(() => {
      setNewHires(mockNewHires)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'not-started': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'documents': return <FileText className="w-4 h-4" />
      case 'training': return <GraduationCap className="w-4 h-4" />
      case 'orientation': return <Book className="w-4 h-4" />
      case 'setup': return <Shield className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Employee Onboarding</h1>
          <p className="text-gray-600 mt-1">Manage new hire onboarding process and track progress</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserCheck className="w-4 h-4 mr-2" />
          Create Onboarding Plan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Onboarding</p>
                <p className="text-2xl font-bold text-gray-900">{newHires.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {newHires.filter(h => h.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {newHires.filter(h => h.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {newHires.reduce((acc, hire) => 
                    acc + hire.tasks.filter(task => task.status === 'overdue').length, 0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Hires List */}
        <Card>
          <CardHeader>
            <CardTitle>New Hires ({newHires.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {newHires.map((hire) => (
                <div 
                  key={hire.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedHire?.id === hire.id ? 'border-blue-500 bg-blue-50' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedHire(hire)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={hire.avatar} alt={hire.name} />
                        <AvatarFallback>{getInitials(hire.name)}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900">{hire.name}</h3>
                        <p className="text-sm text-gray-600">{hire.position}</p>
                        <p className="text-xs text-gray-500">
                          Joining: {new Date(hire.joiningDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={getStatusColor(hire.status)}>
                        {hire.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <div className="flex items-center mt-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${hire.completionPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {hire.completionPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedHire ? `${selectedHire.name} - Onboarding Progress` : 'Select a new hire to view details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedHire ? (
              <div className="space-y-6">
                {/* Employee Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedHire.avatar} alt={selectedHire.name} />
                      <AvatarFallback>{getInitials(selectedHire.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{selectedHire.name}</h3>
                      <p className="text-gray-600">{selectedHire.position} - {selectedHire.department}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {selectedHire.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {selectedHire.phone}
                        </span>
                      </div>
                      {selectedHire.mentor && (
                        <p className="text-sm text-blue-600 mt-1">
                          Mentor: {selectedHire.mentor}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Onboarding Tasks</h4>
                  <div className="space-y-3">
                    {selectedHire.tasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">
                              {getCategoryIcon(task.category)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h5 className="font-medium text-gray-900">{task.title}</h5>
                                <Badge className={getStatusColor(task.status)}>
                                  {task.status.replace('-', ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                <span>Assigned to: {task.assignedTo}</span>
                                <span className={getPriorityColor(task.priority)}>
                                  {task.priority.toUpperCase()} Priority
                                </span>
                              </div>
                              {task.documents && task.documents.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500 mb-1">Documents:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {task.documents.map((doc, index) => (
                                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {doc}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            {task.status === 'pending' && (
                              <>
                                <Button variant="outline" size="sm">
                                  <Upload className="w-4 h-4 mr-1" />
                                  Upload
                                </Button>
                                <Button size="sm">
                                  Mark Complete
                                </Button>
                              </>
                            )}
                            {task.status === 'completed' && task.documents && (
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a new hire from the list to view their onboarding progress</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
