'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Download,
  Eye,
  MessageSquare,
  FileText
} from 'lucide-react'

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  position: string
  appliedDate: string
  status: 'applied' | 'screening' | 'interviewed' | 'selected' | 'rejected'
  score: number
  experience: number
  qualification: string
  resume?: string
  avatar?: string
  location: string
  expectedSalary: number
  noticePeriod: string
  interviewDate?: string
}

interface JobPosting {
  id: string
  title: string
  department: string
  type: 'full-time' | 'part-time' | 'contract'
  status: 'open' | 'closed' | 'draft'
  applicants: number
  postedDate: string
  deadline: string
}

export default function RecruitmentDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [activeTab, setActiveTab] = useState<'candidates' | 'jobs'>('candidates')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'Rohit Sharma',
        email: 'rohit.sharma@email.com',
        phone: '+91 98765 43210',
        position: 'TGT Mathematics',
        appliedDate: '2024-09-10',
        status: 'screening',
        score: 85,
        experience: 5,
        qualification: 'M.Sc Mathematics, B.Ed',
        location: 'Delhi',
        expectedSalary: 45000,
        noticePeriod: '30 days',
        interviewDate: '2024-09-20'
      },
      {
        id: '2',
        name: 'Priya Patel',
        email: 'priya.patel@email.com',
        phone: '+91 98765 43211',
        position: 'PGT English',
        appliedDate: '2024-09-08',
        status: 'interviewed',
        score: 92,
        experience: 7,
        qualification: 'MA English Literature, B.Ed',
        location: 'Mumbai',
        expectedSalary: 55000,
        noticePeriod: '60 days',
        interviewDate: '2024-09-18'
      },
      {
        id: '3',
        name: 'Amit Kumar',
        email: 'amit.kumar@email.com',
        phone: '+91 98765 43212',
        position: 'TGT Science',
        appliedDate: '2024-09-12',
        status: 'applied',
        score: 78,
        experience: 3,
        qualification: 'M.Sc Chemistry, B.Ed',
        location: 'Bangalore',
        expectedSalary: 40000,
        noticePeriod: '30 days'
      },
      {
        id: '4',
        name: 'Sunita Singh',
        email: 'sunita.singh@email.com',
        phone: '+91 98765 43213',
        position: 'PRT',
        appliedDate: '2024-09-05',
        status: 'selected',
        score: 88,
        experience: 4,
        qualification: 'B.Ed, Diploma in Early Childhood',
        location: 'Delhi',
        expectedSalary: 35000,
        noticePeriod: '15 days'
      }
    ]

    const mockJobs: JobPosting[] = [
      {
        id: '1',
        title: 'TGT Mathematics',
        department: 'Academic',
        type: 'full-time',
        status: 'open',
        applicants: 15,
        postedDate: '2024-09-01',
        deadline: '2024-09-30'
      },
      {
        id: '2',
        title: 'PGT English',
        department: 'Academic',
        type: 'full-time',
        status: 'open',
        applicants: 12,
        postedDate: '2024-08-28',
        deadline: '2024-09-25'
      },
      {
        id: '3',
        title: 'Library Assistant',
        department: 'Support',
        type: 'part-time',
        status: 'open',
        applicants: 8,
        postedDate: '2024-09-05',
        deadline: '2024-10-05'
      }
    ]

    setTimeout(() => {
      setCandidates(mockCandidates)
      setJobPostings(mockJobs)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800'
      case 'screening': return 'bg-yellow-100 text-yellow-800'
      case 'interviewed': return 'bg-purple-100 text-purple-800'
      case 'selected': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-red-100 text-red-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
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
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Recruitment & ATS</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage job postings, applications, and hiring pipeline</p>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Post New Job</span>
            <span className="sm:hidden">Post Job</span>
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm">
            <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Candidate</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Applications</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{candidates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 flex-shrink-0" />
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">In Screening</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {candidates.filter(c => c.status === 'screening').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Interviewed</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {candidates.filter(c => c.status === 'interviewed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Selected</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {candidates.filter(c => c.status === 'selected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
              activeTab === 'candidates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Candidates ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Job Postings ({jobPostings.length})
          </button>
        </nav>
      </div>

      {activeTab === 'candidates' && (
        <>
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search candidates by name or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-0 sm:min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="applied">Applied</option>
                  <option value="screening">Screening</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>

                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  <Filter className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">More Filters</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Candidates List */}
          <Card>
            <CardHeader>
              <CardTitle>Candidates ({filteredCandidates.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCandidates.map((candidate) => (
                  <div key={candidate.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                          <AvatarImage src={candidate.avatar} alt={candidate.name} />
                          <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-3">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{candidate.name}</h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={getStatusColor(candidate.status)}>
                                {candidate.status.toUpperCase()}
                              </Badge>
                              <div className="flex items-center">
                                <Star className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 ${getScoreColor(candidate.score)}`} />
                                <span className={`text-sm font-semibold ${getScoreColor(candidate.score)}`}>
                                  {candidate.score}%
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:space-x-6 mt-2 text-xs sm:text-sm text-gray-600">
                            <span className="truncate">Applied for: {candidate.position}</span>
                            <span className="whitespace-nowrap">{candidate.experience} years experience</span>
                            <span className="hidden sm:inline">{candidate.qualification}</span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:space-x-6 mt-1 text-xs sm:text-sm text-gray-500">
                            <span className="flex items-center truncate">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{candidate.email}</span>
                            </span>
                            <span className="flex items-center whitespace-nowrap">
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                              {candidate.phone}
                            </span>
                            <span className="whitespace-nowrap">Expected: ₹{candidate.expectedSalary.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap sm:flex-nowrap">
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'jobs' && (
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Job Postings ({jobPostings.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {jobPostings.map((job) => (
                <div key={job.id} className="border rounded-lg p-3 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate flex-1">{job.title}</h3>
                    <Badge className={getJobStatusColor(job.status)}>
                      {job.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    <div>Department: {job.department}</div>
                    <div>Type: {job.type}</div>
                    <div>Posted: {new Date(job.postedDate).toLocaleDateString()}</div>
                    <div>Deadline: {new Date(job.deadline).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-xs sm:text-sm font-medium text-blue-600">
                      {job.applicants} applicants
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2">Edit</Button>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2">View</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
