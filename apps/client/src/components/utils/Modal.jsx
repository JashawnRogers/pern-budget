import Card from './Card'
import Button from './Button'
import { IoClose } from 'react-icons/io5'

const Modal = ({ isOpen, onClose, children, handleSubmit  }) => {
    if (!isOpen) {
        return null
    }

  return (
    <Card className='z-99 min-w-[650px] mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <div className='flex flex-col items-center gap-3'>
            <div className='place-self-end'>
                <Button onClick={onClose} className='h-[50px] w-[50px] mr-2'><IoClose className='h-full w-full'/></Button>
            </div>
            {children}
        </div>
    </Card>
  )
}

export default Modal