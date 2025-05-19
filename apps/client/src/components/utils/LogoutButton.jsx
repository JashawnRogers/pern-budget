import { useState } from 'react'
import { logout } from '../../api/auth/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import ConfirmDialog from './ConfirmDialog'

const LogoutButton = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async () => {        
        toast.promise(
            logout(),
            {
                loading: 'Logging out...',
                success: 'Come back soon!',
                error: (error) => error.message || 'Something went wrong'
            }
        ).then(() => {
            navigate('/')
        }).catch((error) => {
            console.error('Logout error:', error.error)
        })
    }

    return (
        <>
            <button onClick={() => setIsDialogOpen(true)} className="hover:underline cursor-pointer">
                Logout
            </button>
        
            <ConfirmDialog
                isOpen={isDialogOpen}
                message='Are you sure you want to logout?'
                onCancel={() => setIsDialogOpen(false)}
                onConfirm={() => {
                    setIsDialogOpen(false)
                    handleLogout()
                }}
            />
        </>

    )
}

export default LogoutButton