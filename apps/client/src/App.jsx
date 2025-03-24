import { useState } from 'react'
import Navbar from './components/landingPage/Navbar'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='h-full bg-linear-to-b from-[#C9EFC7] from-0% to-[#fff] to-90%'>
      <Navbar />
    </div>
  )
}

export default App
