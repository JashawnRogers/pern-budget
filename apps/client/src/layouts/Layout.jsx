import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/utils/Footer'
import DashboardNav from '../components/DashboardPage/DashboardNav'

const Layout = () => {
  return (
    <>
    <DashboardNav />
    <Outlet />
    <Footer />
    </>
  )
}

export default Layout