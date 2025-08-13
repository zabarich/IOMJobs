'use client'

interface ETLRun {
  run_id: string
  status: string
  started_at: string
  completed_at: string | null
  total_jobs_found: number | null
  new_jobs_count: number | null
  updated_jobs_count: number | null
  ended_jobs_count: number | null
  run_duration_seconds: number | null
  errors: string[] | null
}

interface RunHistoryProps {
  runs: ETLRun[]
}

export default function RunHistory({ runs }: RunHistoryProps) {
  const getStatusBadge = (status: string) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      running: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Started
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jobs Found
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Changes
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {runs.map((run) => (
            <tr key={run.run_id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(run.started_at).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(run.status)}`}>
                  {run.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDuration(run.run_duration_seconds)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {run.total_jobs_found || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {run.status === 'completed' && (
                  <div className="flex space-x-2">
                    <span className="text-green-600">+{run.new_jobs_count || 0}</span>
                    <span className="text-blue-600">↻{run.updated_jobs_count || 0}</span>
                    <span className="text-red-600">-{run.ended_jobs_count || 0}</span>
                  </div>
                )}
                {run.errors && run.errors.length > 0 && (
                  <span className="text-red-600">Errors: {run.errors.length}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}