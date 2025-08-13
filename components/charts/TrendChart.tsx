'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface TrendDataPoint {
  date: string
  jobs: number
  newJobs: number
}

interface TrendChartProps {
  data: TrendDataPoint[]
}

export default function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Job Market Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="jobs" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="Total Active Jobs"
            dot={{ r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="newJobs" 
            stroke="#10B981" 
            strokeWidth={2}
            name="New Jobs"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}