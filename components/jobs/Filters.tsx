'use client'

import { ChevronDown } from 'lucide-react'

interface FiltersProps {
  employers: string[]
  selectedEmployer: string
  onEmployerChange: (value: string) => void
}

export default function Filters({ employers, selectedEmployer, onEmployerChange }: FiltersProps) {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="relative">
        <select
          value={selectedEmployer}
          onChange={(e) => onEmployerChange(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none bg-white"
        >
          <option value="">All Employers</option>
          {employers.map((employer) => (
            <option key={employer} value={employer}>
              {employer}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  )
}