'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SalaryBracket {
  range: string
  count: number
}

interface SalaryDistributionProps {
  data: SalaryBracket[]
}

export default function SalaryDistribution({ data }: SalaryDistributionProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="range" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8B5CF6" name="Number of Jobs" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}