import Card from '../utils/Card'
import { SiMinds } from 'react-icons/si'
import { IoHappyOutline } from 'react-icons/io5'
import { VscGraph } from 'react-icons/vsc'
import budgetImage from '../../assets/budget-img.png'
import reportsImage from '../../assets/reports-img.png'
import transactionsImage from '../../assets/transactions-img.png'

const Features = () => {
  return (
    <section id='features' className='mt-28 px-4'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h2 className='montesserat-400 text-3xl sm:text-4xl md:text-5xl'>Intelligent Features</h2>
        <p className='montesserat-300 text-sm sm:text-base'>Create realistic budgets and track your spending effortlessly.</p>
        <p className='montesserat-300 text-sm sm:text-base'>Our features keep you focused and organized to help you stay on track.</p>
      </div>

      <div className='flex flex-wrap justify-center gap-6 mt-12'>
        <Card className='w-full max-w-[700px] rounded-2xl'>
          <div className='flex flex-col gap-y-3 p-6 sm:p-8'>
            <IoHappyOutline className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]' />
            <div>
              <h3 className='montesserat-400 text-2xl sm:text-3xl leading-snug'>Seamless Budgeting Experience</h3>
              <p className='montesserat-300 text-sm sm:text-base'>Experience hassle free budgeting with our user-friendly dashboard.</p>
              <p className='montesserat-300 text-sm sm:text-base'>Say goodbye to financial stress and hello to financial confidence.</p>
            </div>
          </div>
          <div className='w-full h-[200px] sm:h-[290px]'>
            <img 
              src={budgetImage} 
              alt="Dashboard preview" 
              className='w-full h-full object-cover rounded-b-2xl'
            />
          </div>
        </Card>

        <Card className='w-full max-w-[700px] rounded-2xl'>
          <div className='flex flex-col gap-y-3 p-6 sm:p-8'>
            <SiMinds className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]' />
            <div>
              <h3 className='montesserat-400 text-2xl sm:text-3xl leading-snug'>Trace Your Financial Journey</h3>
              <p className='montesserat-300 text-sm sm:text-base'>Gain insights over your spending patterns, identify trends, and track your financial growth over time.</p>
            </div>
          </div>
          <div className='w-full h-[200px] sm:h-[290px]'>
            <img 
              src={reportsImage} 
              alt="Dashboard preview" 
              className='w-full h-full object-cover rounded-b-2xl'
            />
          </div>
        </Card>

        <Card className='w-full rounded-2xl flex flex-col lg:flex-row overflow-hidden mt-8 max-w-[1435px]'>
          <div className='p-6 sm:p-8 flex flex-col gap-y-3'>
            <VscGraph className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]' />
            <div>
              <h3 className='montesserat-400 text-2xl sm:text-3xl leading-snug'>Expends & Income Categorization</h3>
              <p className='montesserat-300 text-sm sm:text-base leading-6'>Effortlessly categorize your expends and income for a detailed understanding of where your money goes. Identify spending trends, areas for potential savings, and make adjustments to optimize your budget.</p>
            </div>
          </div>
          <div className='flex-1 h-[200px] sm:h-[290px]'>
            <img 
              src={transactionsImage} 
              alt="Dashboard preview" 
              className='w-full h-full object-cover'
            />
          </div>
        </Card>
      </div>
    </section>
  )
}

export default Features