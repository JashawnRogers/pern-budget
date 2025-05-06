import React from 'react'
import logo from '../../assets/logo-transparent.svg'
import { NavLink } from 'react-router-dom'
import { CiSettings } from 'react-icons/ci'
import { CgProfile } from 'react-icons/cg'
import LogoutButton from '../utils/LogoutButton'
import { useAuth } from '../../api/auth/authContext'

const DashboardNav = () => {
    const { user } = useAuth()

  return (
    <nav className='flex justify-around bg-white'>
        <NavLink to='/dashboard'>
            <div className='flex items-center'>
                <img src={logo} className='w-[250px]' alt="SpendWise logo" />
                <h1 className='ml-[-75px] montesserat-400 text-3xl'>SpendWise</h1>
            </div>
        </NavLink>
        <ul className='flex items-center gap-5 text-xl montesserat-300'>
            <li>
                <NavLink to='/dashboard'>
                    <p>Dashboard</p>
                </NavLink>
            </li>
            <li>
                <NavLink to='/budget'>
                    <p>Budgets</p>
                </NavLink>
            </li>
            <li>
                <NavLink to='/transactions'>
                    <p>Transactions</p>
                </NavLink>
            </li>
            <li>
                <NavLink to='/savings'>
                    <p>Savings Goals</p>
                </NavLink>
            </li>
        </ul>
        <ul className='flex items-center gap-5 montesserat-300'>
            <li>
                <NavLink to='/settings'>
                    <CiSettings className='w-[25px] h-[25px]'/>
                </NavLink>
            </li>
            <li>
                <NavLink>
                    <CgProfile className='w-[45px] h-[45px]'/>
                </NavLink>
            </li>
            <li>
                <div className='flex flex-col text-sm'>
                    {/* Make first letter upper case */}
                    <p className='font-bold'>{user.name.charAt(0).toUpperCase() + user.name.slice(1)}</p>
                    <p className='text-xs'>{user.email}</p>
                </div>
            </li>
            <li>
                <LogoutButton />
            </li>
        </ul>
        
    </nav>
  )
}

export default DashboardNav