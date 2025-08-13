interface StatsOverviewProps {
  totalJobs: number
  avgSalary: number
  totalEmployers: number
  totalSectors: number
}

export default function StatsOverview({ 
  totalJobs, 
  avgSalary, 
  totalEmployers, 
  totalSectors 
}: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="text-xs sm:text-sm font-medium text-gray-500">Active Jobs</div>
        <div className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-blue-600">{totalJobs}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="text-xs sm:text-sm font-medium text-gray-500">Avg Salary</div>
        <div className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-green-600">
          £{avgSalary ? Math.round(avgSalary/1000) + 'k' : 'N/A'}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="text-xs sm:text-sm font-medium text-gray-500">Employers</div>
        <div className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-purple-600">{totalEmployers}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="text-xs sm:text-sm font-medium text-gray-500">Sectors</div>
        <div className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-orange-600">{totalSectors}</div>
      </div>
    </div>
  )
}