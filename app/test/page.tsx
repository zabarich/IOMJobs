'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function TestPage() {
  const [jobCount, setJobCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [envCheck, setEnvCheck] = useState<any>(null)

  useEffect(() => {
    console.log('🧪 Test page loaded')
    
    // Check environment variables
    const envInfo = {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlStart: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30),
    }
    setEnvCheck(envInfo)
    console.log('🔍 Client-side env check:', envInfo)

    // Simple test query
    async function testQuery() {
      try {
        console.log('🔄 Starting test query...')
        const { data, count, error } = await supabase
          .from('jobs_master')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)

        if (error) {
          console.error('❌ Supabase error:', error)
          setError(error.message)
        } else {
          console.log('✅ Success! Count:', count)
          setJobCount(count)
        }
      } catch (err) {
        console.error('❌ Unexpected error:', err)
        setError(String(err))
      }
    }

    testQuery()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">🧪 Connection Test</h1>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded">
          <h2 className="font-semibold">Environment Variables:</h2>
          <pre className="text-sm mt-2">
            {JSON.stringify(envCheck, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h2 className="font-semibold">Job Count Result:</h2>
          {jobCount !== null ? (
            <p className="text-green-600 text-xl font-bold">{jobCount} jobs</p>
          ) : error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : (
            <p className="text-yellow-600">Loading...</p>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p>Check the browser console (F12) for detailed logs.</p>
        </div>
      </div>
    </div>
  )
}