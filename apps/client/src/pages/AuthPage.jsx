import React, { useState, useEffect } from 'react'
import AuthForm from '../components/authPage/AuthForm'
import Card from '../components/utils/Card'
import authFormBG from '../assets/authform-bg.jpg'
import { useLocation, useNavigate ,Link } from 'react-router-dom'
import { login, register } from '../api/auth/auth'
import { useAuth } from '../api/auth/authContext'

const AuthPage = () => {
  const [error, setError] = useState(null)
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isRegistering = location.pathname === '/register'


  const handleAuth = async (formData) => {
    try {
      setError(null)
      let userData
      if (isRegistering) {
       userData = await register(formData)
      } else {
       userData = await login(formData)
      }
      setUser(userData.user)
      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <Link to='/' className='absolute top-4 left-4 hover:underline'>
        <p>Back to homepage</p>
      </Link>
      <Card className='w-[75vw] h-[75vh] flex'>
        <AuthForm isRegistering={isRegistering} onSubmit={handleAuth} />
        <div>
          <img src={authFormBG} alt='Form background image' className='w-full h-full'/>
        </div>
      </Card>
    </div>
  )
}

export default AuthPage