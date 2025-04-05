import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Footer from './components/utils/Footer'

function App() {

  return (
    <div className='h-full bg-linear-to-b from-[#528265] from-0% to-[#fff] to-90%'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />}/>
          <Route path='/register' element={<LoginPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <LandingPage />
    </div>
  )
}

export default App
