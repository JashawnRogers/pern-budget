import React from 'react'

const CustomLegend = ({ payload }) => {
  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 sm:gap-y-6 sm:gap-x-8">
      {payload.map((entry, index) => (
        <li
          key={`item-${index}`}
          className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl text-black"
        >
          <span
            className="inline-block w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-md"
            style={{ backgroundColor: entry.color }}
          />
          <span className="ml-3">{entry.value}</span>
        </li>
      ))}
    </ul>
  )
}

export default CustomLegend