import { createBrowserRouter, redirect } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import AuthPage from '../pages/AuthPage'
import DashboardPage from '../pages/DashboardPage'
import { authLoader } from '../api/auth/authLoader'
import Layout from '../components/Layout'
import Budget from '../pages/Budget'

// Public Routes (No Layout)
const publicRoutes = [
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <AuthPage /> },
    { path: "/register", element: <AuthPage /> },
]

// Protected Routes (Wrapped in Layout)
const protectedRoutes = [
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: '/dashboard', 
                element: <DashboardPage />, 
                loader: authLoader  
            },
            {
                path: '/budget',
                element: <Budget />,
                loader: authLoader
            }
        ]
    }

]

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes])

export default router