import { createBrowserRouter, redirect } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import AuthPage from '../pages/AuthPage'

// authentication function 
// const isAuthenticated = () => {
//     return localStorage.getItem("authToken"); // Returns token if logged in
// }

// Redirect if user is not authenticated
// const authLoader = async () => {
//     if (!isAuthenticated()) {
//       return redirect("/login") // Redirect to login if not logged in
//     }
//     return null
// }

// Public Routes (No Layout)
const publicRoutes = [
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <AuthPage /> },
    { path: "/register", element: <AuthPage /> },
]

// Protected Routes (Wrapped in Layout)
const protectedRoutes = {
    // path: "/dashboard",
    // element: <Layout />, Apply Layout ONLY to protected routes
    // children: [
    //   { path: "/dashboard", element: <Dashboard />, loader: authLoader },
    //   { path: "/dashboard/budget", element: <Budget />, loader: authLoader },
    // ],
}

const router = createBrowserRouter(publicRoutes)

export default router