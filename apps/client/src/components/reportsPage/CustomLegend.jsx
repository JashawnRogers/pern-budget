import React from 'react'

const CustomLegend = ({ payload }) => {
  return (
    <ul className='space-y-6'>
        {payload.map((entry, index) => (
            <li
                key={`item-${index}`}
                className='flex items-center gap-2 text-3xl text-black'
            >
                <span  
                    className='inline-block w-6 h-6 rounded-md'
                    style={{ backgroundColor: entry.color }}
                />
                <span className='ml-3'>{entry.value}</span>
            </li>
        ))}
    </ul>
  )
}

export default CustomLegend