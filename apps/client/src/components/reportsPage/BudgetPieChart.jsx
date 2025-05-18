import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '../utils/Card'
import CustomLegend from './CustomLegend'

const COLORS = ['#4ade80', '#22c55e', '#86efac', '#facc15', '#a3e635', '#60a5fa', '#f87171', '#a78bfa', '#fb923c']

const BudgetPieChart = ({ data, title = 'Budget Breakdown' }) => {
  const total = data.reduce((sum, item) => sum + item.total_spent, 0)

  return (
    <Card className='shadow-md p-6 max-w-6/10 w-full mx-auto'>
        <h2 className='text-5xl montesserat-400 text-left m-4'>{title}</h2>
        <ResponsiveContainer width='100%' height={500}>
          <PieChart>
            <Pie
              data={data}
              dataKey='total_spent'
              nameKey='category'
              cx='50%'
              cy='50%'
              innerRadius={100}
              outerRadius={200}
              paddingAngle={5}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`}/>
            <Legend 
              align='left' 
              layout='vertical'
              verticalAlign='middle' 
              content={CustomLegend}
              />
          </PieChart>
        </ResponsiveContainer>
        {/* <div className='text-center mt-4'>
            <span className='text-2xl montesserat-400'>${total.toLocaleString()}</span>
            <p className='text-muted-foreground montesserat-300'>Total Spent</p>
        </div> */}
    </Card>
  )
}

export default BudgetPieChart