import React from 'react'
import { ResponsiveContainer } from 'recharts'
import Card from '../utils/Card'

const ProgressBar = ({ data, title }) => {
  return (
    <Card className='shadow-md p-6 max-w-6/10 w-full mx-auto'>
        <h2 className='text-5xl montesserat-400 text-left m-8'>{title}</h2>
        <div className='flex flex-wrap gap-5'>
            {data.map((goal) => {
                const percentageCompleted = (goal.current_amount / goal.target_amount) * 100
                return (
                    <Card className='shadow-md p-6 w-48 mx-auto h-52 grid grid-cols-1 grid-rows-3 gap-y-6' key={goal.savings_id}>
                        <div className='text-lg'>
                            <span className='montesserat-300'>{goal.title}</span>
                            {/* <span>{`${percentageCompleted.toFixed(0)}%`}</span> */}
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-4 overflow-hidden'>
                            <div 
                                className='bg-green-500 h-full rounded-full'
                                style={{ width: `${percentageCompleted}%`}}
                            />
                        </div>
                        <div className=''>
                        <p className='montesserat-300 text-lg'><span className='montesserat-400'>{`$${goal.current_amount}`}</span> saved of <span>{`$${goal.target_amount}`}</span></p>
                        </div>
                    </Card>

                )
            })}
        </div>
    </Card>
  )
}

export default ProgressBar