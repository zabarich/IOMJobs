'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useEffect, useState } from 'react'

interface SectorData {
  name: string
  value: number
}

interface SectorChartProps {
  data: SectorData[]
}

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#F97316', '#84CC16', '#6B7280'
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
        <p className="text-sm font-medium">{payload[0].name}</p>
        <p className="text-sm text-gray-600">{payload[0].value} jobs</p>
        <p className="text-xs text-gray-500">{((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%</p>
      </div>
    )
  }
  return null
}

export default function SectorChart({ data }: SectorChartProps) {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const sortedData = data.sort((a, b) => b.value - a.value).slice(0, 10)
  const total = sortedData.reduce((sum, item) => sum + item.value, 0)
  const dataWithTotal = sortedData.map(item => ({ ...item, total }))

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Jobs by Sector</h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Categorised by job title analysis (recruitment agency jobs reclassified by actual role)
        </p>
      </div>
      <ResponsiveContainer width="100%" height={isMobile ? 350 : 450}>
        <PieChart margin={{ top: 20, right: 20, bottom: 80, left: 20 }}>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={isMobile ? 100 : 140}
            fill="#8884d8"
            dataKey="value"
          >
            {dataWithTotal.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            layout="horizontal"
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: isMobile ? '12px' : '14px'
            }}
            formatter={(value, entry: any) => (
              <span className="text-xs sm:text-sm">
                {value} ({entry.payload.value})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}