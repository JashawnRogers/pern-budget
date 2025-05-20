import { useState } from 'react';
import logo from '../../assets/logo-transparent.svg';
import { Link as ScrollLink } from 'react-scroll';
import { Link } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import Button from '../utils/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className='sticky top-0 bg-[#528265] text-white z-50 shadow-sm'>
      <nav className='w-full px-6 py-4 flex justify-between items-center relative'>
        {/* Left: Logo + Title */}
        <div className='flex items-center'>
          <img src={logo} className='w-40 md:w-[250px]' alt='SpendWise logo' />
          <h1 className='ml-[-40px] md:ml-[-80px] montesserat-400 text-3xl md:text-3xl'>
            SpendWise
          </h1>
        </div>

        {/* Center: Nav Links */}
        <ul className='hidden lg:flex gap-6 text-2xl montesserat-300 absolute left-1/2 transform -translate-x-1/2'>
          <ScrollLink to='home' smooth={true} duration={500} offset={-150}>
            <li className='cursor-pointer'>Home</li>
          </ScrollLink>
          <ScrollLink to='features' smooth={true} duration={500} offset={-150}>
            <li className='cursor-pointer'>Features</li>
          </ScrollLink>
          <ScrollLink
            to='how-it-works'
            smooth={true}
            duration={500}
            offset={-10}
          >
            <li className='cursor-pointer'>How It Works</li>
          </ScrollLink>
        </ul>

        {/* Right: Auth Links */}
        <div className='hidden lg:flex gap-6 items-center'>
          <Link to='/login'>
            <h3 className='montesserat-300 text-lg'>Login</h3>
          </Link>
          <Link to='/register'>
            <Button className='!text-black'>Sign Up</Button>
          </Link>
        </div>

        {/* Hamburger Icon */}
        <div className='lg:hidden z-50'>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className='absolute top-full left-0 w-full bg-[#528265] shadow-md flex flex-col items-center gap-6 py-6 lg:hidden'>
            <ScrollLink
              to='home'
              smooth={true}
              duration={500}
              offset={-80}
              onClick={() => setIsOpen(false)}
              className='cursor-pointer'
            >
              Home
            </ScrollLink>
            <ScrollLink
              to='features'
              smooth={true}
              duration={500}
              offset={-80}
              onClick={() => setIsOpen(false)}
              className='cursor-pointer'
            >
              Features
            </ScrollLink>
            <ScrollLink
              to='how-it-works'
              smooth={true}
              duration={500}
              offset={-80}
              onClick={() => setIsOpen(false)}
              className='cursor-pointer'
            >
              How It Works
            </ScrollLink>
            <Link to='/login' onClick={() => setIsOpen(false)}>
              <h3 className='montesserat-300 text-lg'>Login</h3>
            </Link>
            <Link to='/register' onClick={() => setIsOpen(false)}>
              <Button className='text-black'>Sign Up</Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
