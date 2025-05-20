import React from 'react'
import Card from '../utils/Card'

const ProgressBar = ({ data, title }) => {
  return (
    <Card className='shadow-md px-4 py-6 sm:px-6 md:px-10 lg:px-12 w-full max-w-6xl mx-auto'>
      <h2 className='text-3xl sm:text-4xl lg:text-5xl montesserat-400 text-left mb-8'>{title}</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {data.map((goal) => {
          const percentageCompleted = (goal.current_amount / goal.target_amount) * 100

          return (
            <Card
              key={goal.savings_id}
              className='shadow-md p-4 sm:p-6 flex flex-col justify-between min-h-[180px]'
            >
              <div className='text-base sm:text-lg font-medium mb-2 montesserat-300'>
                {goal.title}
              </div>

              <div className='w-full bg-gray-200 rounded-full h-4 mb-4'>
                <div
                  className='bg-green-500 h-full rounded-full'
                  style={{ width: `${percentageCompleted}%` }}
                />
              </div>

              <div className='text-sm sm:text-base montesserat-300'>
                <p>
                  <span className='montesserat-400'>${goal.current_amount}</span> saved of{' '}
                  <span>${goal.target_amount}</span>
                </p>
              </div>
            </Card>
          )
        })}
      </div>
    </Card>
  )
}

export default ProgressBar