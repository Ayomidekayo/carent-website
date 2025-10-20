import React from 'react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import Testimonial from '../components/Testimonial'
import NewsLettter from '../components/NewsLettter'

const Home = () => {
  return (
    <div className='mx-auto'>
        <Hero/>
        <FeaturedSection/>
        <Banner />
        <Testimonial/>
        <NewsLettter/>
    </div>
  )
}

export default Home