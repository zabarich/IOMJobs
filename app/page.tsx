import { supabase } from '@/lib/supabase/client'
import StatsOverview from '@/components/dashboard/StatsOverview'
import SectorChart from '@/components/charts/SectorChart'
import EmployerRankings from '@/components/dashboard/EmployerRankings'
import DataFreshness from '@/components/dashboard/DataFreshness'
import TrendChart from '@/components/charts/TrendChart'
import SalaryDistribution from '@/components/charts/SalaryDistribution'
import { format, subDays } from 'date-fns'

function isRecruitmentAgency(employer: string): boolean {
  const lowerEmployer = employer.toLowerCase()
  return lowerEmployer.includes('recruitment') || 
         lowerEmployer.includes('agency') ||
         lowerEmployer.includes('search and select') ||
         lowerEmployer.includes('itchyfeet') ||
         lowerEmployer.includes('paragon') ||
         lowerEmployer.includes('shearwater') ||
         lowerEmployer.includes('orchard recruitment')
}

function isInvalidJob(title: string): boolean {
  const lowerTitle = title.toLowerCase()
  // Filter out scraped UI elements and invalid job titles
  return lowerTitle.includes('login') ||
         lowerTitle.includes('register') ||
         lowerTitle.includes('dismiss') ||
         lowerTitle.includes('job search') ||
         lowerTitle.includes('employment agencies') ||
         lowerTitle.includes('government vacancies') ||
         lowerTitle.includes('submit a vacancy') ||
         title.trim().length < 3
}

function categorizeByJobTitle(title: string): string {
  const lowerTitle = title.toLowerCase()
  
  // Skip invalid/scraped jobs
  if (isInvalidJob(title)) {
    return 'Invalid'
  }
  
  // Finance & Professional Services
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
  
  // Healthcare & Care
  if (lowerTitle.includes('nurse') || lowerTitle.includes('care') || 
      lowerTitle.includes('health') || lowerTitle.includes('medical') || 
      lowerTitle.includes('support worker') || lowerTitle.includes('therapy') || 
      lowerTitle.includes('clinical') || lowerTitle.includes('dental') ||
      lowerTitle.includes('pharmacy') || lowerTitle.includes('assistant') ||
      lowerTitle.includes('early years') || lowerTitle.includes('educator')) {
    return 'Healthcare & Care'
  }
  
  // Hospitality & Food
  if (lowerTitle.includes('chef') || lowerTitle.includes('kitchen') || 
      lowerTitle.includes('waiter') || lowerTitle.includes('bartender') || 
      lowerTitle.includes('hotel') || lowerTitle.includes('restaurant') || 
      lowerTitle.includes('catering') || lowerTitle.includes('food') ||
      lowerTitle.includes('barista') || lowerTitle.includes('counter assistant') ||
      lowerTitle.includes('reception counter')) {
    return 'Hospitality & Food'
  }
  
  // Transport & Logistics
  if (lowerTitle.includes('driver') || lowerTitle.includes('delivery') || 
      lowerTitle.includes('transport') || lowerTitle.includes('logistics') ||
      lowerTitle.includes('warehouse') || lowerTitle.includes('post') ||
      lowerTitle.includes('taxi') || lowerTitle.includes('hgv')) {
    return 'Transport & Logistics'
  }
  
  // Construction & Trades
  if (lowerTitle.includes('electrician') || lowerTitle.includes('plumber') || 
      lowerTitle.includes('joiner') || lowerTitle.includes('builder') || 
      lowerTitle.includes('operative') || lowerTitle.includes('maintenance') ||
      lowerTitle.includes('construction') || lowerTitle.includes('engineer') ||
      lowerTitle.includes('technician') || lowerTitle.includes('mechanic') ||
      lowerTitle.includes('recycling')) {
    return 'Construction & Trades'
  }
  
  // Education
  if (lowerTitle.includes('teacher') || lowerTitle.includes('education') || 
      lowerTitle.includes('support officer') || lowerTitle.includes('teaching') ||
      lowerTitle.includes('school') || lowerTitle.includes('learning') ||
      lowerTitle.includes('coach') || lowerTitle.includes('trainee')) {
    return 'Education'
  }
  
  // Technology
  if (lowerTitle.includes('developer') || lowerTitle.includes('software') || 
      lowerTitle.includes('it ') || lowerTitle.includes('technical') || 
      lowerTitle.includes('analyst') || lowerTitle.includes('programmer') ||
      lowerTitle.includes('digital') || lowerTitle.includes('system')) {
    return 'Technology'
  }
  
  // Cleaning & Facilities
  if (lowerTitle.includes('cleaner') || lowerTitle.includes('cleaning') || 
      lowerTitle.includes('housekeeper') || lowerTitle.includes('domestic') ||
      lowerTitle.includes('facilities') || lowerTitle.includes('security')) {
    return 'Cleaning & Facilities'
  }
  
  // Retail & Sales
  if (lowerTitle.includes('sales') || lowerTitle.includes('retail') || 
      lowerTitle.includes('shop') || lowerTitle.includes('customer') ||
      lowerTitle.includes('cashier') || lowerTitle.includes('store') ||
      lowerTitle.includes('service') || lowerTitle.includes('advisor') ||
      lowerTitle.includes('associate')) {
    return 'Retail & Sales'
  }
  
  return 'Other'
}

