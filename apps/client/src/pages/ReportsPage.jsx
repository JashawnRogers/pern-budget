import { useState, useEffect } from 'react'
import { getAllBudgets } from '../api/budget/budget'
import { getAllSavingsGoals } from '../api/savings/savings'
import BudgetPieChart from '../components/reportsPage/BudgetPieChart'
import ProgressBar from '../components/reportsPage/ProgressBar'
import { toast } from 'react-hot-toast'

const ReportsPage = () => {
  const [budgetData, setBudgetData] = useState([])
  const [savingsData, setSavingsData] = useState(null)

  useEffect(() => {
    const fetchAllBudgets = async () => {
      try {
        const data = await getAllBudgets()
        setBudgetData(data)
      } catch (error) {
        toast.error('Failed to fetch budgets')
      }
    }

    const fetchAllSavingsGoals = async () => {
      try {
        const data = await getAllSavingsGoals()
        setSavingsData(data)
      } catch (error) {
        toast.error('Failed to fetch savings goals')
      }
    }

    fetchAllSavingsGoals()
    fetchAllBudgets()
  }, [])

  return (
    <div className='min-h-screen px-4 py-10 sm:px-6 lg:px-8'>
      <h1 className='text-4xl sm:text-5xl lg:text-6xl text-white text-center font-bold montesserat-400 mb-12'>
        Reports
      </h1>

      <div className='flex flex-col items-center justify-center space-y-12'>
        <div className='w-full max-w-4xl'>
          <BudgetPieChart data={budgetData} />
        </div>

        {savingsData && (
          <div className='w-full max-w-4xl'>
            <ProgressBar data={savingsData.savings_goals} title='Savings Progress' />
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportsPage