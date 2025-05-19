import React, { useState, useEffect } from 'react'
import AuthForm from '../components/authPage/AuthForm'
import Card from '../components/utils/Card'
import authFormBG from '../assets/authform-bg.jpg'
import { useLocation, useNavigate ,Link } from 'react-router-dom'
import { login, register } from '../api/auth/auth'
import { useAuth } from '../api/auth/authContext'
import { toast } from 'react-hot-toast'
import { HiArrowSmallLeft } from "react-icons/hi2"

const AuthPage = () => {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isRegistering, setIsRegistering] = useState()


  useEffect(() => {
    if (location.pathname === '/register') {
      setIsRegistering(true)
    } else if (location.pathname === '/login') {
      setIsRegistering(false)
    }
  }, [location.pathname])

  const handleAuth = async (formData, clientSideError) => {
    if (clientSideError) {
      toast.error(clientSideError)
      return
    }

    try {
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
      toast.error(error.error || 'Authentication failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#528265] to-white flex items-center justify-center px-4">
      <div className='absolute top-10 left-10 size-fit'>
        <Link to='/' className='flex items-center gap-2 text-2xl text-white cursor-pointer underline'><HiArrowSmallLeft className='h-8 w-8 text-white' /> Go back to homepage</Link>
      </div>
      <div className="relative flex w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden">

        {/* Form Panel */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center z-10 bg-[#e6f4ea]">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            {isRegistering
              ? 'Get started on your journey to financial freedom!'
              : 'Money looks good on you. Glad to see you back.'}
          </h2>

          {/* Toggle */}
          <div className="text-sm text-center mb-6 text-gray-600">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <Link
              to={ isRegistering ? '/login' : '/register'}
              className="text-[#528265] font-semibold hover:underline cursor-pointer"
            >
              {isRegistering ? ' Login' : ' Register'}
            </Link>
          </div>

          {/* Form */}
          <AuthForm isRegistering={isRegistering} onSubmit={handleAuth} />
        </div>

        {/* Illustration Panel */}
        <div className="hidden md:block md:w-1/2 relative overflow-hidden">
          <img
            src={authFormBG}
            alt="Finance Illustration"
            className="absolute -top-16 -right-10 w-[130%] max-w-none object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default AuthPage