function categorizeBySector(employerCounts: Record<string, number>, jobsData: any[]) {
  const sectors: Record<string, number> = {
    'Finance & Professional': 0,
    'Healthcare & Care': 0,
    'Hospitality & Food': 0,
    'Transport & Logistics': 0,
    'Construction & Trades': 0,
    'Education': 0,
    'Government': 0,
    'Cleaning & Facilities': 0,
    'Technology': 0,
    'Retail & Sales': 0,
    'Recruitment': 0,
    'Other': 0
  }

  // Process each job individually
  jobsData.forEach(job => {
    const employer = job.sector_category || 'Unknown'
    const title = job.title || ''
    
    // Skip invalid jobs (scraped UI elements)
    if (isInvalidJob(title)) {
      return
    }
    
    if (isRecruitmentAgency(employer)) {
      // For recruitment agencies, categorize by job title
      const actualSector = categorizeByJobTitle(title)
      if (actualSector === 'Invalid') {
        return // Skip invalid jobs
      } else if (actualSector === 'Other' && title.toLowerCase().includes('recruitment')) {
        sectors['Recruitment'] += 1
      } else {
        sectors[actualSector] += 1
      }
    } else {
      // For direct employers, use employer-based categorization
      const lowerEmployer = employer.toLowerCase()
      
      if (lowerEmployer.includes('care') || lowerEmployer.includes('health') || lowerEmployer.includes('hospice') || lowerEmployer.includes('manx care')) {
        sectors['Healthcare & Care'] += 1
      } else if (lowerEmployer.includes('department') || lowerEmployer.includes('government') || lowerEmployer.includes('treasury')) {
        sectors['Government'] += 1
      } else if (lowerEmployer.includes('school') || lowerEmployer.includes('education') || lowerEmployer.includes('college')) {
        sectors['Education'] += 1
      } else if (lowerEmployer.includes('shop') || lowerEmployer.includes('store') || lowerEmployer.includes('retail') || lowerEmployer.includes('co-op')) {
        sectors['Retail & Sales'] += 1
      } else if (lowerEmployer.includes('bank') || lowerEmployer.includes('finance') || lowerEmployer.includes('insurance') || lowerEmployer.includes('pwc') || lowerEmployer.includes('standard bank')) {
        sectors['Finance & Professional'] += 1
      } else if (lowerEmployer.includes('tech') || lowerEmployer.includes('software') || lowerEmployer.includes('digital')) {
        sectors['Technology'] += 1
      } else if (lowerEmployer.includes('hotel') || lowerEmployer.includes('restaurant') || lowerEmployer.includes('cafe') || lowerEmployer.includes('kitchen') || lowerEmployer.includes('flaming great')) {
        sectors['Hospitality & Food'] += 1
      } else if (lowerEmployer.includes('g4s') || lowerEmployer.includes('cleaning') || lowerEmployer.includes('facilities')) {
        sectors['Cleaning & Facilities'] += 1
      } else {
        // Use job title as fallback for direct employers
        const titleSector = categorizeByJobTitle(title)
        sectors[titleSector] += 1
      }
    }
  })

  return Object.entries(sectors)
    .filter(([_, count]) => count > 0)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

async function getJobStats() {
  console.log('🔍 Environment check:', {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    anonKeyStart: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10) + '...'
  })

  const { data: stats, count, error: countError } = await supabase
    .from('jobs_master')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    
  if (countError) {
    console.error('❌ Error fetching job count:', countError)
  } else {
    console.log('✅ Job count query successful:', { count })
  }

  // Get all job data for smart sector categorization
  const { data: allJobs, error: jobsError } = await supabase
    .from('jobs_master')
    .select('sector_category, title')
    .eq('is_active', true)
    
  if (jobsError) {
    console.error('❌ Error fetching jobs data:', jobsError)
  } else {
    console.log('✅ Jobs data query successful:', { jobCount: allJobs?.length || 0 })
  }

  const employerCounts: Record<string, number> = allJobs?.reduce((acc: Record<string, number>, job: any) => {
    const employer = job.sector_category || 'Unknown'
    acc[employer] = (acc[employer] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // Use smart sector categorization (job title analysis for recruitment agencies)
  const sectorCategories = categorizeBySector(employerCounts, allJobs || [])

  // Filter out recruitment agencies from top employers to show actual employers
  const topEmployers = Object.entries(employerCounts || {})
    .filter(([name]) => !isRecruitmentAgency(name) && name !== 'Unknown')
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }))

  // Count total jobs from direct employers vs recruitment agencies
  const directEmployerJobs = Object.entries(employerCounts || {})
    .filter(([name]) => !isRecruitmentAgency(name))
    .reduce((sum, [, count]) => sum + count, 0)
  
  const recruitmentAgencyJobs = Object.entries(employerCounts || {})
    .filter(([name]) => isRecruitmentAgency(name))
    .reduce((sum, [, count]) => sum + count, 0)

  const { data: salaryData } = await supabase
    .from('jobs_master')
    .select('salary_min, salary_max')
    .eq('is_active', true)
    .not('salary_min', 'is', null)

  const avgSalary = salaryData?.length
    ? salaryData.reduce((sum: number, job: any) => {
        const avg = (job.salary_min + (job.salary_max || job.salary_min)) / 2
        return sum + avg
      }, 0) / salaryData.length
    : 0

  const { data: lastRun } = await supabase
    .from('etl_runs')
    .select('completed_at')
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()

  // Get trend data (last 7 days of ETL runs)
  const { data: etlRuns } = await supabase
    .from('etl_runs')
    .select('completed_at, total_jobs_found, new_jobs_count')
    .eq('status', 'completed')
    .gte('completed_at', subDays(new Date(), 7).toISOString())
    .order('completed_at', { ascending: true })

  const trendData = etlRuns?.map(run => ({
    date: format(new Date(run.completed_at), 'MMM dd'),
    jobs: run.total_jobs_found || 0,
    newJobs: run.new_jobs_count || 0
  })) || []

  // Calculate salary distribution
  const salaryBrackets = [
    { min: 0, max: 20000, range: 'Under £20k' },
    { min: 20000, max: 30000, range: '£20k-30k' },
    { min: 30000, max: 40000, range: '£30k-40k' },
    { min: 40000, max: 50000, range: '£40k-50k' },
    { min: 50000, max: 70000, range: '£50k-70k' },
    { min: 70000, max: 100000, range: '£70k-100k' },
    { min: 100000, max: 999999, range: 'Over £100k' }
  ]

  const salaryDistribution = await Promise.all(
    salaryBrackets.map(async (bracket) => {
      const { count: bracketCount } = await supabase
        .from('jobs_master')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gte('salary_min', bracket.min)
        .lt('salary_min', bracket.max)
      
      return {
        range: bracket.range,
        count: bracketCount || 0
      }
    })
  )

  return {
    totalJobs: count || 0,
    sectors: sectorCategories,
    topEmployers,
    totalEmployers: Object.keys(employerCounts).length,
    avgSalary: Math.round(avgSalary),
    lastUpdated: lastRun?.completed_at || null,
    trendData,
    salaryDistribution
  }
}

