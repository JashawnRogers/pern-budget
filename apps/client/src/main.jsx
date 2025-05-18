import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import router from './routes/router.jsx'
import './index.css'
import { AuthProvider } from './api/auth/authContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <div className='h-full bg-linear-to-b from-[#528265] from-0% to-[#fff] to-90%'>
        <Toaster position='top-right' toastOptions={{ duration: 3000 }} />
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  </StrictMode>,
)
