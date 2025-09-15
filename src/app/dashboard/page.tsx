'use client'

import React, { useState } from 'react'
import { useTheme } from '@/lib/useTheme'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  FileText,
  UserCheck,
  TrendingUp,
  GraduationCap,
  BarChart3,
  Menu,
  X,
  Home,
  Settings,
  LogOut
} from 'lucide-react'

// Import HR Module Components
import PersonnelDashboard from '@/components/personnel/PersonnelDashboard'
import RecruitmentDashboard from '@/components/recruitment/RecruitmentDashboard'
import OnboardingDashboard from '@/components/onboarding/OnboardingDashboard'
import PerformanceDashboard from '@/components/performance/PerformanceDashboard'
import SuccessionPlanningDashboard from '@/components/succession/SuccessionPlanningDashboard'
import HRAnalyticsDashboard from '@/components/analytics/HRAnalyticsDashboard'

type HRModule = 'personnel' | 'recruitment' | 'onboarding' | 'performance' | 'succession' | 'analytics'

const modules = [
  {
    id: 'personnel' as HRModule,
    name: 'Personnel Management',
    description: 'Employee directory and management',
    icon: Users,
    component: PersonnelDashboard
  },
  {
    id: 'recruitment' as HRModule,
    name: 'Recruitment & ATS',
    description: 'Candidate tracking and hiring',
    icon: FileText,
    component: RecruitmentDashboard
  },
  {
    id: 'onboarding' as HRModule,
    name: 'Onboarding',
    description: 'New hire integration process',
    icon: UserCheck,
    component: OnboardingDashboard
  },
  {
    id: 'performance' as HRModule,
    name: 'Performance Management',
    description: 'Teacher evaluation and feedback',
    icon: TrendingUp,
    component: PerformanceDashboard
  },
  {
    id: 'succession' as HRModule,
    name: 'Succession Planning',
    description: 'Career development and planning',
    icon: GraduationCap,
    component: SuccessionPlanningDashboard
  },
  {
    id: 'analytics' as HRModule,
    name: 'HR Analytics',
    description: 'Data insights and reporting',
    icon: BarChart3,
    component: HRAnalyticsDashboard
  }
]

export default function DashboardPage() {
  const [activeModule, setActiveModule] = useState<HRModule>('personnel')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const ActiveComponent = modules.find(m => m.id === activeModule)?.component || PersonnelDashboard

  return (
  <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} overflow-x-hidden`}> 
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-sm border-b sticky top-0 z-30`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className={`text-lg sm:text-xl font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                HR Guru Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Badge variant="secondary" className="hidden lg:inline-flex text-xs">
                School: Demo School
              </Badge>
              <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme" className="p-2">
                {theme === 'dark' ? (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                )}
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:flex p-2">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:flex p-2">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>        <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-72 sm:w-80 md:w-64 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 md:top-16`}>
          <div className="flex flex-col h-full pt-16 md:pt-0">
            <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2 overflow-y-auto">
              <h2 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 px-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>HR Modules</h2>
              {modules.map((module) => {
                const Icon = module.icon
                return (
                  <button
                    key={module.id}
                    onClick={() => {
                      setActiveModule(module.id)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-3 sm:py-4 rounded-lg text-left transition-colors touch-manipulation ${
                      activeModule === module.id
                        ? (theme === 'dark' ? 'bg-blue-900 text-blue-200 border-r-2 border-blue-500' : 'bg-blue-50 text-blue-700 border-r-2 border-blue-500')
                        : (theme === 'dark' ? 'text-white hover:bg-gray-900' : 'text-gray-700 hover:bg-gray-50')
                    }`}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm sm:text-base truncate">{module.name}</div>
                      <div className="text-xs text-gray-500 truncate">{module.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Sidebar Footer */}
            <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 text-center">
                HR Guru Platform v1.0
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 md:ml-0 min-h-screen">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Module Header */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>
                    {modules.find(m => m.id === activeModule)?.name}
                  </h2>
                  <p className={`mt-1 text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} line-clamp-2`}>
                    {modules.find(m => m.id === activeModule)?.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Badge variant="outline" className="text-green-600 border-green-600 text-xs sm:text-sm px-2 py-1">
                    Active
                  </Badge>
                  <Badge variant="secondary" className="text-xs sm:text-sm px-2 py-1">
                    Last updated: Today
                  </Badge>
                </div>
              </div>
            </div>

            {/* Module Content */}
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border overflow-hidden`}>
              <div className="p-3 sm:p-4 md:p-6">
                <ActiveComponent />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

