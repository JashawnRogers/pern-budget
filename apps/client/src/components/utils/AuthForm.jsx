import { useState } from 'react'
import Button from '../utils/Button'

const AuthForm = ({ isRegistering, onSubmit }) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = isRegistering ? { name, password, email } : { email, password }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className='w-[50%] flex flex-col justify-center items-center gap-y-10 bg-[#C9EFC7]'>
      <h1 className='montesserat-400 text-2xl text-center text-pretty'>{isRegistering ? 'Get started on journey to financial freedom!' : 'Money looks good on you. Glad to see you back.'}</h1>
      <div className='flex flex-col items-center gap-y-4 w-full'>
        {isRegistering && (
          <div className='flex items-center'>
            <label htmlFor="name" className='montesserat-400 pl-8 text-xl'>Name:</label>
            <input 
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='outline outline-black outline-solid ml-3 rounded-3xl h-[40px] w-[350px] pl-3'
            />
          </div>
        )}

        <div className='flex items-center'>
          <label htmlFor='email' className='montesserat-400 pl-8 text-xl'>Email:</label>
          <input 
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='outline outline-black outline-solid ml-3 rounded-3xl h-[40px] w-[350px] pl-3'
          />
        </div>

        <div className='flex items-center'>
          <label htmlFor='username' className='montesserat-400 text-xl'>Password:</label>
          <input 
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='outline outline-black outline-solid ml-3 rounded-3xl h-[40px] w-[350px] pl-3'
          />
        </div>

        <Button className='mt-3 w-[100px] text-xl justify-center' type='submit'>{isRegistering ? 'Register' : 'Login'}</Button>
      </div>
    </form>
  )
}

export default AuthForm