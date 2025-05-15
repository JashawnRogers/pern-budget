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

        const monthly_income = monthly_incomeRef.current.value
        const parsedIncome = parseFloat(monthly_income)
        const data = {monthly_income: parsedIncome}
        try {
            setError(null)
            await updateMonthlyIncome(data)
            setMonthlyIncomeUI(parsedIncome)
            monthly_incomeRef.current.value = ''
        } catch (error) {
            setError(error.message)
        }
    }

    useEffect(() => {
        const getAllTransactions = async () => {
            try {
                const data = await getTransactions()
                setTransactions(data)
            } catch (error) {
                setError(error.message)
            }
        }

        const getBudgets = async () => {
            try {
                const data = await getAllBudgets()
                setBudgets(data)
            } catch (error) {
                setError(error.message)
            }
        }

        const getIncome = async () => {
            try {
                const data = await getMonthlyIncome()
                setMonthlyIncomeUI(data)
            } catch (error) {
                setError(error.message)
            }
        }

        const getSavings = async () => {
            try {
                const data = await getAllSavingsGoals()
                setSavingsGoals(data.savings_goals)
            } catch (error) {
                setError(error.message)
            }
        }

        getSavings()
        getIncome()
        getBudgets()
        getAllTransactions()
    }, [])

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('')
            }, 5000)
            return () => clearTimeout(timer)
        }

    }, [error])

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
            render: item => `$${item.amount}`
        },
        {
            label: 'Budget', 
            accessor: 'category'
        }, 
        {
            label: 'Date', 
            accessor: 'created_at', 
            render: item => item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'
        }
    ]

    const SavingsColumns = [
        {
            label: 'Title',
            accessor: 'title',
        },
        {
            label: 'Target Amount',
            render: item => `$${item.target_amount}`
        },
        {
            label: 'Current Amount',
            render: item => `$${item.current_amount}`
        }
    ]


  return (
    <section className='p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch min-h-[80vh]'>
        {error && (
            <div className="col-span-full bg-red-100 text-red-800 p-4 rounded-lg border border-red-300">
                <strong>Error:</strong> {error}
            </div>
        )}
            <Card>
                <div className='flex flex-col p-3'>
                    <div className='flex gap-x-6 w-full justify-between'>
                    <h2 className='text-xl montesserat-400'>Balance</h2> 
                    <h2 className='text-base montesserat-400 p-1'>Monthly Income: ${monthlyIncomeUI.toFixed(2)}</h2>
                    </div>
                    <p className='text-sm montesserat-300'>{getDate()}</p>
                    <h3 className='text-6xl montesserat-400 mt-10 mx-auto'>{monthlyIncomeUI ? `$${(monthlyIncomeUI - transactionTotal).toFixed(2)}` : <p className='text-lg'>Please enter a monthly income to see your balance.</p>}</h3>
                    <form onSubmit={handleMonthlyIncome} method="put">
                        <label htmlFor="monthlyIncome">{monthlyIncomeUI ? 'Update Monthly Income:' :'Monthly Income:'}</label>
                        <input 
                            ref={monthly_incomeRef}
                            type='number'
                            step='0.01'
                            required
                            className='outline outline-black outline-solid ml-3 mt-10 rounded-3xl h-[40px] w-[150px] p-3'
                        />

                        <Button type='submit' className='bg-[#528265]! text-white w-fit ml-6'>Enter</Button>
                    </form>
                </div>
            </Card>

            
            <Card className='hover:cursor-pointer'>
                <Link to='/budget'>
                    <div className='flex flex-col p-3'>
                        <h2 className='text-xl montesserat-400'>Budget</h2>
                        <p className='text-sm montesserat-300'>Total amount budgeted</p>
                        <h3 className='text-6xl montesserat-400 mt-16 mx-auto'>${budgetTotal.toFixed(2)}</h3>
                    </div>
                </Link>
            </Card>
            

            <Card className='lg:row-span-3 flex flex-col h-full'>
                <Link to='/transactions' className='block h-full'>
                    <div className='flex flex-col p-3 h-full'>
                        <h2 className='text-xl montesserat-400 m-2 text-center'>Latest Transactions</h2>
                        <div className='flex-grow overflow-auto rounded-lg mt-5'>
                            <DataTable 
                                columns={TransactionColumns}
                                data={transactions}
                                styleConfig={{
                                    header: 'bg-green-100 text-green-900',
                                    row: 'hover:bg-green-50',
                                    cell: 'text-sm',
                                    table: 'rounded-lg'
                                }}
                            />
                        </div>
                    </div>
                </Link>
            </Card>   
            <Card>
                <div className='flex flex-col p-3'>
                    <h2 className='text-xl montesserat-400'>Expenses</h2>
                    <p className='text-sm montesserat-300'>Total expenses</p>
                    <h2 className='text-5xl montesserat-400 mt-10 mx-auto'>${transactionTotal.toFixed(2)}</h2>
                </div>
            </Card>
            <Card className='row-span-2'>
                <Link to='/savings'>
                    <div className='flex flex-col p-3'>
                        <h2 className='text-xl montesserat-400'>Savings Goals</h2>
                        <p className='text-sm montesserat-300'></p>
                        <div className='flex-grow overflow-auto rounded-lg mt-5'>
                                <DataTable 
                                    columns={SavingsColumns}
                                    data={savingsGoals}
                                    styleConfig={{
                                        header: 'bg-green-100 text-green-900',
                                        row: 'hover:bg-green-50',
                                        cell: 'text-sm',
                                        table: 'rounded-lg'
                                    }}
                                />
                            </div>
                    </div>
                </Link>
            </Card>
            <Card className=''>
                <Link to='/reports'>
                    <div className='flex flex-col p-3'>
                        <h2 className='text-xl montesserat-400'>Reports</h2>
                        <p className='text-sm montesserat-300'>Total budget for this month</p>
                        <h3 className='text-6xl montesserat-400 mt-16'>$10,000</h3>
                    </div>
                </Link>
            </Card>
    </section>
  )
}

export default DashboardContent