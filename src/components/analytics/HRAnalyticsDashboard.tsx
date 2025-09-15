'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Award,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw,
  Activity,
  Target,
  Clock,
  DollarSign,
  BookOpen,
  Star,
  FileText,
  Eye
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'


interface AnalyticsMetric {
  id: string
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'stable'
  color: string
  icon: React.ComponentType<any>
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: 'performance' | 'hr' | 'finance' | 'compliance'
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  lastGenerated: string
  nextScheduled?: string
  recipients: number
}

interface DashboardWidget {
  id: string
  title: string
  type: 'chart' | 'table' | 'metric' | 'list'
  data: any
  size: 'small' | 'medium' | 'large'
}

export default function HRAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([])
  const [reports, setReports] = useState<ReportTemplate[]>([])
  const [widgets, setWidgets] = useState<DashboardWidget[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'insights'>('overview')
  const [dateRange, setDateRange] = useState('last-30-days')
  const [loading, setLoading] = useState(true)

  // Chart data
  const departmentData = [
    { name: 'Mathematics', employees: 25, avgRating: 4.6, color: '#3B82F6' },
    { name: 'Science', employees: 20, avgRating: 4.4, color: '#10B981' },
    { name: 'English', employees: 18, avgRating: 4.5, color: '#F59E0B' },
    { name: 'Social Studies', employees: 15, avgRating: 4.3, color: '#EF4444' },
    { name: 'Arts', employees: 12, avgRating: 4.7, color: '#8B5CF6' },
    { name: 'Physical Ed', employees: 10, avgRating: 4.2, color: '#06B6D4' }
  ]

  const performanceTrendData = [
    { month: 'Jan', performance: 4.1, satisfaction: 4.0, attendance: 94 },
    { month: 'Feb', performance: 4.2, satisfaction: 4.1, attendance: 95 },
    { month: 'Mar', performance: 4.3, satisfaction: 4.2, attendance: 93 },
    { month: 'Apr', performance: 4.2, satisfaction: 4.3, attendance: 96 },
    { month: 'May', performance: 4.4, satisfaction: 4.2, attendance: 97 },
    { month: 'Jun', performance: 4.3, satisfaction: 4.4, attendance: 95 },
    { month: 'Jul', performance: 4.5, satisfaction: 4.3, attendance: 96 },
    { month: 'Aug', performance: 4.4, satisfaction: 4.5, attendance: 98 },
    { month: 'Sep', performance: 4.6, satisfaction: 4.4, attendance: 97 }
  ]

  const recruitmentData = [
    { name: 'Applications', value: 245, color: '#3B82F6' },
    { name: 'Interviews', value: 89, color: '#10B981' },
    { name: 'Offers', value: 34, color: '#F59E0B' },
    { name: 'Hired', value: 28, color: '#EF4444' }
  ]

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  useEffect(() => {
    // Mock data
    const mockMetrics: AnalyticsMetric[] = [
      {
        id: '1',
        title: 'Total Employees',
        value: 156,
        change: 5.2,
        trend: 'up',
        color: 'blue',
        icon: Users
      },
      {
        id: '2',
        title: 'Employee Turnover',
        value: '8.3%',
        change: -2.1,
        trend: 'down',
        color: 'green',
        icon: TrendingDown
      },
      {
        id: '3',
        title: 'Avg Performance',
        value: '4.3/5',
        change: 0.2,
        trend: 'up',
        color: 'purple',
        icon: Star
      },
      {
        id: '4',
        title: 'Training Completion',
        value: '92%',
        change: 8.5,
        trend: 'up',
        color: 'green',
        icon: BookOpen
      },
      {
        id: '5',
        title: 'Open Positions',
        value: 8,
        change: -3,
        trend: 'down',
        color: 'yellow',
        icon: Target
      },
      {
        id: '6',
        title: 'Avg Attendance',
        value: '96.2%',
        change: 1.5,
        trend: 'up',
        color: 'blue',
        icon: Clock
      }
    ]

    const mockReports: ReportTemplate[] = [
      {
        id: '1',
        name: 'Monthly Performance Summary',
        description: 'Comprehensive performance metrics for all teachers',
        category: 'performance',
        frequency: 'monthly',
        lastGenerated: '2024-09-01',
        nextScheduled: '2024-10-01',
        recipients: 5
      },
      {
        id: '2',
        name: 'HR Analytics Dashboard',
        description: 'Key HR metrics and trends analysis',
        category: 'hr',
        frequency: 'weekly',
        lastGenerated: '2024-09-10',
        nextScheduled: '2024-09-17',
        recipients: 3
      },
      {
        id: '3',
        name: 'Payroll Summary Report',
        description: 'Monthly payroll statistics and analysis',
        category: 'finance',
        frequency: 'monthly',
        lastGenerated: '2024-08-31',
        nextScheduled: '2024-09-30',
        recipients: 2
      },
      {
        id: '4',
        name: 'Compliance Training Status',
        description: 'Training completion and compliance tracking',
        category: 'compliance',
        frequency: 'quarterly',
        lastGenerated: '2024-07-01',
        nextScheduled: '2024-10-01',
        recipients: 4
      },
      {
        id: '5',
        name: 'Recruitment Pipeline Report',
        description: 'Hiring progress and candidate analytics',
        category: 'hr',
        frequency: 'weekly',
        lastGenerated: '2024-09-12',
        nextScheduled: '2024-09-19',
        recipients: 3
      }
    ]

    const mockWidgets: DashboardWidget[] = [
      {
        id: '1',
        title: 'Employee Distribution by Department',
        type: 'chart',
        size: 'medium',
        data: {
          Academic: 85,
          Administration: 25,
          Support: 20,
          Management: 15,
          Others: 11
        }
      },
      {
        id: '2',
        title: 'Performance Trends (Last 6 Months)',
        type: 'chart',
        size: 'large',
        data: [
          { month: 'Apr', performance: 4.1, satisfaction: 4.0 },
          { month: 'May', performance: 4.2, satisfaction: 4.1 },
          { month: 'Jun', performance: 4.3, satisfaction: 4.2 },
          { month: 'Jul', performance: 4.2, satisfaction: 4.3 },
          { month: 'Aug', performance: 4.4, satisfaction: 4.2 },
          { month: 'Sep', performance: 4.3, satisfaction: 4.4 }
        ]
      },
      {
        id: '3',
        title: 'Top Performers This Month',
        type: 'list',
        size: 'medium',
        data: [
          { name: 'Ms. Anjali Rao', score: 4.8, department: 'Mathematics' },
          { name: 'Mr. Suresh Kumar', score: 4.7, department: 'Science' },
          { name: 'Mrs. Priya Sharma', score: 4.6, department: 'HR' },
          { name: 'Dr. Rajesh Varma', score: 4.5, department: 'Physics' }
        ]
      }
    ]

    setTimeout(() => {
      setMetrics(mockMetrics)
      setReports(mockReports)
      setWidgets(mockWidgets)
      setLoading(false)
    }, 1000)
  }, [])

  const getTrendIcon = (trend: string, color: string) => {
    const iconClass = `w-4 h-4 ${
      trend === 'up' ? 'text-green-600' : 
      trend === 'down' ? 'text-red-600' : 
      'text-gray-600'
    }`
    
    switch (trend) {
      case 'up': return <TrendingUp className={iconClass} />
      case 'down': return <TrendingDown className={iconClass} />
      default: return <Activity className={iconClass} />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'bg-blue-100 text-blue-800'
      case 'hr': return 'bg-green-100 text-green-800'
      case 'finance': return 'bg-purple-100 text-purple-800'
      case 'compliance': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-red-100 text-red-800'
      case 'weekly': return 'bg-yellow-100 text-yellow-800'
      case 'monthly': return 'bg-blue-100 text-blue-800'
      case 'quarterly': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
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
          <h1 className="text-3xl font-bold text-gray-900">HR Analytics & Reporting</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and analytics for data-driven HR decisions</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="last-7-days">Last 7 days</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="last-90-days">Last 90 days</option>
            <option value="last-year">Last year</option>
          </select>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'reports', label: 'Reports', icon: FileText },
            { id: 'insights', label: 'Insights', icon: Activity }
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

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric) => (
              <Card key={metric.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(metric.trend, metric.color)}
                          <span className={`text-sm font-medium ${
                            metric.trend === 'up' ? 'text-green-600' : 
                            metric.trend === 'down' ? 'text-red-600' : 
                            'text-gray-600'
                          }`}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full bg-${metric.color}-100`}>
                      <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dashboard Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employee Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Employee Distribution by Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(widgets[0]?.data || {}).map(([dept, count]) => (
                    <div key={dept} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded bg-blue-500"></div>
                        <span className="text-sm font-medium">{dept}</span>
                      </div>
                      <span className="text-sm text-gray-600">{count as number} employees</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Top Performers This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {widgets[2]?.data?.map((performer: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{performer.name}</div>
                        <div className="text-sm text-gray-600">{performer.department}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold text-gray-900">{performer.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Trends */}
          <div
}
}
}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Performance Trends (Last 9 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={performanceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[3.5, 5]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="performance" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Performance Rating"
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="satisfaction" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="Employee Satisfaction"
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      name="Attendance %"
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Department Performance & Recruitment Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
}
}
}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Bar dataKey="employees" fill="#3B82F6" name="Employees" />
                      <Bar dataKey="avgRating" fill="#10B981" name="Avg Rating" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div
}
}
}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recruitment Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={recruitmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {recruitmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Report Templates */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Report Templates</CardTitle>
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Create Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{report.name}</h3>
                          <Badge className={getCategoryColor(report.category)}>
                            {report.category}
                          </Badge>
                          <Badge className={getFrequencyColor(report.frequency)}>
                            {report.frequency}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>Last generated: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                          {report.nextScheduled && (
                            <span>Next: {new Date(report.nextScheduled).toLocaleDateString()}</span>
                          )}
                          <span>{report.recipients} recipients</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Generate
                        </Button>
                        <Button size="sm">
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'September Performance Report', type: 'PDF', size: '2.4 MB', date: '2024-09-15' },
                  { name: 'Q3 HR Analytics', type: 'Excel', size: '1.8 MB', date: '2024-09-10' },
                  { name: 'Monthly Attendance Summary', type: 'PDF', size: '1.2 MB', date: '2024-09-05' },
                  { name: 'Training Completion Report', type: 'PDF', size: '3.1 MB', date: '2024-09-01' }
                ].map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">{file.name}</div>
                        <div className="text-sm text-gray-500">{file.type} • {file.size}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{file.date}</span>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900">Performance Improvement</h4>
                      <p className="text-green-800 text-sm mt-1">
                        Overall teacher performance has increased by 8.2% this quarter. Mathematics department shows the highest improvement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900">Attention Required</h4>
                      <p className="text-yellow-800 text-sm mt-1">
                        5 teachers have pending compliance training that must be completed by month-end. Schedule training sessions immediately.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Recruitment Pipeline</h4>
                      <p className="text-blue-800 text-sm mt-1">
                        3 critical positions need succession planning. Identify and start developing internal candidates for future leadership roles.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-purple-900">Recognition Opportunity</h4>
                      <p className="text-purple-800 text-sm mt-1">
                        Ms. Anjali Rao has consistently maintained 4.8+ performance rating. Consider for Teacher of the Month award.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trends Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Overall Attendance</span>
                    <span className="font-semibold text-green-600">96.2% ↑</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Teaching Staff</span>
                    <span className="font-semibold text-green-600">97.1% ↑</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Administrative Staff</span>
                    <span className="font-semibold text-yellow-600">94.8% ↓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Support Staff</span>
                    <span className="font-semibold text-green-600">95.5% ↑</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="font-semibold text-green-600">92% ↑</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Score</span>
                    <span className="font-semibold text-green-600">4.3/5 ↑</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Post-Training Performance</span>
                    <span className="font-semibold text-green-600">+12% ↑</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Certification Rate</span>
                    <span className="font-semibold text-yellow-600">78% ↓</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
