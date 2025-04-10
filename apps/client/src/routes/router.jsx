import { createBrowserRouter, redirect } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import AuthPage from '../pages/AuthPage'
import DashboardPage from '../pages/DashboardPage'
import { authLoader } from '../auth/authLoader'

// Public Routes (No Layout)
const publicRoutes = [
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <AuthPage /> },
    { path: "/register", element: <AuthPage /> },
]

// Protected Routes (Wrapped in Layout)
const protectedRoutes = [
    { path: '/dashboard', element: <DashboardPage />, loader: authLoader  },
]

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes])

export default router