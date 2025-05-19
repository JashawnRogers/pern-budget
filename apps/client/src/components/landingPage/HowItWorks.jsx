import React from 'react'
import Card from '../utils/Card'
import { TbTargetArrow } from 'react-icons/tb'
import { LuWallet } from 'react-icons/lu'
import { GiSettingsKnobs } from 'react-icons/gi'

const HowItWorks = () => {
  return (
    <section id='how-it-works' className='mt-28'>
        <div className='flex flex-col items-center gap-2 w-auto'>
            <h2 className='montesserat-400 text-5xl'>How It Works</h2>
            <p className='montesserat-300'>Embark on a seamless journey towards financial empowerment</p>
            <p className='montesserat-300'>with our finance budgeting dashboard.</p>
        </div>
        <div className='flex flex-wrap gap-2 justify-center mt-12'>
            <Card className='w-[478.33px] h-[225px]'> 
                <div className='flex flex-col ml-5 mt-8'>
                    <TbTargetArrow className='w-[50px] h-[50px]'/>
                    <h3 className='montesserat-400 leading-14 text-2xl'>Set Your Goals</h3>
                    <p className='montesserat-300 leading-7 mt-3'>Our platform helps you create realistic and achievable goals tailored to your lifestyle.</p>
                </div>
            </Card>
            <Card className='w-[478.33px] h-[225px]'> 
                <div className='flex flex-col ml-5 mt-8'>
                    <LuWallet className='w-[50px] h-[50px]'/>
                    <h3 className='montesserat-400 leading-14 text-2xl'>Create Your Budget</h3>
                    <p className='montesserat-300 leading-7 mt-3'>Utilize our intuitive budgeting tools to plan your income and expenses.</p>
                </div>
            </Card>
            <Card className='w-[478.33px] h-[225px]'> 
                <div className='flex flex-col ml-5 mt-8'>
                    <GiSettingsKnobs className='w-[50px] h-[50px]'/>
                    <h3 className='montesserat-400 leading-14 text-2xl'>Track and Adjust</h3>
                    <p className='montesserat-300 leading-7 mt-3'>Adjust your budget as needed for optimal financial health.</p>
                </div>
            </Card>
        </div>
    </section>
  )
}

export default HowItWorks