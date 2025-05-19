import {useState, useEffect, useRef} from 'react'
import Modal from '../components/utils/Modal'
import Button from '../components/utils/Button'
import { createTransaction, getTransactions, deleteTransaction, updateTransaction } from '../api/transaction/transactions'
import DataTable from '../components/utils/DataTable'
import { MdDeleteForever } from 'react-icons/md'
import { GoPlus } from 'react-icons/go'
import { getAllBudgets } from '../api/budget/budget'
import { toast } from 'react-hot-toast'
import ConfirmDialog from '../components/utils/ConfirmDialog'


const TransactionsPage = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [transactionToDelete, setTransactionToDelete] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [selectedTransaction, setSelectedTransaction] = useState(null)
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [vendor, setVendor] = useState('')
    const [amount, setAmount] = useState('')
    const [created_at, setCreated_at] = useState('')
    const [budgets, setBudgets] = useState([])
  

    const openModal = () => {
        setIsModalOpen(true)
    }
    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedTransaction(null)
    }

    useEffect(() => {
        const fetchAllBudgets = async () => {
            try {
                const data = await getAllBudgets()
                setBudgets(data)
            } catch (error) {
                toast.error(error.message)
            }
        }

        const getAllTransactions = async () => {
            try {
                const data = await getTransactions()
                setTransactions(data)
            } catch (error) {
                toast.error(error.message)
            }
        }
        fetchAllBudgets()
        getAllTransactions()
    }, [])

    useEffect(() => {
        if (isModalOpen) {
            if (selectedTransaction) {
                setAmount(selectedTransaction.amount)
                setVendor(selectedTransaction.vendor || '')
                setCategory(selectedTransaction.category)
                setDescription(selectedTransaction.description || '')
                setCreated_at(selectedTransaction.created_at?.slice(0, 10) || '')
            } else {
                setAmount('')
                setVendor('')
                setCategory('')
                setDescription('')
                setCreated_at('')
            }
        }
    }, [isModalOpen, selectedTransaction])


    const handleCreateTransaction = async (e) => {
        e.preventDefault()

        if (!amount && !vendor && !description && !category) {
            toast.error('Cannot create transaction without any filling out any fields.')
            return
        }

        if (!category) {
            toast.error('Cannot create transaction without a category')
            return
        }

        if (!amount) {
            toast.error('Cannot create transaction without setting an amount')
            return
        }


        const data = {amount, category, description, vendor, created_at}

    
        if (selectedTransaction) {
            await toast.promise(
                updateTransaction({amount, category, description, vendor, id: selectedTransaction.id}),
                {
                    loading: 'Updating transaction...',
                    success: 'Successfully updated transaction!',
                    error: (error) => error.message || 'Something went wrong'
                }
            )
        } else {
            await toast.promise(
                createTransaction(data),
                {
                    loading: 'Creating transaction...',
                    success: 'Successfully created transaction!',
                    error: (error) => error.message || 'Something went wrong'
                }
            ) 
            }
        try {
            const newTransactions = await getTransactions()
            setTransactions(newTransactions)

            setAmount('')
            setVendor('')
            setCategory('')
            setDescription('')
            closeModal()
        } catch (error) {
            toast.error(error.error || "Something's acting up.. My bad")
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
        {label: 'Delete', render: item => 
            <button 
                onClick={(e) => {
                    e.stopPropagation()
                    setTransactionToDelete(item)
                    setIsDialogOpen(true)
                }} 
                className='hover:cursor-pointer'
            >
                <MdDeleteForever className='h-[30px] w-[30px] text-red-500' />
            </button>
        }
    ]

  return (
    <>
        <div className='flex flex-col items-center gapy-y-12 justify-center max-h-[40vh] static'>
            <div className='mt-12'>
                <h2 className='text-5xl montesserat-400 text-white'>Transactions</h2>
            </div>
            <div className='min-h-[30vh] content-center'>
                <div className='flex gap-x-4'>
                    <Button className='!bg-[#528265] cursor-pointer flex gap-x-2 text-3xl text-white shadow-md montesserat-300' onClick={openModal}>Create New Transaction <GoPlus className='mt-1' /></Button>
                </div>
            </div>
        </div>
        <div className='flex justify-center min-w-3/4'>
            { transactions ? 
                <DataTable 
                    columns={columns}
                    data={transactions}
                    onRowClick={(transaction) => {
                        setSelectedTransaction(transaction)
                        setIsModalOpen(true)
                    }}
                    styleConfig={{
                        header: '',
                        row: 'hover:bg-green-50',
                        cell: 'text-sm',
                        table: 'rounded-lg shadow-md'
                    }}
                /> : <p className='montesserat-300 text-xl text-center'>Transaction will appear here after they're created.</p>
            
            }
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <h2 className='text-3xl text-center mb-8'>
                {selectedTransaction ? 'Edit Transaction' : 'Create New Transaction'}
            </h2>
            <form onSubmit={handleCreateTransaction} method='post' className='grid items-center gap-4'>
                <div className='grid grid-cols-[150px_1fr] items-center gap-x-4'>
                    <label 
                        htmlFor='amount'
                        className='block text-sm text-right font-medium text-gray-700 mb-1'
                    >
                        Amount:
                    </label>
                    <input
                        id='amount' 
                        type='number'
                        step='0.01'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className='w-3/4 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265] focus:border-transparent'
                    />
                </div>
                <div className='grid grid-cols-[150px_1fr] items-center gap-x-4'>
                    <label 
                        htmlFor='category'
                        className='block text-sm text-right font-medium text-gray-700 mb-1'
                    >
                        Budget Category:
                    </label>
                    <select 
                        className='w-3/4 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265] focus:border-transparent'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                    <option value="" disabled>Select a category</option>
                        {budgets.map((budget) => (
                            <option key={budget.budget_id} value={budget.category}>
                                {budget.category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='grid grid-cols-[150px_1fr] items-center gap-x-4'>
                    <label 
                        htmlFor='vendor'
                        className='block text-sm text-right font-medium text-gray-700 mb-1'
                    >
                        Vendor:
                    </label>
                    <input
                        id='vendor'
                        type='text' 
                        value={vendor}
                        onChange={(e) => setVendor(e.target.value)}
                        required
                        className='w-3/4 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265] focus:border-transparent'
                    />
                </div>
                <div className='grid grid-cols-[150px_1fr] items-center gap-x-4'>
                    <label 
                        htmlFor='createdAt'
                        className='block text-sm text-right font-medium text-gray-700 mb-1'
                    >
                        Date of transaction:
                    </label>
                    <input
                        id='createdAt'
                        type='date'
                        value={created_at}
                        onChange={(e) => setCreated_at(e.target.value)}
                        className='w-3/4 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265] focus:border-transparent'
                    />
                </div>
                <div className='grid grid-cols-[150px_1fr] items-center gap-x-4'>
                    <label 
                        htmlFor='description'
                        className='block text-sm text-right font-medium text-gray-700 mb-1'
                    >
                        Description:
                    </label>
                    <textarea 
                        name='description' 
                        id='description' 
                        onChange={(e) => setDescription(e.target.value)} 
                        className='w-3/4 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265] focus:border-transparent'
                    />
                </div>

                <Button 
                    type='submit' 
                    className='w-1/2 mx-auto my-4 py-2 !bg-[#528265] text-white rounded-lg text-lg font-semibold transition-colors'
                >
                    Complete
                </Button>
            </form>
        </Modal>
        <ConfirmDialog
          isOpen={isDialogOpen}
          message='Are you sure you want to delete this transaction?'
          onCancel={() => {
            setIsDialogOpen(false)
            setGoalToDelete(null)
          }}
          onConfirm={async () => {
            if (!transactionToDelete) return
            try {
              await toast.promise(
                deleteTransaction(transactionToDelete.id),
                {
                  loading: 'Deleting...',
                  success: 'Savings goal deleted!',
                  error: (error) => error.message || 'Delete failed',
                }
              )
              const updatedTransactions = await getTransactions()
              setTransactions(updatedTransactions)
            } catch (error) {
              toast.error(error.message)
            } finally {
              setIsDialogOpen(false)
              setTransactionToDelete(null)
            }
          }}
        />
    </>
  )
}

export default TransactionsPage