import React from 'react'
import Card from '../utils/Card'
import { SiMinds } from 'react-icons/si'
import { IoHappyOutline } from 'react-icons/io5'
import { VscGraph } from 'react-icons/vsc'

const Features = () => {
  return (
    <section className='mt-28'>
        <div className='flex flex-col items-center gap-2 w-auto'>
            <h2 className='montesserat-400 text-5xl'>Intelligent Features</h2>
            <p className='montesserat-300'>Create realistic budgets and track your spending effortlessly.</p>
            <p className='montesserat-300'>Our features keep you focused and organized to help you stay on track.</p>
        </div>
        <div className='flex flex-wrap justify-center gap-x-6 mt-12'>
            <Card className='w-[700px] h-[500px]'>
                <div className='flex flex-col gap-y-3 ml-12 mt-6'>
                    <IoHappyOutline className='w-[50px] h-[50px]' />
                    <div>
                        <h3 className='montesserat-400 text-3xl leading-14'>Seamless Budgeting Experience</h3>
                        <p className='montesserat-300'>Experience hassle free budgeting with our user-friendly dashboard.</p>
                        <p className='montesserat-300'>Say goodbye to financial stress and hello to financial confidence.</p>
                    </div>
                </div>
            </Card>
            <Card className='w-[700px] h-[500px]'>
            <div className='flex flex-col gap-y-3 ml-12 mt-6 w-[600px]'>
                    <SiMinds className='w-[50px] h-[50px]' />
                    <div>
                        <h3 className='montesserat-400 text-3xl leading-14'>Trace Your Financial Journey</h3>
                        <p className='montesserat-300'>Gain insights over your spending patterns, identify trends, and track your financial growth over time.</p>
                    </div>
                </div>
            </Card>
            <Card className='w-[1435px] h-[500px] mt-8'>
                <div className='flex flex-col gap-y-3 ml-12 mt-10'>
                    <VscGraph className='w-[50px] h-[50px]'/>
                    <div className='w-[500px]'>
                        <h3 className='montesserat-400 text-3xl leading-14'>Expends & Income Categorization</h3>
                        <p className='montesserat-300 leading-8'>Effortlessly categorize your expends and income for a detailed understanding of where your money goes. Identify spending trends, areas for potential savings, and make adjustments to optimize your budget.</p>
                    </div>
                </div>
            </Card>
        </div>
    </section>
  )
}

export default Features