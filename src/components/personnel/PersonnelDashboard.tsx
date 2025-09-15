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
  Download,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase
} from 'lucide-react'

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  joinDate: string
  status: 'active' | 'inactive' | 'on-leave'
  avatar?: string
  employeeId: string
  qualification: string
  experience: number
  location: string
}

export default function PersonnelDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [loading, setLoading] = useState(true)

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockEmployees: Employee[] = [
      {
        id: '1',
        name: 'Mrs. Priya Sharma',
        email: 'priya.sharma@school.edu',
        phone: '+91 98765 43210',
        position: 'HR Head',
        department: 'Administration',
        joinDate: '2020-01-15',
        status: 'active',
        employeeId: 'EMP001',
        qualification: 'MBA HR, B.Ed',
        experience: 8,
        location: 'Delhi'
      },
      {
        id: '2',
        name: 'Mr. Rajesh Varma',
        email: 'rajesh.varma@school.edu',
        phone: '+91 98765 43211',
        position: 'HOD Science',
        department: 'Academic',
        joinDate: '2019-06-01',
        status: 'active',
        employeeId: 'EMP002',
        qualification: 'M.Sc Physics, B.Ed',
        experience: 12,
        location: 'Delhi'
      },
      {
        id: '3',
        name: 'Ms. Anjali Rao',
        email: 'anjali.rao@school.edu',
        phone: '+91 98765 43212',
        position: 'TGT Mathematics',
        department: 'Academic',
        joinDate: '2021-04-10',
        status: 'active',
        employeeId: 'EMP003',
        qualification: 'M.Sc Mathematics, B.Ed',
        experience: 5,
        location: 'Delhi'
      },
      {
        id: '4',
        name: 'Dr. Suresh Kumar',
        email: 'suresh.kumar@school.edu',
        phone: '+91 98765 43213',
        position: 'Principal',
        department: 'Administration',
        joinDate: '2018-01-01',
        status: 'active',
        employeeId: 'EMP004',
        qualification: 'Ph.D Education, M.Ed',
        experience: 25,
        location: 'Delhi'
      },
      {
        id: '5',
        name: 'Ms. Kavita Singh',
        email: 'kavita.singh@school.edu',
        phone: '+91 98765 43214',
        position: 'TGT English',
        department: 'Academic',
        joinDate: '2022-07-15',
        status: 'on-leave',
        employeeId: 'EMP005',
        qualification: 'MA English, B.Ed',
        experience: 3,
        location: 'Delhi'
      }
    ]
    
    setTimeout(() => {
      setEmployees(mockEmployees)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const departments = ['all', ...Array.from(new Set(employees.map(emp => emp.department)))]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'on-leave': return 'bg-yellow-100 text-yellow-800'
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
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Personnel Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage all school staff and employee information</p>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm whitespace-nowrap">
          <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="hidden sm:inline">Add New Employee</span>
          <span className="sm:hidden">Add Employee</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Employees</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Active Staff</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {employees.filter(emp => emp.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center">
              <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Teaching Staff</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {employees.filter(emp => emp.department === 'Academic').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center">
              <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 flex-shrink-0" />
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Admin Staff</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {employees.filter(emp => emp.department === 'Administration').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees by name, ID, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-0 sm:min-w-[140px]"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>

            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Filter className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">More Filters</span>
            </Button>

            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Download className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Employee Directory ({filteredEmployees.length} employees)</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-3">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{employee.name}</h3>
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:space-x-6 mt-2 text-xs sm:text-sm text-gray-600">
                        <span className="flex items-center truncate">
                          <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{employee.position}</span>
                        </span>
                        <span className="flex items-center whitespace-nowrap">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          {employee.department}
                        </span>
                        <span className="flex items-center whitespace-nowrap">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span className="hidden sm:inline">Joined </span>{new Date(employee.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:space-x-6 mt-1 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center truncate">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{employee.email}</span>
                        </span>
                        <span className="flex items-center whitespace-nowrap">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          {employee.phone}
                        </span>
                        <span className="flex items-center whitespace-nowrap">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          {employee.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2">
                      <span className="hidden sm:inline">View Profile</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="px-2 py-1 sm:px-3 sm:py-2">
                      <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
