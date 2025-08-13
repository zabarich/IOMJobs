'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import JobsTable from '@/components/jobs/JobsTable'
import SearchBar from '@/components/jobs/SearchBar'
import Filters from '@/components/jobs/Filters'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

const JOBS_PER_PAGE = 25

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployer, setSelectedEmployer] = useState('')
  const [employers, setEmployers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobs()
    setCurrentPage(1)
  }, [searchTerm, selectedEmployer, jobs])

  async function fetchJobs() {
    try {
      const { data, error } = await supabase
        .from('jobs_master')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setJobs(data)
        setFilteredJobs(data)
        
        // Extract unique employers (from sector_category field)
        const employerSet = new Set(data.map(job => job.sector_category).filter(Boolean))
        const uniqueEmployers = Array.from(employerSet)
        setEmployers(uniqueEmployers.sort())
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterJobs() {
    let filtered = [...jobs]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.sector_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.employer?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Employer filter
    if (selectedEmployer) {
      filtered = filtered.filter(job => job.sector_category === selectedEmployer)
    }

    setFilteredJobs(filtered)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE)
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE
  const endIndex = startIndex + JOBS_PER_PAGE
  const currentJobs = filteredJobs.slice(startIndex, endIndex)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Job Listings</h2>
        <p className="text-gray-600 mt-1">Browse {filteredJobs.length} active opportunities in Isle of Man</p>
      </div>

      <div className="mb-6 space-y-4">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <Filters
          employers={employers}
          selectedEmployer={selectedEmployer}
          onEmployerChange={setSelectedEmployer}
        />
      </div>

      <JobsTable jobs={currentJobs} />

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between px-4 sm:px-0">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, filteredJobs.length)}</span> of{' '}
                <span className="font-medium">{filteredJobs.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}