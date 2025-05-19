import { useState, useRef, useEffect } from 'react'
import { GoPlus } from 'react-icons/go'
import Modal from '../components/utils/Modal'
import Button from '../components/utils/Button'
import { createSavingsGoal, getAllSavingsGoals, updateSavingsGoal, deleteSavingsGoal } from '../api/savings/savings'
import DataTable from '../components/utils/DataTable'
import { MdDeleteForever } from 'react-icons/md'
import { toast } from 'react-hot-toast'

const SavingsPage = () => {
  const [error, setError] = useState(null)
  const [savings, setSavings] = useState([])
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('')

  const columns = [
    {label: 'Title', accessor: 'title'},
    {label: 'Target Amount', render: item => `$${item.target_amount}`},
    {label: 'Current Amount', render: item => `$${item.current_amount}`},
    {label: 'Updated', render: item => item.updated_at ? new Date(item.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'},
    {label: 'Date Created', render: item => new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })},
    {label: 'Delete', render: item => 
    <button onClick={async (e) => {
      e.stopPropagation()
      const confirmed = window.confirm('Are you sure you want to delete this savings goal?')
      if (confirmed) {
        await deleteSavingsGoal(parseInt(item.savings_id))
        const { savings_goals } = await getAllSavingsGoals()
        setSavings(savings_goals)
      }
    }} className='hover:cursor-pointer'>
      <MdDeleteForever className='h-[30px] w-[30px] text-red-500' />
    </button>}
  ]

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedGoal(null)
    setTitle('')
    setTargetAmount('')
  }

  useEffect(() => {
    const fetchAllSavingsGoals = async () => {
      try {
        const data = await getAllSavingsGoals()
        setSavings(data.savings_goals)
      } catch (error) {
        toast.error(error.message)
      }
    }

    fetchAllSavingsGoals()
  }, [])

  useEffect(() => {
    if (isModalOpen) {
      if (selectedGoal) {
        console.log(selectedGoal)
        setTitle(selectedGoal.title)
        setTargetAmount(selectedGoal.target_amount)
        setCurrentAmount(selectedGoal.current_amount)
      } else {
        setTitle('')
        setTargetAmount('')
        setCurrentAmount('')
      }
    }
  }, [isModalOpen ,selectedGoal])

  const handleCreateSavingsGoal = async (e) => {
    e.preventDefault()
    
    const parsedTargetAmount = parseFloat(targetAmount)
    const parsedCurrentAmount = parseFloat(currentAmount)

    if (!title || isNaN(parsedTargetAmount)) {
      toast.error('Title and amount are required')
      return
    }

    
    if (selectedGoal) {
      await toast.promise(
        updateSavingsGoal({
          savings_id: selectedGoal.savings_id,
          title,
          target_amount: parsedTargetAmount,
          current_amount: parsedCurrentAmount
        }),
        {
          loading: 'Updating savings goal...',
          success: 'Successfully updated savings goal!',
          error: (error) => error.message || 'Something went wrong'
        }
      )
    } else {
      await toast.promise(
        createSavingsGoal({ title, target_amount: parsedTargetAmount, current_amount: parsedCurrentAmount }),
        {
          loading: 'Creating savings goal...',
          success: 'Successfully created savings goal!',
          error: (error) => error.message || 'Something went wrong'
        }
      )
    }

    try {
      const updatedGoals = await getAllSavingsGoals()
      setSavings(updatedGoals.savings_goals)
      closeModal()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <div className='flex flex-col items-center gap-y-12 justify-center min-h-[60vh] static'>
        <div className='mt-12'>
                <h2 className='text-5xl montesserat-400 text-white'>Savings Goals</h2>
        </div>
        <div className='min-h-[30vh] content-center'>
          <div className='flex gap-x-4'>
            <Button className='!bg-[#528265] cursor-pointer flex gap-x-2 text-3xl text-white shadow-md montesserat-300' onClick={openModal}>Create New Savings Goal <GoPlus className='mt-1'/></Button>
          </div>
        </div>
        <div className='min-w-1/2 min-h-[55vh]'>
          {savings ? <DataTable 
            columns={columns}
            data={savings}
            onRowClick={(goal) => {
              setSelectedGoal(goal)
              setIsModalOpen(true)
            }}
            styleConfig={{
              header: '',
              row: 'hover:bg-green-50 hover:cursor-pointer',
              cell: 'text-sm',
              table: 'rounded-lg shadow-md',
            }}
            /> : <p className='montesserat-300 text-xl text-center'>Savings goals will appear here after they're created.</p>}
            </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form onSubmit={handleCreateSavingsGoal} method="post" className='grid items-center gap-4'>
                <div className='grid grid-cols-[150px_1fr] items-center gap-x-4'>
                  <label 
                    htmlFor="title" 
                    className='text-right'>Title:
                  </label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className='outline outline-black outline-solid ml-3 rounded-3xl h-[40px] w-[350px] pl-3'
                    />
                </div>
                <div className='grid grid-cols-[150px_1fr] items-center gap-x-4'>
                  <label 
                    htmlFor="max-amount" 
                    className='text-right'>Target Amount:</label>
                  <input 
                    type="number" 
                    step='0.01'
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    required
                    className='outline outline-black outline-solid ml-3 rounded-3xl h-[40px] w-[350px] pl-3'
                  />
              </div>
              <div className='grid grid-cols-[150px_1fr] items-center gap-x-4'>
                <label
                  htmlFor='current-amount'
                  className='text-right'
                >
                  Current Amount:
                </label>
                <input 
                  type="number"
                  step='0.01'
                  value={currentAmount}
                  required
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className='outline outline-black outline-solid ml-3 rounded-3xl h-[40px] w-[350px] pl-3'
                />
              </div>

            <Button type='submit' className='bg-[#528265]! text-white w-fit place-self-center my-5'>Complete</Button>
          </form>
         </Modal>
      </>
  )
}

export default SavingsPage