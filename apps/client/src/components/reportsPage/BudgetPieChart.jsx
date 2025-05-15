import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '../utils/Card'

const COLORS = ['#4ade80', '#facc15', '#f87171', '#60a5fa', '#a78bfa']

const BudgetPieChart = ({ data, title = 'Budget Breakdown' }) => {
  const total = data.reduce((sum, item) => sum + item.total_spent, 0)

  return (
    <Card className='shadow-md p-6 max-w-xl w-full mx-auto'>
        <h2 className='text-xl montesserat-400 text-center mb-2'>{title}</h2>
        <ResponsiveContainer width='100%' height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey='total_spent'
              nameKey='category'
              cx='50%'
              cy='50%'
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`}/>
            <Legend align='right' iconType='square' layout='vertical' height={175} width={100}/>
          </PieChart>
        </ResponsiveContainer>
        <div className='text-center mt-4'>
            <span className='text-2xl montesserat-400'>${total.toLocaleString()}</span>
            <p className='text-muted-foreground montesserat-300'>Total Spent</p>
        </div>
    </Card>
  )
}

export default BudgetPieChart