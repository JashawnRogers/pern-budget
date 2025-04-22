import { useState, useRef, useEffect } from 'react'
import { GoPlus } from 'react-icons/go'
import Modal from '../components/utils/Modal'
import Button from '../components/utils/Button'
import { createBudget, getAllBudgets, deleteBudget } from '../api/budget/budget'
import DataTable from '../components/utils/DataTable'
import { MdDeleteForever } from 'react-icons/md'

const Budget = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [error, setError] = useState(null)
    const [budgets, setBudgets] = useState([])
    const categoryRef = useRef()
    const amountLimitRef = useRef()

    const columns = [
        { label: 'Name', accessor: 'category' },
        { label: 'Budget Limit', render: item => `$${item.amount_limit}` },
        { label: 'Total Spent', render: item => item.total_spent ? `$${item.total_spent}`: '$0' },
        { label: 'Date Created', render: item => item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-' },
        { label: 'Delete', render: item => <button onClick={async () => {
            const confirmed = window.confirm('Are you sure you want to delete this budget?')
            if (confirmed) {
               await deleteBudget(item.budget_id)
               const updatedBudgets = await getAllBudgets()
               setBudgets(updatedBudgets)
            }
        }} 
        className='hover:cursor-pointer'><MdDeleteForever className='h-[30px] w-[30px]' /></button>}
      ]

    useEffect(() => {
        const fetchAllBudgets = async () => {
            try {
                const data = await getAllBudgets()
                setBudgets(data)
            } catch (error) {
                setError(error.message)
            }
        }
        fetchAllBudgets()
    }, [])

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleCreateBudget = async (e) => {
        e.preventDefault()
        const category = categoryRef.current.value
        const amount_limit = amountLimitRef.current.value

        const data = {category, amount_limit}

        try {
            setError(null)
            await createBudget(data)
            const newBudgets = await getAllBudgets()
            setBudgets(newBudgets)
            categoryRef.current.value = ''
            amountLimitRef.current.value = ''
            closeModal()
            
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <>
        <div className='flex flex-col items-center gap-y-32 justify-center min-h-[60vh] static'>
            <div className='min-h-[30vh] content-center'>
                <div className='flex gap-x-4'>
                    <Button className='cursor-pointer flex gap-x-2 text-3xl montesserat-300' onClick={openModal}>Create new budget category <GoPlus className='mt-1'/></Button>
                </div>
            </div>
            <div className='min-w-1/2 min-h-[30vh]'>
                {budgets ? <DataTable 
                    columns={columns}
                    data={budgets}
                    styleConfig={{
                        header: 'bg-green-100 text-green-900',
                        row: 'hover:bg-green-50',
                        cell: 'text-sm',
                        table: 'rounded-lg shadow-md',
                    }}
                /> : <p className='montesserat-300 text-xl text-center'>Budgets will appear here after they're created.</p>}
            </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form onSubmit={handleCreateBudget} method="post" className='grid items-center gap-4'>
                <div className='grid grid-cols-[150px_1fr] items-center gap-x-4'>
                    <label htmlFor="category" aria-placeholder='Shopping, Utilites, Vacation...' className='text-right'>Category:</label>
                    <input 
                        type="text" 
                        ref={categoryRef}
                        required
                        className='outline outline-black outline-solid ml-3 rounded-3xl h-[40px] w-[350px] pl-3'
                    />
                </div>
                <div className='grid grid-cols-[150px_1fr] items-center gap-x-4'>
                    <label htmlFor="max-amount" className='text-right'>Maximum Amount:</label>
                    <input 
                        type="number" 
                        step='0.01'
                        ref={amountLimitRef}
                        required
                        className='outline outline-black outline-solid ml-3 rounded-3xl h-[40px] w-[350px] pl-3'
                    />
                </div>

                <Button type='submit' className='bg-[#528265]! text-white w-fit place-self-center my-5'>Complete</Button>
            </form>
        </Modal>
    </>
  )
}

export default Budget