import React, { useState, useEffect } from 'react'
import AuthForm from '../components/authPage/AuthForm'
import Card from '../components/utils/Card'
import authFormBG from '../assets/authform-bg.jpg'
import { useLocation, useNavigate ,Link } from 'react-router-dom'
import { login, register } from '../api/auth/auth'
import { useAuth } from '../api/auth/authContext'

const AuthPage = () => {
  const [error, setError] = useState('')
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isRegistering = location.pathname === '/register'

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 5000)

      return () => clearTimeout(timer)
    }

  }, [error])

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
    <div className='flex justify-center items-center h-screen static'>
      {error && (
        <div className="col-span-full bg-red-100 text-red-800 p-4 rounded-lg border border-red-300 absolute top-1/6 left-1/2">
          <strong>Error:</strong> {error}
        </div>
      )}
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