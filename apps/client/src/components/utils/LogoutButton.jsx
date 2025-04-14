import { logout } from '../../api/auth/auth'
import { useNavigate } from 'react-router-dom'

const LogoutButton = () => {
    const navigate = useNavigate()

    const handleLogout = async () => {
        const confirm = window.confirm('Are you sure you want to logout?')
        if (!confirm) return
        
        try {
            await logout()
            navigate('/') // redirect to homepage or login after logout
        } catch (err) {
            console.error('Logout error:', err.message)
        }
    }

    return (
        <button onClick={handleLogout} className="hover:underline cursor-pointer">
            Logout
        </button>
    )
}

export default LogoutButton