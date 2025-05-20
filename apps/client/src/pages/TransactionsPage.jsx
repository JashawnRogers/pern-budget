import { useState, useEffect } from 'react'
import Modal from '../components/utils/Modal'
import Button from '../components/utils/Button'
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from '../api/transaction/transactions'
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

  const openModal = () => setIsModalOpen(true)
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
      toast.error('Cannot create transaction without any fields filled out.')
      return
    }

    if (!category) {
      toast.error('Category is required')
      return
    }

    if (!amount) {
      toast.error('Amount is required')
      return
    }

    const data = { amount, category, description, vendor, created_at }

    try {
      if (selectedTransaction) {
        await toast.promise(
          updateTransaction({
            amount,
            category,
            description,
            vendor,
            id: selectedTransaction.id,
          }),
          {
            loading: 'Updating transaction...',
            success: 'Successfully updated transaction!',
            error: (error) => error.message || 'Something went wrong',
          }
        )
      } else {
        await toast.promise(createTransaction(data), {
          loading: 'Creating transaction...',
          success: 'Successfully created transaction!',
          error: (error) => error.message || 'Something went wrong',
        })
      }

      const newTransactions = await getTransactions()
      setTransactions(newTransactions)
      closeModal()
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  const columns = [
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
      label: 'Vendor',
      accessor: 'vendor',
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
    {
      label: 'Description',
      accessor: 'description',
      render: (item) =>
        item.description ? (
          <textarea
            readOnly
            disabled
            defaultValue={item.description}
            className='border-none p-2 overflow-auto w-full'
          ></textarea>
        ) : (
          'N/A'
        ),
    },
    {
      label: 'Delete',
      render: (item) => (
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
      ),
    },
  ]

  return (
    <>
      <div className='flex flex-col items-center justify-center gap-y-8 mt-12 px-4 w-full'>
        <h2 className='text-3xl sm:text-5xl text-center montesserat-400 text-white'>
          Transactions
        </h2>
        <Button
          className='!bg-[#528265] cursor-pointer flex gap-x-2 text-xl sm:text-2xl text-white shadow-md montesserat-300 px-4 py-2'
          onClick={openModal}
        >
          Create New Transaction <GoPlus className='mt-1' />
        </Button>
      </div>

      <div className='w-full overflow-x-auto px-4 mt-6'>
        <div className='min-w-[500px] max-w-screen-xl mx-auto'>
          {transactions?.length > 0 ? (
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
                table: 'rounded-lg shadow-md !max-w-[300px]',
              }}
            />
          ) : (
            <p className='montesserat-300 text-lg text-center'>
              Transactions will appear here once added.
            </p>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className='text-2xl sm:text-3xl text-center mb-6'>
          {selectedTransaction ? 'Edit Transaction' : 'Create New Transaction'}
        </h2>
        <form
          onSubmit={handleCreateTransaction}
          className='grid gap-4 w-full pr-3 max-w-2xl mx-auto'
        >
          {[
            {
              label: 'Amount:',
              id: 'amount',
              type: 'number',
              value: amount,
              onChange: setAmount,
              required: true,
            },
            {
              label: 'Budget Category:',
              id: 'category',
              type: 'select',
              value: category,
              onChange: setCategory,
              options: budgets.map((b) => ({
                value: b.category,
                label: b.category,
              })),
              required: true,
            },
            {
              label: 'Vendor:',
              id: 'vendor',
              type: 'text',
              value: vendor,
              onChange: setVendor,
              required: true,
            },
            {
              label: 'Date of transaction:',
              id: 'createdAt',
              type: 'date',
              value: created_at,
              onChange: setCreated_at,
            },
            {
              label: 'Description:',
              id: 'description',
              type: 'textarea',
              value: description,
              onChange: setDescription,
            },
          ].map((field) => (
            <div
              key={field.id}
              className='grid grid-cols-1 sm:grid-cols-[150px_1fr] items-center gap-2 sm:gap-x-4'
            >
              <label
                htmlFor={field.id}
                className='text-sm text-gray-700 sm:text-right'
              >
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  id={field.id}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  required={field.required}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265]'
                >
                  <option value='' disabled>
                    Select a category
                  </option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  id={field.id}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265]'
                />
              ) : (
                <input
                  id={field.id}
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  required={field.required}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265]'
                />
              )}
            </div>
          ))}

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
          setTransactionToDelete(null)
        }}
        onConfirm={async () => {
          if (!transactionToDelete) return
          try {
            await toast.promise(deleteTransaction(transactionToDelete.id), {
              loading: 'Deleting...',
              success: 'Transaction deleted!',
              error: (error) => error.message || 'Delete failed',
            })
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
