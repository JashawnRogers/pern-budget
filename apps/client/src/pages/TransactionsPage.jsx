import {useState, useEffect, useRef} from 'react'
import Modal from '../components/utils/Modal'
import Button from '../components/utils/Button'
import { createTransaction, getTransactions, deleteTransaction } from '../api/transaction/transactions'
import DataTable from '../components/utils/DataTable'
import { MdDeleteForever } from 'react-icons/md'
import { GoPlus } from 'react-icons/go'
import { getAllBudgets } from '../api/budget/budget'


const TransactionsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [error, setError] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [budgets, setBudgets] = useState([])
    const vendorRef = useRef()
    const amountRef = useRef()
    const createdAtRef = useRef()

    const openModal = () => {
        setIsModalOpen(true)
    }
    const closeModal = () => {
        setIsModalOpen(false)
    }

    useEffect(() => {
        const fetchAllBudgets = async () => {
            try {
                const data = await getAllBudgets()
                setBudgets(data)
            } catch (error) {
                setError(error.message)
            }
        }

        const getAllTransactions = async () => {
            try {
                const data = await getTransactions()
                setTransactions(data)
            } catch (error) {
                setError(error.message)
            }
        }
        fetchAllBudgets()
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

    const handleCreateTransaction = async (e) => {
        e.preventDefault()
        const amount = amountRef.current.value
        const vendor = vendorRef.current.value
        const created_at = createdAtRef.current.value

        const data = {amount, category, description, vendor, created_at}

        try {
            setError(null)
            await createTransaction(data)
            const newTransactions = await getTransactions()
            setTransactions(newTransactions)
            amountRef.current.value = ''
            vendorRef.current.value = ''
            setCategory('')
            setDescription('')
            closeModal()
        } catch (error) {
            setError(error.message || "Something's acting up.. My bad")
        }
    }

    const columns = [
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
            label: 'Vendor', 
            accessor: 'vendor'
        },
        {
            label: 'Date', 
            accessor: 'created_at', 
            render: item => item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'
        },
        {
            label: 'Description', 
            accessor: 'description', 
            render: item => item.description ? 
            <textarea readOnly disabled defaultValue={item.description} className='border-none p-2 overflow-auto'></textarea>: 'N/A'
        },
        {label: 'Delete', render: item => <button onClick={async () => {
            const confirmed = window.confirm('Are you sure you want to delete this budget?')
            if (confirmed) {
               await deleteTransaction(item.id)
               console.log('Successfully deleted transaction:', item.transaction)
               const updatedTransactions = await getTransactions()
               setTransactions(updatedTransactions)
            }
        }} 
        className='hover:cursor-pointer'><MdDeleteForever className='h-[30px] w-[30px]' /></button>}
    ]

  return (
    <>
        {error && (
            <div className="col-span-full bg-red-100 text-red-800 p-4 rounded-lg border border-red-300">
                <strong>Error:</strong> {error}
            </div>
        )}
        <div className='flex flex-col items-center gapy-y-32 justify-center max-h-[40vh] static'>
            <div className='min-h-[30vh] content-center'>
                <div className='flex gap-x-4'>
                    <Button className='cursor-pointer flex gap-x-2 text-3xl montesserat-300' onClick={openModal}>Create new transaction <GoPlus className='mt-1' /></Button>
                </div>
            </div>
        </div>
        <div className='flex justify-center min-w-3/4 max-h-[55vh]'>
            { transactions ? 
                <DataTable 
                    columns={columns}
                    data={transactions}
                    styleConfig={{
                        header: 'bg-green-100 text-green-900',
                        row: 'hover:bg-green-50',
                        cell: 'text-sm',
                        table: 'rounded-lg shadow-md'
                    }}
                /> : <p className='montesserat-300 text-xl text-center'>Transaction will appear here after they're created.</p>
            
            }
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form onSubmit={handleCreateTransaction} method='post' className='grid items-center gap-4'>
                <div className='grid grid-cols-[150px_1fr] items-center gap-x-4'>
                    <label htmlFor='amount'>Amount:</label>
                    <input
                        id='amount' 
                        type='number'
                        step='0.01'
                        ref={amountRef}
                        required
                        className='outline outline-black outline-solid ml-3 rounded-3xl h-[40px] w-[350px] p-3'
                    />
                </div>
                <div className='grid grid-cols-[150px_1fr] items-center gap-x-4'>
                    <label htmlFor='category'>Budget Category:</label>
                    <select 
                        className='outline outline-black outline-solid ml-3 rounded-3xl h-[40px] w-[350px] pl-3'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        {budgets.map((budget) => (
                            <option key={budget.budget_id} value={budget.category}>
                                {budget.category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='grid grid-cols-[150px_1fr] items-center gap-x-4'>
                    <label htmlFor='vendor'>Vendor:</label>
                    <input
                        id='vendor'
                        type='text' 
                        ref={vendorRef}
                        required
                        className='outline outline-black outline-solid ml-3 rounded-3xl h-[40px] w-[350px] p-3'
                    />
                </div>
                <div className='grid grid-cols-[150px_1fr] items-center gap-x-4'>
                    <label htmlFor='createdAt'>Date of transaction:</label>
                    <input
                        id='createdAt'
                        type='date'
                        ref={createdAtRef}
                        className='outline outline-black outline-solid ml-3 rounded-3xl h-[40px] w-[350px] p-3'
                    />
                </div>
                <div className='grid grid-cols-[150px_1fr] items-center gap-x-4'>
                    <label htmlFor='description'>Description:</label>
                    <textarea name='description' id='description' onChange={(e) => setDescription(e.target.value)} className='outline outline-black outline-solid rounded-3xl p-3 w-[350px] ml-3'></textarea>
                </div>

                <Button type='submit' className='bg-[#528265]! text-white w-fit place-self-center my-5'>Create Transaction</Button>
            </form>
        </Modal>
    </>
  )
}

export default TransactionsPage