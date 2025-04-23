import { useEffect, useState } from 'react'
import Card from '../utils/Card'
import { Link } from 'react-router-dom'
import { getTransactions } from '../../api/transaction/transactions'
import DataTable from '../utils/DataTable'

const DashboardContent = () => {
    const [transactions, setTransactions] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        const getAllTransactions = async () => {
            try {
                const data = await getTransactions()
                setTransactions(data)
            } catch (error) {
                setError(error.message)
            }
        }

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

    const columns = [
        {
            label: 'Transaction Amount', 
            accessor: 'amount', 
            render: item => `$${item.amount}`
        },
        {
            label: 'Type', 
            accessor: 'type' 
        },
        {
            label: 'Budget', 
            accessor: 'category'
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
                    <h2 className='text-xl montesserat-400'>Your balance</h2>
                    <p className='text-sm montesserat-300'>Today, Apr 5</p>
                    <h3 className='text-6xl montesserat-400 mt-16'>$10,000</h3>
                </div>
            </Card>

            
            <Card className='hover:cursor-pointer'>
                <Link to='/budget'>
                    <div className='flex flex-col p-3'>
                        <h2 className='text-xl montesserat-400'>Budget</h2>
                        <p className='text-sm montesserat-300'>Total budget for this month</p>
                        <h3 className='text-6xl montesserat-400 mt-16'>$10,000</h3>
                    </div>
                </Link>
            </Card>
            

            <Card className='lg:row-span-3 flex flex-col h-full'>
                <Link to='/transactions' className='block h-full'>
                    <div className='flex flex-col p-3 h-full'>
                        <h2 className='text-xl montesserat-400'>Latest Transactions</h2>
                        <p className='text-sm montesserat-300'>Transactions from this week</p>
                        <div className='flex-grow overflow-auto rounded-lg'>
                            <DataTable 
                                columns={columns}
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
                    <p className='text-sm montesserat-300'>Total expenses for this month</p>
                    <h3 className='text-3xl montesserat-400 mt-16'>$10,000</h3>
                </div>
            </Card>
            <Card>
                <div className='flex flex-col p-3'>
                    <h2 className='text-xl montesserat-400'>Income</h2>
                    <p className='text-sm montesserat-300'>Total Income for this month</p>
                    <h3 className='text-3xl montesserat-400 mt-16'>$10,000</h3>
                </div>
            </Card>
            <Card className='lg:col-span-2'>
                <div className='flex flex-col p-3'>
                    <h2 className='text-xl montesserat-400'>Reports</h2>
                    <p className='text-sm montesserat-300'>Total budget for this month</p>
                    <h3 className='text-6xl montesserat-400 mt-16'>$10,000</h3>
                </div>
            </Card>
    </section>
  )
}

export default DashboardContent