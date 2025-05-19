import { createPortal } from 'react-dom'

const ConfirmDialog = ({ isOpen, onCancel, onConfirm, message }) => {
  if (!isOpen) return null

  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='bg-white p-6 rounded-2xl shadow-xl text-center max-w-sm w-full'>
        <p className='text-lg mb-4'>{message}</p>
        <div className='flex justify-center gap-4'>
          <button
            onClick={onCancel}
            className=' cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 bg-[#528265] text-white hover:bg-[#3f6850] rounded-lg cursor-pointer'
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ConfirmDialog