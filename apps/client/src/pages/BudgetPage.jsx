// unchanged imports
import { useState, useEffect } from 'react'
import { GoPlus } from 'react-icons/go'
import Modal from '../components/utils/Modal'
import Button from '../components/utils/Button'
import {
  createBudget,
  getAllBudgets,
  deleteBudget,
  updateBudget,
} from '../api/budget/budget'
import DataTable from '../components/utils/DataTable'
import { MdDeleteForever } from 'react-icons/md'
import { toast } from 'react-hot-toast'
import ConfirmDialog from '../components/utils/ConfirmDialog'

const Budget = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [budgetToDelete, setBudgetToDelete] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [budgets, setBudgets] = useState([])
  const [selectedBudget, setSelectedBudget] = useState(null)
  const [category, setCategory] = useState('')
  const [amountLimit, setAmountLimit] = useState('')

  const columns = [
    { label: 'Name', accessor: 'category' },
    {
      label: 'Budget Limit',
      render: (item) => `$${item.amount_limit.toFixed(2)}`,
    },
    {
      label: 'Total Spent',
      render: (item) => (
        <span>
          <span>$</span>
          <span
            className={
              item.total_spent > item.amount_limit ? 'text-red-500' : ''
            }
          >
            {item.total_spent.toFixed(2)}
          </span>
        </span>
      ),
    },
    {
      label: 'Date Created',
      render: (item) =>
        item.created_at
          ? new Date(item.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
          : '-',
    },
    {
      label: 'Delete',
      render: (item) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setBudgetToDelete(item)
            setIsDialogOpen(true)
          }}
          className='hover:cursor-pointer'
        >
          <MdDeleteForever className='h-7 w-7 text-red-500' />
        </button>
      ),
    },
  ]

  useEffect(() => {
    const fetchAllBudgets = async () => {
      try {
        const data = await getAllBudgets()
        setBudgets(data)
      } catch (error) {
        toast.error(error.message)
      }
    }
    fetchAllBudgets()
  }, [])

  useEffect(() => {
    if (isModalOpen) {
      if (selectedBudget) {
        setCategory(selectedBudget.category)
        setAmountLimit(selectedBudget.amount_limit)
      } else {
        setCategory('')
        setAmountLimit('')
      }
    }
  }, [isModalOpen, selectedBudget])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedBudget(null)
  }

  const handleCreateBudget = async (e) => {
    e.preventDefault()
    const parsedAmountLimit = parseFloat(amountLimit)

    if (!category || isNaN(parsedAmountLimit) || parsedAmountLimit < 0) {
      toast.error('Please enter a valid positive number for amount.')
      return
    }

    const data = { category, amount_limit: parsedAmountLimit }

    try {
      if (selectedBudget) {
        await updateBudget({ ...data, budget_id: selectedBudget.budget_id })
        toast.success('Successfully updated your budget!')
      } else {
        await createBudget(data)
        toast.success('Successfully created budget!')
      }

      const newBudgets = await getAllBudgets()
      setBudgets(newBudgets)

      setCategory('')
      setAmountLimit('')
      setSelectedBudget(null)
      closeModal()
    } catch (error) {
      toast.error(error.message || "Something's acting up.. My bad")
    }
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center gap-y-12 px-4 sm:px-6 md:px-12 min-h-[60vh]'>
        <div className='mt-12'>
          <h2 className='text-4xl sm:text-5xl montesserat-400 text-white text-center'>
            Budgets
          </h2>
        </div>

        <div className='w-full flex justify-center'>
          <Button
            className='!bg-[#528265] flex flex-wrap items-center gap-2 text-xl sm:text-2xl text-white shadow-md montesserat-300 px-6 py-3'
            onClick={openModal}
          >
            Create New Budget Category <GoPlus className='mt-1' />
          </Button>
        </div>

        <div className='w-full overflow-x-auto'>
          <div className='min-w-[500px] max-w-screen-xl mx-auto'>
            {budgets?.length > 0 ? (
              <DataTable
                columns={columns}
                data={budgets}
                onRowClick={(budget) => {
                  setSelectedBudget(budget)
                  setIsModalOpen(true)
                }}
                styleConfig={{
                  header: '',
                  row: 'hover:bg-green-50',
                  cell: 'text-sm sm:text-base',
                  table: 'rounded-lg shadow-md max-w-[600px]',
                }}
              />
            ) : (
              <p className='montesserat-300 text-lg text-center'>
                Budgets will appear here after they're created.
              </p>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className='text-2xl sm:text-3xl text-center mb-6'>
          {selectedBudget ? 'Edit Budget' : 'Create New Budget'}
        </h2>
        <form onSubmit={handleCreateBudget} method='post' className='space-y-6'>
          <div className='flex flex-col sm:grid sm:grid-cols-[150px_1fr] gap-4 items-center'>
            <label
              htmlFor='category'
              className='text-sm font-medium text-gray-700 sm:text-right sm:mb-0 w-full'
            >
              Category:
            </label>
            <input
              type='text'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265]'
            />
          </div>

          <div className='flex flex-col sm:grid sm:grid-cols-[150px_1fr] gap-4 items-center'>
            <label
              htmlFor='max-amount'
              className='text-sm font-medium text-gray-700 sm:text-right sm:mb-0 w-full'
            >
              Maximum Amount:
            </label>
            <input
              type='number'
              step='0.01'
              value={amountLimit}
              onChange={(e) => setAmountLimit(e.target.value)}
              required
              className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265]'
            />
          </div>

          <Button
            type='submit'
            className='w-full sm:w-1/2 mx-auto my-4 py-2 !bg-[#528265] text-white rounded-lg text-lg font-semibold transition-colors'
          >
            Complete
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDialogOpen}
        message='Are you sure you want to delete this budget? This action cannot be undone.'
        onCancel={() => {
          setIsDialogOpen(false)
          setBudgetToDelete(null)
        }}
        onConfirm={async () => {
          if (!budgetToDelete) return
          try {
            await toast.promise(deleteBudget(budgetToDelete.budget_id), {
              loading: 'Deleting...',
              success: 'Budget successfully deleted!',
              error: (error) => error.message || 'Delete failed',
            })
            const updatedBudgets = await getAllBudgets()
            setBudgets(updatedBudgets)
          } catch (error) {
            toast.error(error.message)
          } finally {
            setIsDialogOpen(false)
            setBudgetToDelete(null)
          }
        }}
      />
    </>
  )
}

export default Budget
