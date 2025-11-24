import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'
const Cars = () => {
  // Get search params from URL
  const [searchParams] = useSearchParams("")
  const pickupLocation = searchParams.get("pickupLocation")
  const pickupDate = searchParams.get("pickupDate")
  const returnDate = searchParams.get("returnDate")

  const { cars, axios } = useAppContext()
  const isSearchedData = pickupLocation && pickupDate && returnDate

  // State declarations should come first
  const [filteredCars, setFilteredCars] = useState([])
  const [input, setInput] = useState("")

  // Apply filter based on input
  const applyFilter = (carsList) => {
    if (input === '') {
      setFilteredCars(carsList)
      return
    }
    const filtered = carsList.slice().filter(
      (car) =>
        car.brand.toLowerCase().includes(input.toLowerCase()) ||
        car.model.toLowerCase().includes(input.toLowerCase()) ||
        car.transmission.toLowerCase().includes(input.toLowerCase()) ||
        car.category.toLowerCase().includes(input.toLowerCase())
    )
    setFilteredCars(filtered)
  }

  // Search cars availability
  const searchCarsAvailability = async () => {
    try {
      const { data } = await axios.post('/api/bookings/check-availability', {
        location: pickupLocation,
        pickupDate,
        returnDate,
      })

      if (data.success) {
        setFilteredCars(data.availableCars) 

        if (data.availableCars.length === 0) {
          toast('No cars available for the selected dates and location')
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log('Error fetching available cars:', error)
      toast.error('Something went wrong while fetching available cars')
    }
  }

  // Run availability search if search params exist
  useEffect(() => {
    if (isSearchedData) {
      searchCarsAvailability()
    } else if (cars.length > 0) {
      applyFilter(cars)
    }
  }, [isSearchedData, cars])

  // Apply search filter whenever input changes
  useEffect(() => {
    if (!isSearchedData && cars.length > 0) {
      applyFilter(cars)
    }
  }, [input,cars])

  // Filtered list to display
  const displayedCars = filteredCars

  return (
    <div className=''>
      <motion.div 
         initial={{opacity:0,y:20}}
         animate={{opacity:1,y:0}}
         transition={{duration:0.5,ease:'easeInOut'}}
      className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title
          title='Available Cars'
          subTitle='Browse our selection of premium vehicles available for your next adventure'
        />

        <motion.div 
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.5,delay:0.3}}
        
        className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
          <img
            src={assets.search_icon}
            alt='Search'
            className='w-4.5 h-4.5 mr-2'
          />

          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Search by make, model, or features'
            className='w-full h-full outline-none text-gray-500'
          />

          <img
            src={assets.filter_icon}
            alt='Filter'
            className='w-4.5 h-4.5 ml-2'
          />
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.5,delay:0.5}}

      className='xl:px-20 max-w-7xl mx-auto mt-4'>
        <p className='text-gray-600 px-4'>
          Showing {displayedCars.length} {displayedCars.length === 1 ? 'Car' : 'Cars'}
        </p>

        {/* List of Cars */}
        <motion.div 
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.5,delay:0.6}}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4'>
          {displayedCars.map((car) => (
            <div key={car._id}>
              <CarCard car={car} />
            </div>
          ))}

          {displayedCars.length === 0 && (
            <p className='text-center text-gray-500 w-full py-10'>
              No cars found for your search.
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Cars
