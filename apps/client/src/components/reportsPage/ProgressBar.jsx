import React from 'react'
import { ResponsiveContainer } from 'recharts'
import Card from '../utils/Card'

const ProgressBar = ({ data, title }) => {
  return (
    <Card className='shadow-md p-6 max-w-xl w-full mx-auto'>
        <h2 className='text-xl font-semibold montesserat-400 text-center mb-4'>{title}</h2>
        <div className='flex flex-wrap gap-5'>
            {data.map((goal) => {
                const percentageCompleted = (goal.current_amount / goal.target_amount) * 100
                return (
                    <Card className='shadow-md p-6 w-48 mx-auto' key={goal.savings_id}>
                        <div className='flex justify-between text-sm mb-3'>
                            <span className='montesserat-300'>{goal.title}</span>
                            <span>{`${percentageCompleted.toFixed(0)}%`}</span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-4 overflow-hidden'>
                            <div 
                                className='bg-green-500 h-full rounded-full'
                                style={{ width: `${percentageCompleted}%`}}
                            />
                        </div>
                        <div className='mt-3'>
                        <p className='montesserat-300'><span className='montesserat-400'>{`$${goal.current_amount}`}</span> saved of <span>{`$${goal.target_amount}`}</span></p>
                        </div>
                    </Card>

                )
            })}
        </div>
    </Card>
  )
}

export default ProgressBar