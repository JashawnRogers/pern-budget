import Card from './Card'
import Button from './Button'
import { IoClose } from 'react-icons/io5'

const Modal = ({ isOpen, onClose, children, handleSubmit  }) => {
    if (!isOpen) {
        return null
    }

  return (
    <Card className='z-99 min-w-[650px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <div className='flex flex-col justify-center gap-y-6 w-full rounded-xl shadow-lg backdrop-blur-md'>
            <div className='place-self-end'>
                <Button 
                    onClick={onClose} 
                    className='mt-4 mr-4 py-2 !bg-red-500 text-white rounded-lg'
                >
                    <IoClose className='h-full w-full mr-4'/>
                </Button>
            </div>
            {children}
        </div>
    </Card>
  )
}

export default Modal