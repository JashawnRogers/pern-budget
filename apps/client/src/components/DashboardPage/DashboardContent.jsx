import React from 'react'
import Card from '../utils/Card'
import { Link } from 'react-router-dom'

const DashboardContent = () => {
  return (
    <section className='p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch min-h-[80vh]'>
            <Card>
                <div className='flex flex-col p-3'>
                    <h2 className='text-xl montesserat-400'>Your balance</h2>
                    <p className='text-sm montesserat-300'>Today, Apr 5</p>
                    <h3 className='text-6xl montesserat-400 mt-16'>$10,000</h3>
                </div>
            </Card>

            
            <Card className='hover:cursor-pointer'>
                <Link to='/budget'>
                    <div className='flex flex-col p-3'>
                        <h2 className='text-xl montesserat-400'>Budget</h2>
                        <p className='text-sm montesserat-300'>Total budget for this month</p>
                        <h3 className='text-6xl montesserat-400 mt-16'>$10,000</h3>
                    </div>
                </Link>
            </Card>
            

            <Card className='lg:row-span-2'>
                <Link to='/transactions'>
                    <div className='flex flex-col p-3'>
                        <h2 className='text-xl montesserat-400'>Latest Transactions</h2>
                        <p className='text-sm montesserat-300'>Transactions from this week</p>
                        <p>Table of transactions</p>
                    </div>
                </Link>
            </Card>
   
            <Card>
                <div className='flex flex-col p-3'>
                    <h2 className='text-xl montesserat-400'>Expenses</h2>
                    <p className='text-sm montesserat-300'>Total expenses for this month</p>
                    <h3 className='text-3xl montesserat-400 mt-16'>$10,000</h3>
                </div>
            </Card>
            <Card>
                <div className='flex flex-col p-3'>
                    <h2 className='text-xl montesserat-400'>Income</h2>
                    <p className='text-sm montesserat-300'>Total Income for this month</p>
                    <h3 className='text-3xl montesserat-400 mt-16'>$10,000</h3>
                </div>
            </Card>
            <Card className='lg:col-span-2'>
                <div className='flex flex-col p-3'>
                    <h2 className='text-xl montesserat-400'>Reports</h2>
                    <p className='text-sm montesserat-300'>Total budget for this month</p>
                    <h3 className='text-6xl montesserat-400 mt-16'>$10,000</h3>
                </div>
            </Card>
            <Card>
                <div className='flex flex-col p-3'>
                    <h2 className='text-xl montesserat-400'>Analytics</h2>
                    <p className='text-sm montesserat-300'>Total budget for this month</p>
                    <h3 className='text-6xl montesserat-400 mt-16'>$10,000</h3>
                </div>
            </Card>
    </section>
  )
}

export default DashboardContent