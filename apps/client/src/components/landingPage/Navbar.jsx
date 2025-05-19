import React from 'react'
import logo from '../../assets/logo-transparent.svg'
import { Link } from 'react-router-dom'
import { Link as ScrollLink } from 'react-scroll'
import Button from '../utils/Button'

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center pt-3 sticky top-0 bg-[#528265] text-white'>
        <div className='flex items-center'>
            <img src={logo} className='w-[350px]' alt="SpendWise logo" />
            <h1 className='ml-[-100px] montesserat-400 text-3xl'>SpendWise</h1>
        </div>
        <ul className='flex gap-5 text-xl montesserat-300 mr-36 cursor-pointer'>
            <ScrollLink to='home' smooth={true} duration={500} offset={-150}>
                <li>Home</li>
            </ScrollLink>
            <ScrollLink to='features' smooth={true} duration={500} offset={-150}>
                <li>Features</li>
            </ScrollLink>
            <ScrollLink to='how-it-works' smooth={true} duration={500}>
                <li>How It Works</li>
            </ScrollLink>
        </ul>
        <div className='flex gap-8 mr-24'>
            <Link to='/login'>
                <h3 className='montesserat-300 text-xl mt-2'>Login</h3>
            </Link>
            <Link to='/register'>
                <Button className='!text-black'>Sign Up</Button>
            </Link>
        </div>
    </nav>
  )
}

export default Navbar