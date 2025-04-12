import React from 'react'
import logo from '../../assets/logo-transparent.svg'
import { NavLink } from 'react-router-dom'
import { CiSettings } from 'react-icons/ci'
import { CgProfile } from 'react-icons/cg'
import LogoutButton from '../utils/LogoutButton'

const DashboardNav = (props) => {
  return (
    <nav className='flex justify-around bg-white'>
        <div className='flex items-center'>
            <img src={logo} className='w-[250px]' alt="SpendWise logo" />
            <h1 className='ml-[-75px] montesserat-400 text-3xl'>SpendWise</h1>
        </div>
        <ul className='flex items-center gap-5 text-xl montesserat-300'>
            <li>
                <NavLink>
                    <p>Overview</p>
                </NavLink>
            </li>
            <li>
                <NavLink>
                    <p>Budgets</p>
                </NavLink>
            </li>
            <li>
                <NavLink>
                    <p>Transactions</p>
                </NavLink>
            </li>
            <li>
                <NavLink>
                    <p>Reports</p>
                </NavLink>
            </li>
        </ul>
        <ul className='flex items-center gap-5 montesserat-300'>
            <li>
                <NavLink>
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
                    <p className='font-bold'>{props.name}</p>
                    <p className='text-xs'>{props.email}</p>
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