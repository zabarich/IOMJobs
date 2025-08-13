import { supabase } from '@/lib/supabase/client'
import DataFreshness from '@/components/dashboard/DataFreshness'
import RunHistory from '@/components/dashboard/RunHistory'

async function getETLHistory() {
  const { data: runs } = await supabase
    .from('etl_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(20)

  const { data: lastSuccessful } = await supabase
    .from('etl_runs')
    .select('*')
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()

  const { data: jobStats } = await supabase
    .from('jobs_master')
    .select('is_active', { count: 'exact' })

  const activeCount = jobStats?.filter(j => j.is_active).length || 0
  const inactiveCount = (jobStats?.length || 0) - activeCount

  return {
    runs: runs || [],
    lastSuccessful,
    stats: {
      activeJobs: activeCount,
      inactiveJobs: inactiveCount,
      totalJobs: jobStats?.length || 0,
    }
  }
}

export default async function AdminPage() {
  const { runs, lastSuccessful, stats } = await getETLHistory()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600 mt-1">Monitor data freshness and ETL history</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800">ℹ️ Read-Only Dashboard</h3>
        <p className="text-yellow-700 mt-1">
          This dashboard displays data collected by the local ETL scraper. 
          To update data, run the scraper locally: <code className="bg-yellow-100 px-2 py-1 rounded">cd etl-scraper && npm run scrape</code>
        </p>
      </div>

      <DataFreshness lastUpdated={lastSuccessful?.completed_at} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Active Jobs</div>
          <div className="mt-2 text-3xl font-bold text-green-600">{stats.activeJobs}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Inactive Jobs</div>
          <div className="mt-2 text-3xl font-bold text-gray-400">{stats.inactiveJobs}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Total Records</div>
          <div className="mt-2 text-3xl font-bold text-blue-600">{stats.totalJobs}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">ETL Run History</h3>
        </div>
        <RunHistory runs={runs} />
      </div>
    </div>
  )
}