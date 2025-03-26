import React from 'react'
import Navbar from '../components/landingPage/Navbar'
import Hero from '../components/landingPage/Hero'
import Features from '../components/landingPage/Features'
import HowItWorks from '../components/landingPage/HowItWorks'
import Footer from '../components/utils/Footer'

const LandingPage = () => {
  return (
    <>
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Footer />
    </>
  )
}

export default LandingPage