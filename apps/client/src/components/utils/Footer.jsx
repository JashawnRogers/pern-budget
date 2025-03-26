import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo-transparent.svg'
import { FaFacebook } from 'react-icons/fa6'
import { FaInstagram } from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

const Footer = () => {
  return (
    <footer className='w-full mx-10 mt-8 mb-10 flex flex-col items-center'>
        <div className='flex mt-16'>
            <img src={logo} className='w-[170px]' alt="SpendWise logo" />
            <h3 className='montesserat-400 text-xl ml-[-50px] mt-3'>Spendwise</h3>
        </div>
        <div className='flex justify-center gap-x-3 w-[170px] mt-4 ml-10'>
            <Link to='www.facebook.com'>
                <FaFacebook className='w-[25px] h-[25px]' />
            </Link>
            <Link to='www.instagram.com'>
                <FaInstagram className='w-[25px] h-[25px]' />
            </Link>
            <Link to='www.linkedin.com'>
                <FaLinkedin className='w-[25px] h-[25px]' />
            </Link>
            <Link to='www.twitter.com'>
            <FaXTwitter className='w-[25px] h-[25px]' />
            </Link>
        </div>
        <div className='mt-5'>
            <p className='montesserat-300 pl-10'>&copy; {new Date().getFullYear()} SpendWise. All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer