'use client'

import { useEffect, useState } from 'react'

interface DataFreshnessProps {
  lastUpdated: string | null
}

export default function DataFreshness({ lastUpdated }: DataFreshnessProps) {
  const [freshness, setFreshness] = useState<{
    status: 'fresh' | 'stale' | 'old'
    message: string
    color: string
  }>({ status: 'old', message: 'No data', color: 'text-gray-500' })
  const [dateString, setDateString] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!lastUpdated) {
      setFreshness({ status: 'old', message: 'No ETL runs found', color: 'text-gray-500' })
      return
    }

    const lastUpdateTime = new Date(lastUpdated).getTime()
    const now = Date.now()
    const minutesSince = (now - lastUpdateTime) / (1000 * 60)
    const hoursSince = minutesSince / 60

    // Format date in a consistent way
    setDateString(new Date(lastUpdated).toISOString().replace('T', ' ').slice(0, 19))

    if (minutesSince < 60) {
      setFreshness({
        status: 'fresh',
        message: `Last updated ${Math.round(minutesSince)} minutes ago`,
        color: 'text-green-600'
      })
    } else if (hoursSince < 24) {
      setFreshness({
        status: 'fresh',
        message: `Last updated ${Math.round(hoursSince)} hour${Math.round(hoursSince) !== 1 ? 's' : ''} ago`,
        color: 'text-green-600'
      })
    } else if (hoursSince < 72) {
      const days = Math.floor(hoursSince / 24)
      setFreshness({
        status: 'stale',
        message: `Last updated ${days} day${days > 1 ? 's' : ''} ago`,
        color: 'text-yellow-600'
      })
    } else {
      const days = Math.floor(hoursSince / 24)
      setFreshness({
        status: 'old',
        message: `Last updated ${days} days ago - data may be outdated`,
        color: 'text-red-600'
      })
    }
  }, [lastUpdated])

  const statusIcons = {
    fresh: '✅',
    stale: '⚠️',
    old: '❌'
  }

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{statusIcons[freshness.status]}</span>
          <div>
            <p className="font-semibold">Data Freshness</p>
            <p className={`text-sm ${freshness.color}`}>{freshness.message}</p>
          </div>
        </div>
        {mounted && dateString && (
          <div className="text-sm text-gray-500">
            {dateString}
          </div>
        )}
      </div>
    </div>
  )
}