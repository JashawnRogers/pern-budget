import { createBrowserRouter, redirect } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import AuthPage from '../pages/AuthPage'
import DashboardPage from '../pages/DashboardPage'
import { authLoader } from '../api/auth/authLoader'
import Layout from '../layouts/Layout'
import BudgetPage from '../pages/BudgetPage'
import TransactionsPage from '../pages/TransactionsPage'
import SavingsPage from '../pages/SavingsPage'
import SettingsPage from '../pages/SettingsPage'

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
                element: <BudgetPage />,
                loader: authLoader
            },
            {
                path: '/transactions',
                element: <TransactionsPage />,
                loader: authLoader
            },
            {
                path: '/savings',
                element: <SavingsPage />,
                loader: authLoader
            },
            {
                path: '/settings',
                element: <SettingsPage />,
                loader: authLoader
            }
        ]
    }

]

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes])

export default router