export default async function DashboardPage() {
  const stats = await getJobStats()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Job Market Dashboard</h2>
        <p className="text-gray-600 mt-1">Real-time insights into Isle of Man employment</p>
      </div>

      <DataFreshness lastUpdated={stats.lastUpdated} />
      
      <StatsOverview
        totalJobs={stats.totalJobs}
        avgSalary={stats.avgSalary}
        totalEmployers={stats.totalEmployers}
        totalSectors={stats.sectors.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <SectorChart data={stats.sectors} />
        <EmployerRankings employers={stats.topEmployers} />
      </div>

      {stats.trendData.length > 0 && (
        <div className="mt-8">
          <TrendChart data={stats.trendData} />
        </div>
      )}

      {stats.salaryDistribution.some(s => s.count > 0) && (
        <div className="mt-8">
          <SalaryDistribution data={stats.salaryDistribution} />
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">📊 How We Categorize Job Data</h3>
        <div className="text-xs sm:text-sm text-blue-800 space-y-2">
          <p>
            <strong>Sectors:</strong> Jobs posted by recruitment agencies are categorized by analyzing the job title to determine the actual role type (e.g., "Tax Compliance Officer" → Finance & Professional). "Other" includes jobs that don't fit standard categories or have unclear titles.
          </p>
          <p>
            <strong>Employers:</strong> Only direct employers are shown in the "Top Employers" list. Recruitment agencies are excluded since they don't reveal the actual hiring company.
          </p>
          <p>
            <strong>Data Source:</strong> {stats.totalJobs} jobs scraped from Isle of Man Government job portal. About {Math.round((stats.totalJobs - (stats.topEmployers.reduce((sum, emp) => sum + emp.count, 0))) / stats.totalJobs * 100)}% are posted through recruitment agencies.
          </p>
        </div>
      </div>
    </div>
  )
}