'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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

function categoriseByJobTitle(title: string): string {
  const lowerTitle = title.toLowerCase()
  
  if (lowerTitle.includes('accountant') || lowerTitle.includes('tax') || 
      lowerTitle.includes('compliance') || lowerTitle.includes('trust') || 
      lowerTitle.includes('administrator') || lowerTitle.includes('finance') || 
      lowerTitle.includes('audit') || lowerTitle.includes('bookkeeper') || 
      lowerTitle.includes('payroll') || lowerTitle.includes('banking') ||
      lowerTitle.includes('financial') || lowerTitle.includes('treasury') ||
      lowerTitle.includes('director') || lowerTitle.includes('manager') ||
      lowerTitle.includes('advocate') || lowerTitle.includes('legal') ||
      lowerTitle.includes('claims')) {
    return 'Finance & Professional'
  }
  
  if (lowerTitle.includes('nurse') || lowerTitle.includes('care') || 
      lowerTitle.includes('health') || lowerTitle.includes('medical') || 
      lowerTitle.includes('support worker') || lowerTitle.includes('therapy') || 
      lowerTitle.includes('clinical') || lowerTitle.includes('dental') ||
      lowerTitle.includes('pharmacy') || lowerTitle.includes('assistant') ||
      lowerTitle.includes('early years') || lowerTitle.includes('educator')) {
    return 'Healthcare & Care'
  }
  
  if (lowerTitle.includes('chef') || lowerTitle.includes('kitchen') || 
      lowerTitle.includes('waiter') || lowerTitle.includes('bartender') || 
      lowerTitle.includes('hotel') || lowerTitle.includes('restaurant') || 
      lowerTitle.includes('catering') || lowerTitle.includes('food') ||
      lowerTitle.includes('barista') || lowerTitle.includes('counter assistant') ||
      lowerTitle.includes('reception counter')) {
    return 'Hospitality & Food'
  }
  
  if (lowerTitle.includes('driver') || lowerTitle.includes('delivery') || 
      lowerTitle.includes('transport') || lowerTitle.includes('logistics') ||
      lowerTitle.includes('warehouse') || lowerTitle.includes('post') ||
      lowerTitle.includes('taxi') || lowerTitle.includes('hgv')) {
    return 'Transport & Logistics'
  }
  
  if (lowerTitle.includes('electrician') || lowerTitle.includes('plumber') || 
      lowerTitle.includes('joiner') || lowerTitle.includes('builder') || 
      lowerTitle.includes('operative') || lowerTitle.includes('maintenance') ||
      lowerTitle.includes('construction') || lowerTitle.includes('engineer') ||
      lowerTitle.includes('technician') || lowerTitle.includes('mechanic') ||
      lowerTitle.includes('recycling')) {
    return 'Construction & Trades'
  }
  
  if (lowerTitle.includes('teacher') || lowerTitle.includes('education') || 
      lowerTitle.includes('support officer') || lowerTitle.includes('teaching') ||
      lowerTitle.includes('school') || lowerTitle.includes('learning') ||
      lowerTitle.includes('coach') || lowerTitle.includes('trainee')) {
    return 'Education'
  }
  
  if (lowerTitle.includes('developer') || lowerTitle.includes('software') || 
      lowerTitle.includes('it ') || lowerTitle.includes('technical') || 
      lowerTitle.includes('analyst') || lowerTitle.includes('programmer') ||
      lowerTitle.includes('digital') || lowerTitle.includes('system')) {
    return 'Technology'
  }
  
  if (lowerTitle.includes('cleaner') || lowerTitle.includes('cleaning') || 
      lowerTitle.includes('housekeeper') || lowerTitle.includes('domestic') ||
      lowerTitle.includes('facilities') || lowerTitle.includes('security')) {
    return 'Cleaning & Facilities'
  }
  
  if (lowerTitle.includes('sales') || lowerTitle.includes('retail') || 
      lowerTitle.includes('shop') || lowerTitle.includes('customer') ||
      lowerTitle.includes('cashier') || lowerTitle.includes('store') ||
      lowerTitle.includes('service') || lowerTitle.includes('advisor') ||
      lowerTitle.includes('associate')) {
    return 'Retail & Sales'
  }
  
  return 'Other'
}

export default function JobsPage() {
  const searchParams = useSearchParams()
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployer, setSelectedEmployer] = useState('')
  const [selectedSector, setSelectedSector] = useState('')
  const [employers, setEmployers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    // Set initial filters from URL parameters
    const sectorParam = searchParams.get('sector')
    const employerParam = searchParams.get('employer')
    
    if (sectorParam) {
      setSelectedSector(sectorParam)
    }
    if (employerParam) {
      setSelectedEmployer(employerParam)
    }
    
    fetchJobs()
  }, [searchParams])

  useEffect(() => {
    filterJobs()
    setCurrentPage(1)
  }, [searchTerm, selectedEmployer, selectedSector, jobs])

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

    // Sector filter
    if (selectedSector) {
      filtered = filtered.filter(job => {
        const jobSector = categoriseByJobTitle(job.title || '')
        return jobSector === selectedSector
      })
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
        
        {/* Active filters display */}
        {(selectedSector || selectedEmployer) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedSector && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Sector: {selectedSector}
                <button
                  onClick={() => setSelectedSector('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedEmployer && !selectedSector && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Employer: {selectedEmployer}
                <button
                  onClick={() => setSelectedEmployer('')}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
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