import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '../utils/Card'
import CustomLegend from './CustomLegend'

const COLORS = [
  '#4ade80', '#22c55e', '#86efac',
  '#facc15', '#a3e635', '#60a5fa',
  '#f87171', '#a78bfa', '#fb923c'
]

const BudgetPieChart = ({ data, title = 'Budget Breakdown' }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Dynamically calculate radius based on screen width
  let innerRadius, outerRadius, containerHeight
  if (windowWidth < 640) { // Mobile
    innerRadius = 50
    outerRadius = 90
    containerHeight = 300
  } else if (windowWidth < 1024) { // Tablet
    innerRadius = 70
    outerRadius = 140
    containerHeight = 400
  } else { // Desktop
    innerRadius = 80
    outerRadius = 150
    containerHeight = 500
  }

  const total = data.reduce((sum, item) => sum + item.total_spent, 0)

  return (
    <Card className='shadow-md px-4 py-6 sm:px-6 md:px-10 lg:px-12 w-full max-w-6xl mx-auto'>
      <h2 className='text-3xl sm:text-4xl lg:text-5xl montesserat-400 text-left mb-6'>{title}</h2>

      <div className={`w-full h-[${containerHeight}px]`} style={{ height: containerHeight }}>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              dataKey='total_spent'
              nameKey='category'
              cx='50%'
              cy='50%'
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={5}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${entry.category}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend
              align='right'
              layout='vertical'
              verticalAlign='middle'
              content={CustomLegend}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default BudgetPieChart