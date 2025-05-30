import { useEffect, useState, useRef } from 'react'
import Card from '../utils/Card'
import { Link } from 'react-router-dom'
import { getTransactions } from '../../api/transaction/transactions'
import { getAllBudgets } from '../../api/budget/budget'
import { getAllSavingsGoals } from '../../api/savings/savings'
import { updateMonthlyIncome, getMonthlyIncome } from '../../api/user/user'
import DataTable from '../utils/DataTable'
import Button from '../utils/Button'
import { getDate } from '../utils/getDate'
import { toast } from 'react-hot-toast'

const DashboardContent = () => {
  const monthly_incomeRef = useRef()
  const [transactions, setTransactions] = useState([])
  const [savingsGoals, setSavingsGoals] = useState([])
  const [transactionTotal, setTransactionTotal] = useState(0)
  const [budgets, setBudgets] = useState([])
  const [budgetTotal, setBudgetTotal] = useState(0)
  const [monthlyIncomeUI, setMonthlyIncomeUI] = useState(0)
  const [error, setError] = useState('')

  const handleMonthlyIncome = async (e) => {
    e.preventDefault()

    if (monthly_incomeRef === '') {
      toast.error('Must enter a number to update monthly income')
      return
    }

    const monthly_income = monthly_incomeRef.current.value
    const parsedIncome = parseFloat(monthly_income)
    const data = { monthly_income: parsedIncome }

    try {
      setError(null)
      await updateMonthlyIncome(data)
      setMonthlyIncomeUI(parsedIncome)
      monthly_incomeRef.current.value = ''
      toast.success('Monthly income successfully updated!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const data = await getTransactions()
        setTransactions(data)
      } catch (error) {
        toast.error(error.message)
      }
    }

    const getBudgets = async () => {
      try {
        const data = await getAllBudgets()
        setBudgets(data)
      } catch (error) {
        toast.error(error.message)
      }
    }

    const getIncome = async () => {
      try {
        const data = await getMonthlyIncome()
        setMonthlyIncomeUI(data)
      } catch (error) {
        toast.error(error.message)
      }
    }

    const getSavings = async () => {
      try {
        const data = await getAllSavingsGoals()
        setSavingsGoals(data.savings_goals)
      } catch (error) {
        toast.error(error.message)
      }
    }

    getSavings()
    getIncome()
    getBudgets()
    getAllTransactions()
  }, [])

  useEffect(() => {
    if (transactions.length > 0) {
      const total = transactions.reduce((acc, transaction) => {
        return acc + parseFloat(transaction.amount)
      }, 0)
      setTransactionTotal(total)
    } else {
      setTransactionTotal(0)
    }
  }, [transactions])

  useEffect(() => {
    if (budgets.length > 0) {
      const total = budgets.reduce((acc, budget) => {
        return acc + parseFloat(budget.amount_limit)
      }, 0)
      setBudgetTotal(total)
    } else {
      setBudgetTotal(0)
    }
  }, [budgets])

  const TransactionColumns = [
    {
      label: 'Transaction Amount',
      accessor: 'amount',
      render: (item) => `$${item.amount}`,
    },
    {
      label: 'Budget',
      accessor: 'category',
    },
    {
      label: 'Date',
      accessor: 'created_at',
      render: (item) =>
        item.created_at
          ? new Date(item.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
          : '-',
    },
  ]

  const SavingsColumns = [
    {
      label: 'Title',
      accessor: 'title',
    },
    {
      label: 'Target Amount',
      render: (item) => `$${item.target_amount}`,
    },
    {
      label: 'Current Amount',
      render: (item) => `$${item.current_amount}`,
    },
  ]

  return (
    <section className='p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch min-h-[80vh]'>
      <Card>
        <div className='flex flex-col p-3'>
          <div className='flex flex-col md:flex-row gap-y-2 md:gap-x-6 w-full justify-between'>
            <h2 className='text-2xl md:text-3xl font-semibold montesserat-400'>
              Balance
            </h2>
            <h2 className='text-sm md:text-base montesserat-400 p-1'>
              Monthly Income: ${monthlyIncomeUI.toFixed(2)}
            </h2>
          </div>

          <p className='text-xs md:text-sm montesserat-300'>{getDate()}</p>

          <h3 className='text-4xl md:text-4xl lg:text-5xl xl:text-6xl montesserat-400 mt-10 mx-auto text-center break-words'>
            {monthlyIncomeUI ? (
              `$${(monthlyIncomeUI - transactionTotal).toFixed(2)}`
            ) : (
              <p className='text-sm md:text-base lg:text-lg text-center'>
                Please enter a monthly income to see your balance.
              </p>
            )}
          </h3>

          <form
            onSubmit={handleMonthlyIncome}
            method='put'
            className='flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-5 w-full'
          >
            <label
              htmlFor='monthlyIncome'
              className='text-sm font-medium text-gray-700'
            >
              {monthlyIncomeUI ? 'Update Monthly Income:' : 'Monthly Income:'}
            </label>

            <div className='flex sm:flex-col sm:flex-row gap-2 w-full md:w-auto'>
              <input
                ref={monthly_incomeRef}
                type='number'
                step='0.01'
                required
                className='w-full  rounded-lg h-10 border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-[#528265] focus:border-transparent text-sm'
              />
              <Button
                type='submit'
                className='w-full  px-4 py-2 !bg-[#528265] text-white rounded-lg text-sm md:text-base font-semibold'
              >
                Enter
              </Button>
            </div>
          </form>
        </div>
      </Card>

      <Card className='hover:cursor-pointer'>
        <Link to='/budget'>
          <div className='flex flex-col p-3'>
            <h2 className='text-2xl md:text-3xl font-semibold montesserat-400'>
              Budget
            </h2>
            <p className='text-xs md:text-sm montesserat-300'>
              Total amount budgeted
            </p>
            <h3 className='text-4xl md:text-6xl montesserat-400 mt-16 mx-auto'>
              ${budgetTotal.toFixed(2)}
            </h3>
          </div>
        </Link>
      </Card>

      <Card className='lg:row-span-3 flex flex-col h-full'>
        <Link to='/transactions' className='block h-full'>
          <div className='flex flex-col p-3 h-full'>
            <h2 className='text-2xl md:text-3xl font-semibold montesserat-400 m-2 text-center'>
              Latest Transactions
            </h2>
            <div className='flex-grow overflow-auto rounded-lg mt-5'>
              <DataTable
                columns={TransactionColumns}
                data={transactions}
                styleConfig={{
                  header: 'border',
                  row: 'hover:bg-green-50',
                  cell: 'text-xs md:text-sm',
                  table: 'rounded-lg',
                }}
              />
            </div>
          </div>
        </Link>
      </Card>

      <Card>
        <div className='flex flex-col p-3'>
          <h2 className='text-2xl md:text-3xl font-semibold montesserat-400'>
            Expenses
          </h2>
          <p className='text-xs md:text-sm montesserat-300'>Total expenses</p>
          <h2 className='text-4xl md:text-5xl montesserat-400 mt-10 mx-auto'>
            ${transactionTotal.toFixed(2)}
          </h2>
        </div>
      </Card>

      <Card className='row-span-2'>
        <Link to='/savings'>
          <div className='flex flex-col p-3'>
            <h2 className='text-2xl md:text-3xl font-semibold montesserat-400'>
              Savings Goals
            </h2>
            <div className='flex-grow overflow-auto rounded-lg mt-5'>
              <DataTable
                columns={SavingsColumns}
                data={savingsGoals}
                styleConfig={{
                  header: 'border',
                  row: 'hover:bg-green-50',
                  cell: 'text-xs md:text-sm',
                  table: 'rounded-lg',
                }}
              />
            </div>
          </div>
        </Link>
      </Card>

      <Card>
        <Link to='/reports'>
          <div className='flex flex-col p-3'>
            <h2 className='text-2xl md:text-3xl font-semibold montesserat-400'>
              Reports
            </h2>
            <p className='text-xs md:text-sm montesserat-300'>
              Total budget for this month
            </p>
            <h3 className='text-lg md:text-2xl lg:text-3xl montesserat-400 mt-12 text-center'>
              Click here to see your reports
            </h3>
          </div>
        </Link>
      </Card>
    </section>
  )
}

export default DashboardContent
