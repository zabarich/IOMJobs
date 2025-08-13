'use client'

import { useRouter } from 'next/navigation'
import { Building2, Briefcase, AlertTriangle, Users } from 'lucide-react'

interface Agency {
  name: string
  count: number
}

interface SuspectedDuplicate {
  title: string
  agencies: string[]
  count: number
}

interface RecruitmentAgenciesProps {
  agencies: Agency[]
  totalAgencyJobs: number
  totalJobs: number
  suspectedDuplicates: SuspectedDuplicate[]
}

export default function RecruitmentAgencies({ 
  agencies, 
  totalAgencyJobs, 
  totalJobs,
  suspectedDuplicates 
}: RecruitmentAgenciesProps) {
  const router = useRouter()
  
  const handleAgencyClick = (agencyName: string) => {
    router.push(`/jobs?employer=${encodeURIComponent(agencyName)}`)
  }
  
  const agencyPercentage = totalJobs > 0 ? Math.round((totalAgencyJobs / totalJobs) * 100) : 0
  const duplicateCount = suspectedDuplicates?.reduce((sum, d) => sum + (d.count - 1), 0) || 0
  
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          Recruitment Agencies
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Agencies connecting talent with opportunities
        </p>
      </div>
      
      {/* Duplicate Warning Section */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-amber-900 mb-2">Note on Agency Listings</h4>
            <ul className="text-xs text-amber-800 space-y-1">
              <li>• Total agency postings: {totalAgencyJobs}</li>
              <li>• Multiple agencies often advertise the same role</li>
              <li>• Actual unique positions may be significantly fewer</li>
              <li>• For accurate counts, check directly with employers</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Key Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-600">Total Postings</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{totalAgencyJobs}</p>
          <p className="text-xs text-gray-500">{agencyPercentage}% of all listings</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-600">Active Agencies</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{agencies.length}</p>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-3 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-orange-600" />
            <span className="text-xs text-gray-600">Suspected Duplicates</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{duplicateCount}</p>
          <p className="text-xs text-gray-500">Same title matches</p>
        </div>
      </div>
      
      {/* Top Agencies List */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Top Recruitment Agencies</h4>
        {agencies.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No recruitment agencies found
          </p>
        ) : (
          agencies.slice(0, 10).map((agency, index) => (
            <div 
              key={agency.name} 
              className="flex items-center justify-between hover:bg-gray-50 rounded-md px-2 py-1 cursor-pointer transition-colors"
              onClick={() => handleAgencyClick(agency.name)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500 w-6">
                  #{index + 1}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline">
                    {agency.name}
                  </span>

                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-blue-600">
                  {agency.count} jobs
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Suspected Duplicates Section */}
      {suspectedDuplicates && suspectedDuplicates.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Potential Duplicate Listings (Exact Title Matches)</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            {suspectedDuplicates.slice(0, 5).map((duplicate, index) => (
              <div key={index} className="flex items-start justify-between text-xs border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{duplicate.title}</p>
                  <p className="text-gray-600 mt-0.5">
                    Posted by {duplicate.count} agencies: {duplicate.agencies.slice(0, 3).join(', ')}
                    {duplicate.agencies.length > 3 && ` +${duplicate.agencies.length - 3} more`}
                  </p>
                </div>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  {duplicate.count}x
                </span>
              </div>
            ))}
            {suspectedDuplicates.length > 5 && (
              <p className="text-xs text-gray-500 italic pt-2">
                And {suspectedDuplicates.length - 5} more potential duplicates...
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Future Enhancement Note */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>📊 Future Enhancement:</strong> We're planning to add manual duplicate verification where users can confirm which jobs are truly the same position, building more accurate deduplication over time.
        </p>
      </div>
    </div>
  )
}