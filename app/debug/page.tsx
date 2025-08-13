export default function DebugPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">🐛 Vercel Debug Info</h1>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded">
          <h2 className="font-semibold">Environment Variables:</h2>
          <div className="mt-2 text-sm">
            <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {supabaseUrl ? 'SET' : 'NOT SET'}</p>
            <p><strong>URL Value:</strong> {supabaseUrl || 'undefined'}</p>
            <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {supabaseKey ? 'SET' : 'NOT SET'}</p>
            <p><strong>Key Length:</strong> {supabaseKey?.length || 'undefined'}</p>
            <p><strong>Key Start:</strong> {supabaseKey?.substring(0, 30) || 'undefined'}</p>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded">
          <h2 className="font-semibold">Environment Info:</h2>
          <div className="mt-2 text-sm">
            <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
            <p><strong>VERCEL:</strong> {process.env.VERCEL || 'false'}</p>
            <p><strong>VERCEL_URL:</strong> {process.env.VERCEL_URL || 'not set'}</p>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded">
          <h2 className="font-semibold">Expected Values:</h2>
          <div className="mt-2 text-sm">
            <p><strong>URL should be:</strong> https://icvyizgmziezlzvgqekl.supabase.co</p>
            <p><strong>Key should start with:</strong> eyJhbGciOiJIUzI1NiIs</p>
            <p><strong>Key should be length:</strong> 191 characters</p>
          </div>
        </div>
      </div>
    </div>
  )
}