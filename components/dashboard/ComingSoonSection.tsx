'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, BarChart3, ArrowUpRight, Info, Calendar } from 'lucide-react'
import { differenceInDays, format } from 'date-fns'

interface PreviewPanel {
  title: string
  availableDate: string
  description: string
  metrics: string[]
  icon: React.ReactNode
}

export default function ComingSoonSection() {
  const [daysCollected, setDaysCollected] = useState(0)
  const startDate = new Date('2025-08-13')

  useEffect(() => {
    const today = new Date()
    const days = differenceInDays(today, startDate) + 1 // +1 to include start day
    setDaysCollected(Math.max(1, days))
  }, [])

  const progressPercentage = Math.min((daysCollected / 30) * 100, 100)

  const previewPanels: PreviewPanel[] = [
    {
      title: '7-Day Trends',
      availableDate: 'Available Aug 20',
      description: 'Track daily changes in job postings by sector, identify which industries are rapidly hiring or slowing down',
      metrics: ['Daily % change', 'New positions added', 'Sectors with momentum'],
      icon: <TrendingUp className="w-12 h-12 text-gray-300" />
    },
    {
      title: '30-Day Analysis',
      availableDate: 'Available Sep 12',
      description: 'Comprehensive month-over-month comparison showing sector growth rates, ranking changes, and emerging opportunities',
      metrics: ['Growth leaders', 'Declining sectors', 'Market share shifts'],
      icon: <BarChart3 className="w-12 h-12 text-gray-300" />
    },
    {
      title: 'Predictive Insights',
      availableDate: 'Available Sep 26',
      description: 'AI-powered predictions on which sectors are likely to grow based on historical patterns and seasonal trends',
      metrics: ['Projected growth', 'Seasonal patterns', 'Recommended focus sectors'],
      icon: <ArrowUpRight className="w-12 h-12 text-gray-300" />
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Sector Trends Analysis - Coming Soon
          </h3>
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-1 text-xs text-white bg-gray-800 rounded shadow-lg -left-32">
              We need at least 30 days of data to provide meaningful trend analysis and predictions
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Data collection started: {format(startDate, 'MMMM d, yyyy')}
        </p>

        {/* Progress Indicator */}
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Day {daysCollected} of 30
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}% complete
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Collecting daily job market data...</span>
          </div>
        </div>
      </div>

      {/* Preview Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {previewPanels.map((panel, index) => (
          <div key={panel.title} className="relative">
            {/* Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 relative overflow-hidden">
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
              
              {/* Available Badge */}
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-700">{panel.title}</h4>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {panel.availableDate}
                </span>
              </div>

              {/* Placeholder Chart Area */}
              <div className="flex items-center justify-center h-20 bg-gray-100 rounded-lg mb-3 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse rounded-lg" />
                {panel.icon}
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                {panel.description}
              </p>

              {/* Example Metrics */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Will include:</p>
                <div className="space-y-1">
                  {panel.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <span className="text-xs text-gray-500">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Why the wait?</p>
            <p className="text-xs">
              Meaningful trend analysis requires consistent daily data collection. We're gathering job posting patterns, 
              sector changes, and market movements to provide accurate insights and predictions when these features launch.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  )
}