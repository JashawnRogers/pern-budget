import React, { useState, useEffect } from 'react'
import AuthForm from '../components/authPage/AuthForm'
import Card from '../components/utils/Card'
import authFormBG from '../assets/authform-bg.jpg'
import { useLocation, Link } from 'react-router-dom'

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false)

  let location = useLocation()


  useEffect(() =>{
    if (location.pathname === '/register') {
      setIsRegistering(!isRegistering)
    }
  }, [location])

  const handleFormData = () => {
    console.log(data)
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <Link to='/' className='absolute top-4 left-4 hover:underline'>
        <p>Back to homepage</p>
      </Link>
      <Card className='w-[75vw] h-[75vh] flex'>
        <AuthForm isRegistering={isRegistering} onSubmit={handleFormData} />
        <div>
          <img src={authFormBG} alt='Form background image' className='w-full h-full'/>
        </div>
      </Card>
    </div>
  )
}

export default AuthPage