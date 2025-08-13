'use client'

import { formatDistanceToNow } from 'date-fns'
import { MapPin, Clock, Calendar, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Job {
  job_id: string
  title: string
  employer: string
  sector_category: string
  salary_min: number | null
  salary_max: number | null
  location: string
  hours_type: string
  application_deadline: string | null
  created_at: string
}

interface JobsTableProps {
  jobs: Job[]
}

export default function JobsTable({ jobs }: JobsTableProps) {
  const router = useRouter()
  
  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Not specified'
    if (min === max) return `£${min?.toLocaleString()}`
    if (!max) return `£${min?.toLocaleString()}+`
    return `£${min?.toLocaleString()} - £${max?.toLocaleString()}`
  }

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return 'Open'
    const date = new Date(deadline)
    const now = new Date()
    if (date < now) return 'Expired'
    return formatDistanceToNow(date, { addSuffix: true })
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-12 text-center">
        <p className="text-gray-500">No jobs found matching your criteria</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr 
                key={job.job_id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/jobs/${job.job_id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {job.title || 'Untitled Position'}
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {job.job_id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {job.sector_category || job.employer || 'Unknown'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                    {formatSalary(job.salary_min, job.salary_max)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {job.location || 'Isle of Man'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    {job.hours_type || 'Not specified'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {formatDeadline(job.application_deadline)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{jobs.length}</span> results
        </div>
      </div>
    </div>
  )
}