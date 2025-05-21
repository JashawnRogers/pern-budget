import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo-transparent.svg'
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6'

const Footer = () => {
  return (
    <footer className="w-full py-10 mt-8 mb-10 bg-white flex flex-col items-center text-center space-y-6">
      
      {/* Logo + Brand */}
      <div className="flex flex-col items-center space-y-2">
        <img src={logo} alt="SpendWise logo" className="w-48 h-auto" />
        <h3 className="montesserat-400 text-xl">SpendWise</h3>
      </div>

      {/* Social Icons */}
      <div className="flex items-center justify-center space-x-6">
        <Link to="https://facebook.com" target="_blank">
          <FaFacebook className="w-6 h-6 hover:text-green-700 transition-colors" />
        </Link>
        <Link to="https://instagram.com" target="_blank">
          <FaInstagram className="w-6 h-6 hover:text-green-700 transition-colors" />
        </Link>
        <Link to="https://linkedin.com" target="_blank">
          <FaLinkedin className="w-6 h-6 hover:text-green-700 transition-colors" />
        </Link>
        <Link to="https://twitter.com" target="_blank">
          <FaXTwitter className="w-6 h-6 hover:text-green-700 transition-colors" />
        </Link>
      </div>

      {/* Copyright */}
      <p className="text-sm montesserat-300 text-gray-600">
        &copy; {new Date().getFullYear()} SpendWise. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer