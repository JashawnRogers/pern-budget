import { useState, useEffect } from 'react'
import { GoPlus } from 'react-icons/go'
import { MdDeleteForever } from 'react-icons/md'
import { toast } from 'react-hot-toast'
import Modal from '../components/utils/Modal'
import Button from '../components/utils/Button'
import ConfirmDialog from '../components/utils/ConfirmDialog'
import DataTable from '../components/utils/DataTable'
import {
  createSavingsGoal,
  getAllSavingsGoals,
  updateSavingsGoal,
  deleteSavingsGoal
} from '../api/savings/savings'

const SavingsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [goalToDelete, setGoalToDelete] = useState(null)
  const [savings, setSavings] = useState([])
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('')

  const columns = [
    { label: 'Title', accessor: 'title' },
    { label: 'Target Amount', render: item => `$${item.target_amount}` },
    { label: 'Current Amount', render: item => `$${item.current_amount}` },
    {
      label: 'Updated',
      render: item =>
        item.updated_at
          ? new Date(item.updated_at).toLocaleDateString('en-US')
          : '-',
    },
    {
      label: 'Date Created',
      render: item => new Date(item.created_at).toLocaleDateString('en-US'),
    },
    {
      label: 'Delete',
      render: item => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setGoalToDelete(item)
            setIsDialogOpen(true)
          }}
          className='hover:cursor-pointer'
        >
          <MdDeleteForever className='h-[30px] w-[30px] text-red-500' />
        </button>
      )
    }
  ]

  const openModal = () => setIsModalOpen(true)

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedGoal(null)
    setTitle('')
    setTargetAmount('')
    setCurrentAmount('')
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
    if (isModalOpen && selectedGoal) {
      setTitle(selectedGoal.title)
      setTargetAmount(selectedGoal.target_amount)
      setCurrentAmount(selectedGoal.current_amount)
    } else {
      setTitle('')
      setTargetAmount('')
      setCurrentAmount('')
    }
  }, [isModalOpen, selectedGoal])

  const handleCreateSavingsGoal = async (e) => {
    e.preventDefault()
    const parsedTargetAmount = parseFloat(targetAmount)
    const parsedCurrentAmount = parseFloat(currentAmount)

    if (!title || isNaN(parsedTargetAmount)) {
      toast.error('Title and amount are required')
      return
    }

    const goalData = {
      title,
      target_amount: parsedTargetAmount,
      current_amount: parsedCurrentAmount
    }

    try {
      if (selectedGoal) {
        await toast.promise(
          updateSavingsGoal({ savings_id: selectedGoal.savings_id, ...goalData }),
          {
            loading: 'Updating savings goal...',
            success: 'Successfully updated!',
            error: (error) => error.message || 'Update failed'
          }
        )
      } else {
        await toast.promise(
          createSavingsGoal(goalData),
          {
            loading: 'Creating savings goal...',
            success: 'Successfully created!',
            error: (error) => error.message || 'Creation failed'
          }
        )
      }

      const updatedGoals = await getAllSavingsGoals()
      setSavings(updatedGoals.savings_goals)
      closeModal()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <div className='w-full px-4 sm:px-6 lg:px-8 py-10'>
        <div className='max-w-screen-xl mx-auto flex flex-col items-center gap-y-12'>
          <h2 className='text-4xl sm:text-5xl montesserat-400 text-white mt-6 text-center'>
            Savings Goals
          </h2>

          <div className='w-full flex justify-center'>
            <Button
              className='!bg-[#528265] cursor-pointer flex gap-x-2 text-lg sm:text-2xl text-white shadow-md montesserat-300'
              onClick={openModal}
            >
              Create New Savings Goal <GoPlus className='mt-1' />
            </Button>
          </div>

          <div className='w-full overflow-x-auto'>
            <div className='min-w-[500px] max-w-screen-xl mx-auto'>
              {savings?.length > 0 ? (
                <DataTable
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
                    table: 'rounded-lg shadow-md w-full',
                  }}
                />
              ) : (
                <p className='montesserat-300 text-xl text-center'>
                  Savings goals will appear here after they're created.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className='text-2xl sm:text-3xl text-center mb-8'>
          {selectedGoal ? 'Edit Goal' : 'Create New Goal'}
        </h2>
        <form
          onSubmit={handleCreateSavingsGoal}
          className='grid gap-6 max-w-md mx-auto w-full'
        >
          {/* Title */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
            <label className='sm:w-40 text-sm font-medium text-gray-700 text-right sm:text-left'>
              Title:
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265]'
            />
          </div>

          {/* Target Amount */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
            <label className='sm:w-40 text-sm font-medium text-gray-700 text-right sm:text-left'>
              Target Amount:
            </label>
            <input
              type='number'
              step='0.01'
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
              className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265]'
            />
          </div>

          {/* Current Amount */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
            <label className='sm:w-40 text-sm font-medium text-gray-700 text-right sm:text-left'>
              Current Amount:
            </label>
            <input
              type='number'
              step='0.01'
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              required
              className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265]'
            />
          </div>

          <Button
            type='submit'
            className='w-full sm:w-1/2 mx-auto py-2 !bg-[#528265] text-white rounded-lg text-lg font-semibold'
          >
            Complete
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDialogOpen}
        message='Are you sure you want to delete this savings goal?'
        onCancel={() => {
          setIsDialogOpen(false)
          setGoalToDelete(null)
        }}
        onConfirm={async () => {
          if (!goalToDelete) return
          try {
            await toast.promise(deleteSavingsGoal(goalToDelete.savings_id), {
              loading: 'Deleting...',
              success: 'Savings goal deleted!',
              error: (error) => error.message || 'Delete failed',
            })
            const { savings_goals } = await getAllSavingsGoals()
            setSavings(savings_goals)
          } catch (error) {
            toast.error(error.message)
          } finally {
            setIsDialogOpen(false)
            setGoalToDelete(null)
          }
        }}
      />
    </>
  )
}

export default SavingsPage