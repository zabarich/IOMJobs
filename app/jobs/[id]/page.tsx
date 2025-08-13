import { supabase } from '@/lib/supabase/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Calendar, DollarSign, Building, Hash, FileText } from 'lucide-react'
import { format } from 'date-fns'

interface PageProps {
  params: { id: string }
}

async function getJob(id: string) {
  const { data, error } = await supabase
    .from('jobs_master')
    .select('*')
    .eq('job_id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function JobDetailsPage({ params }: PageProps) {
  const job = await getJob(params.id)

  if (!job) {
    notFound()
  }

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Not specified'
    if (min === max) return `£${min?.toLocaleString()}`
    if (!max) return `£${min?.toLocaleString()}+`
    return `£${min?.toLocaleString()} - £${max?.toLocaleString()}`
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'Not specified'
    try {
      return format(new Date(date), 'dd MMM yyyy')
    } catch {
      return date
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link 
        href="/jobs"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to all jobs
      </Link>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            {job.title || 'Untitled Position'}
          </h1>
          <div className="mt-2 flex items-center text-gray-600">
            <Building className="h-4 w-4 mr-2" />
            <span>{job.sector_category || job.employer || 'Unknown Employer'}</span>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <DollarSign className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Salary</p>
                  <p className="text-sm text-gray-600">
                    {formatSalary(job.salary_min, job.salary_max)}
                  </p>
                  {job.salary_text && (
                    <p className="text-xs text-gray-500 mt-1">{job.salary_text}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Hours</p>
                  <p className="text-sm text-gray-600">
                    {job.hours_type || 'Not specified'}
                  </p>
                  {job.hours_detail && (
                    <p className="text-xs text-gray-500 mt-1">{job.hours_detail}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">
                    {job.location || 'Isle of Man'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Application Deadline</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(job.application_deadline)}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Hash className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Job ID</p>
                  <p className="text-sm text-gray-600">{job.job_id}</p>
                  {job.reference_id && (
                    <>
                      <p className="text-sm font-medium text-gray-900 mt-2">Reference</p>
                      <p className="text-sm text-gray-600">{job.reference_id}</p>
                    </>
                  )}
                </div>
              </div>

              {job.duration_type && (
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600">{job.duration_type}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {job.full_description && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-sm text-gray-600 max-w-none whitespace-pre-wrap">
                {job.full_description}
              </div>
            </div>
          )}

          {job.contact_info && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {job.contact_info}
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="text-xs text-gray-500">
              <p>First seen: {formatDate(job.first_seen_date)}</p>
              <p>Last updated: {formatDate(job.last_seen_date)}</p>
              {job.end_date && <p>Ended: {formatDate(job.end_date)}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}