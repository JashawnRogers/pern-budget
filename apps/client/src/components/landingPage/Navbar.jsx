import React from 'react'
import logo from '../../assets/logo-transparent.svg'
import { Link } from 'react-router'
import Button from './utils/Button'

const Navbar = () => {
  return (
    <nav className='sticky top-0 flex justify-between items-center pt-3'>
        <div className='flex items-center'>
            <img src={logo} className='w-[350px]' alt="SpendWise logo" />
            <h1 className='ml-[-100px] montesserat-400 text-3xl'>SpendWise</h1>
        </div>
        <ul className='flex gap-5 text-xl montesserat-300 mr-16'>
            <Link to='/'>
                <li>Home</li>
            </Link>
            <Link to='/about'>
                <li>About</li>
            </Link>
            <Link to='/features'>
                <li>Features</li>
            </Link>
        </ul>
        <div className='flex gap-8 mr-24'>
            <Link to='/login'>
                <h3 className='montesserat-300 text-xl mt-2'>Login</h3>
            </Link>
            <Link to='/register'>
                <Button>Sign Up</Button>
            </Link>
        </div>
    </nav>
  )
}

export default Navbar