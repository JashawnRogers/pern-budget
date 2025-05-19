import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../utils/Button'
import heroImage from '../../assets/hero-img.png'

const Hero = () => {
  return (
    <section id='home'>
        <div className="flex flex-col items-center mt-7">
            <h1 className='montesserat-400 text-7xl'>Smart Spending</h1>
            <h1 className='montesserat-400 text-7xl'>Starts Here</h1>
            <div className='mt-5'>
                <p className="montesserat-300">Take control of your financial future with our intuitive</p>
                <p className="montesserat-300 text-center">and powerful finance dashboard.</p>
            </div>
            <Link to='/register'>
                <Button className='mt-3'>Get Started</Button>
            </Link>
        </div>
        <div className='w-[750px] aspect-[16/9] flex my-0 mx-auto justify-center mt-6 bg-gradient-to-b from-white to-gray-100 rounded-2xl shadow-md border border-gray-300'>
            <img 
                src={heroImage} 
                alt='Snippet of dashbaord screen'
                className='object-contain w-full h-full rounded-2xl'
            />
        </div>
    </section>
  )
}

export default Hero