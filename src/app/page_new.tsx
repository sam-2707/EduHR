import HRGuruChat from '@/components/HRGuruChat'
import { Bot, Users, TrendingUp, Shield, Award, FileText } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">HR Guru Platform</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
              <a href="#demo" className="text-gray-600 hover:text-blue-600">Demo</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              AI-Powered HR Platform for{' '}
              <span className="text-blue-600">Indian Schools</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your school's HR management with our intelligent assistant. 
              From recruitment to performance analytics, HR Guru handles it all.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Try HR Guru Now
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Comprehensive HR Management
            </h3>
            <p className="text-base sm:text-lg text-gray-600">
              Everything you need to manage your school's human resources efficiently
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* AI Recruitment */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mb-4" />
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Recruitment
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Automatically screen candidates, rank applications, and identify the best teaching talent for your school.
              </p>
            </div>

            {/* Performance Analytics */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mb-4" />
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Performance Analytics
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Track teacher performance, predict retention risks, and generate actionable insights for professional development.
              </p>
            </div>

            {/* Compliance Tracking */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600 mb-4" />
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Compliance Management
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Stay compliant with RTE Act, state regulations, and educational board requirements automatically.
              </p>
            </div>

            {/* Payroll Automation */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
              <Award className="h-10 w-10 sm:h-12 sm:w-12 text-orange-600 mb-4" />
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Smart Payroll
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Automated salary calculations with deductions, allowances, and compliance with 7th Pay Commission.
              </p>
            </div>

            {/* Document Management */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-red-600 mb-4" />
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Document Hub
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Centralized storage for certificates, contracts, and records with intelligent organization and search.
              </p>
            </div>

            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl">
              <Bot className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-600 mb-4" />
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                HR Guru Assistant
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Get instant answers to HR questions, policy guidance, and administrative support 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="demo" className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Try HR Guru AI Assistant
            </h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Experience our AI-powered HR assistant designed specifically for Indian schools. 
              Ask questions about recruitment, performance management, or compliance requirements.
            </p>
          </div>

          <div className="max-w-4xl mx-auto px-2 sm:px-4">
            <HRGuruChat schoolId="demo-school" className="shadow-2xl w-full" />
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-sm sm:text-base text-gray-300">Schools Using Platform</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">15,000+</div>
              <div className="text-sm sm:text-base text-gray-300">Teachers Managed</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">95%</div>
              <div className="text-sm sm:text-base text-gray-300">Time Savings</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-orange-400 mb-2">99.9%</div>
              <div className="text-sm sm:text-base text-gray-300">Uptime Reliability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <Bot className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-gray-900 font-semibold">HR Guru Platform</span>
            </div>
            <div className="text-sm sm:text-base text-gray-600">
              © 2024 HR Guru. Made for Indian Schools.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
