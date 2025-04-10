import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes/router.jsx'
import './index.css'
import { AuthProvider } from './auth/authContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <div className='h-full bg-linear-to-b from-[#528265] from-0% to-[#fff] to-90%'>
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  </StrictMode>,
)
