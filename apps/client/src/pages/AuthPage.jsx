import React, { useState, useEffect } from 'react'
import AuthForm from '../components/authPage/AuthForm'
import Card from '../components/utils/Card'
import authFormBG from '../assets/authform-bg.jpg'
import { useLocation, useNavigate ,Link } from 'react-router-dom'
import { login, register } from '../api/auth/auth'
import { useAuth } from '../api/auth/authContext'
import { toast } from 'react-hot-toast'

const AuthPage = () => {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isRegistering = location.pathname === '/register'

  const handleAuth = async (formData, clientSideError) => {
    if (clientSideError) {
      toast.error(clientSideError)
      return
    }

    try {
      setError(null)
      let userData
      if (isRegistering) {
       userData = await register(formData)
       toast.success('Successfully registered!')
      } else {
       userData = await login(formData)
       toast.success('Welcome back!')
      }
      setUser(userData.user)
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Authentication failed')
    }
  }

  return (
    <div className='flex justify-center items-center h-screen static'>
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