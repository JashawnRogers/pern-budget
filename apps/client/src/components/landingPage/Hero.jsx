import { Link } from 'react-router-dom'
import Button from '../utils/Button'
import heroImage from '../../assets/hero-img.png'

const Hero = () => {
  return (
    <section id='home' className='px-4'>
      <div className="flex flex-col items-center mt-10 text-center">
        <h1 className='montesserat-400 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight'>Smart Spending</h1>
        <h1 className='montesserat-400 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight'>Starts Here</h1>
        <div className='mt-5'>
          <p className="montesserat-300 text-sm sm:text-base md:text-lg">Take control of your financial future with our intuitive</p>
          <p className="montesserat-300 text-sm sm:text-base md:text-lg">and powerful finance dashboard.</p>
        </div>
        <Link to='/register'>
          <Button className='mt-5'>Get Started</Button>
        </Link>
      </div>
      <div className='w-full max-w-[750px] mx-auto mt-8 aspect-[16/9] bg-gradient-to-b from-white to-gray-100 rounded-2xl shadow-md border border-gray-300'>
        <img 
          src={heroImage} 
          alt='Snippet of dashboard screen'
          className='object-contain w-full h-full rounded-2xl'
        />
      </div>
    </section>
  )
}

export default Hero