import { useState, useEffect } from 'react'
import { getAllBudgets } from '../api/budget/budget'
import { getAllSavingsGoals } from '../api/savings/savings'
import BudgetPieChart from '../components/reportsPage/BudgetPieChart'
import ProgressBar from '../components/reportsPage/ProgressBar'
import { toast } from 'react-hot-toast'


const sampleData = [
    { name: 'Food', amount: 300 },
    { name: 'Rent', amount: 800 },
    { name: 'Entertainment', amount: 150 },
]

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
    <div className='min-h-full'>
        <h1 className='montesserat-400 text-center text-white text-6xl mt-10'>Reports</h1>
        <div className='flex flex-col justify-around mx-auto my-auto mt-10'>
            <BudgetPieChart data={budgetData} />
            {savingsData && <ProgressBar data={savingsData.savings_goals} title='Savings Progress' />}
        </div>
    </div>
  )
}

export default ReportsPage