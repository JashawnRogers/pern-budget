import Card from '../utils/Card'
import { TbTargetArrow } from 'react-icons/tb'
import { LuWallet } from 'react-icons/lu'
import { GiSettingsKnobs } from 'react-icons/gi'

const HowItWorks = () => {
  return (
    <section id='how-it-works' className='mt-28 px-4'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h2 className='montesserat-400 text-3xl sm:text-4xl md:text-5xl'>How It Works</h2>
        <p className='montesserat-300 text-sm sm:text-base'>Embark on a seamless journey towards financial empowerment</p>
        <p className='montesserat-300 text-sm sm:text-base'>with our finance budgeting dashboard.</p>
      </div>

      <div className='flex flex-wrap gap-6 justify-center mt-12'>
        <Card className='w-full sm:w-[300px] md:w-[400px] lg:w-[478px] h-auto p-6 flex flex-col items-start rounded-2xl'>
          <TbTargetArrow className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]' />
          <h3 className='montesserat-400 text-xl sm:text-2xl mt-4'>Set Your Goals</h3>
          <p className='montesserat-300 text-sm sm:text-base mt-2 leading-relaxed'>
            Our platform helps you create realistic and achievable goals tailored to your lifestyle.
          </p>
        </Card>

        <Card className='w-full sm:w-[300px] md:w-[400px] lg:w-[478px] h-auto p-6 flex flex-col items-start rounded-2xl'>
          <LuWallet className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]' />
          <h3 className='montesserat-400 text-xl sm:text-2xl mt-4'>Create Your Budget</h3>
          <p className='montesserat-300 text-sm sm:text-base mt-2 leading-relaxed'>
            Utilize our intuitive budgeting tools to plan your income and expenses.
          </p>
        </Card>

        <Card className='w-full sm:w-[300px] md:w-[400px] lg:w-[478px] h-auto p-6 flex flex-col items-start rounded-2xl'>
          <GiSettingsKnobs className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]' />
          <h3 className='montesserat-400 text-xl sm:text-2xl mt-4'>Track and Adjust</h3>
          <p className='montesserat-300 text-sm sm:text-base mt-2 leading-relaxed'>
            Adjust your budget as needed for optimal financial health.
          </p>
        </Card>
      </div>
    </section>
  )
}

export default HowItWorks