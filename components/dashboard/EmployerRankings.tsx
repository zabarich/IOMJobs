interface Employer {
  name: string
  count: number
}

interface EmployerRankingsProps {
  employers: Employer[]
}

export default function EmployerRankings({ employers }: EmployerRankingsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Top Direct Employers</h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Companies posting jobs directly (recruitment agencies excluded)
        </p>
      </div>
      <div className="space-y-3">
        {employers.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            Most jobs are posted through recruitment agencies
          </p>
        ) : (
          employers.map((employer, index) => (
            <div key={employer.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500 w-6">
                  #{index + 1}
                </span>
                <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                  {employer.name}
                </span>
              </div>
              <span className="text-sm font-bold text-blue-600">
                {employer.count} jobs
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}