import React from 'react'
import Navbar from '../components/landingPage/Navbar'
import Hero from '../components/landingPage/Hero'
import Features from '../components/landingPage/Features'
import HowItWorks from '../components/landingPage/HowItWorks'

const LandingPage = () => {
  return (
    <>
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
    </>
  )
}

export default LandingPage