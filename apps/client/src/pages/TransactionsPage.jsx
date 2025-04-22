import {useState, useEffect, useRef} from 'react'
import Modal from '../components/utils/Modal'
import Button from '../components/utils/Button'
import { createTransaction, getTransactions } from '../api/transaction/transactions'
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
    const [type, setType] = useState('')
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

    const handleCreateTransaction = async (e) => {
        e.preventDefault()
        const amount = amountRef.current.value
        const vendor = vendorRef.current.value
        const created_at = createdAtRef.current.value

        const data = {amount, type, category, description, vendor, created_at}

        try {
            setError(null)
            await createTransaction(data)
            const newTransactions = await getTransactions()
            setTransactions(newTransactions)
            amountRef.current.value = ''
            vendorRef.current.value = ''
            setType('')
            setCategory('')
            setDescription('')
            closeModal()
            console.log('Succes:',data)
        } catch (error) {
            console.log('Fail:',data)
            setError(error.message || 'Something went wrong')
        }
    }



  return (
    <>
        {error && (
            alert(error)
        )}
        <div className='flex flex-col items-center gapy-y-32 justify-center min-h-[60vh] static'>
            <div className='min-h-[30vh] content-center'>
                <div className='flex gap-x-4'>
                    <Button className='cursor-pointer flex gap-x-2 text-3xl montesserat-300' onClick={openModal}>Create new transaction <GoPlus className='mt-1' /></Button>
                </div>
            </div>
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
                    <label htmlFor='type'>Type:</label>
                    <select 
                        id='type' 
                        value={type} 
                        required
                        className='outline outline-black outline-solid ml-3 rounded-3xl h-[40px] w-[350px] pl-3' 
                        onChange={(e) => setType(e.target.value)}
                    >

                    <option value=''>Select an option</option>
                        <option value='debit'>Debit</option>
                        <option value='credit'>Credit</option>
                    </select>
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