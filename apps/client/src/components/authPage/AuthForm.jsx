import { useRef } from 'react'
import Button from '../utils/Button'

const AuthForm = ({ isRegistering, onSubmit }) => {
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    const name = nameRef.current?.value || ''
    const email = emailRef.current.value
    const password = passwordRef.current.value

    if (!email.includes('@')) {
      onSubmit(null, 'Please enter a valid email address.')
      return
    }

    if (password.length < 8) {
      onSubmit(null, 'Password must be at least 8 characters.')
      return
    }

    if (isRegistering && name.trim() === '') {
      onSubmit(null, 'Please enter a name to register an account.')
      return
    }

    const data = isRegistering ? { name, password, email } : { email, password }
    onSubmit(data)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col justify-center items-center gap-y-10 w-full max-w-md px-6 py-10 bg-white bg-opacity-90 rounded-xl shadow-lg backdrop-blur-md'
    >
      {isRegistering && (
        <div className='w-full'>
          <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
            Name
          </label>
          <input
            type='text'
            ref={nameRef}
            required
            className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265] focus:border-transparent'
          />
        </div>
      )}

      <div className='w-full'>
        <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
          Email
        </label>
        <input
          type='email'
          ref={emailRef}
          required
          className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265] focus:border-transparent'
        />
      </div>

      <div className='w-full'>
        <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
          Password
        </label>
        <input
          type='password'
          ref={passwordRef}
          required
          className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265] focus:border-transparent'
        />
      </div>

      <Button
        type='submit'
        className='w-full mt-4 py-2 !bg-[#528265] text-white rounded-lg text-lg font-semibold transition-colors'
      >
        {isRegistering ? 'Register' : 'Login'}
      </Button>
    </form>
  )
}

export default AuthForm
