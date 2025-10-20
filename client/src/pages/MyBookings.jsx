import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import {motion} from 'motion/react'


const MyBookings = () => {
  const {axios,user,currency}=useAppContext();
  const [bookings,setBookings]=useState([]);
 

  const fetchMyBookings=async()=>{
    try {
      const {data}=await axios.get('/api/bookings/user')
      if(data.success){
        setBookings(data.bookings)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch bookings');
      console.log('Fetch my bookings error:',error);
    }
  }
  useEffect(()=>{
    user &&
    fetchMyBookings()
  },[user])
  return (
    <motion.div 
    initial={{opacity:0,y:30}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.6}}

    className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>
         <Title title='My-Bookings' subTitle='View and manage your all carbookings' align='left'/>

         <div>
          {bookings.map((booking,index)=>(
            <motion.div
             initial={{opacity:0,y:20}}
             animate={{opacity:1,y:0}}
             transition={{duration:0.5,delay:0.2*index}}
            key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borrderColor rounded-lg mt-5 first:mt-12'>
                {/* car Image and info */}
                <div className='md:col-span-1'>
                  <div className='rounded-md overflow-hidden mb-3'>
                    <img src={booking.car.image} className='w-full h-auto aspect-video object-cover'alt="" />
                  </div>
                  <p className='text-lg font-medium mt-2'>{booking.car.brand} {booking.car.model}</p>
                  <p  className='text-gray-500'>{booking.car.year} . {booking.car.category} . {booking.car.location}</p>
                </div>

                {/* Bookings Info */}

                <div className='md:col-span-2'>
                  <div className='flex items-center gap-2'>
                    <p className='px-3 py-1.5 bg-light rounded-xl'>Booking #{index+1}</p>
                    <p className={`px-3 py-1.5 bg-light rounded-full ${booking.status ==='confirmed' ? 'bg-green-400/15 text-green-600': 'bg-red-400/15 text-red-600'}`}>{booking.status}</p>
                  </div>
                  <div className='flex items-start gap-2 mt-3'>
                    <img className='w-4 h-4 mt-1' src={assets.calendar_icon_colored} alt="" />
                    <div>
                      <p className='text-gray-500'>Rental Period</p>
                      <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                    </div>
                  </div>

                  <div className='flex items-start gap-2 mt-3'>
                    <img className='w-4 h-4 mt-1' src={assets.location_icon_colored} alt="" />
                    <div>
                      <p className='text-gray-500'>Pick up Location</p>
                      <p>{booking.car.location}</p>
                    </div>
                  </div>
                </div>
                {/* Price  */}
                <div className='text-sm text-gray-500 text-right'>
                     <div className='text-sm text-gray-500 text-right'>
                        <p className=''>Total Price</p>
                        <h1 className='text-2xl font-semibold text-primary'>{currency} {booking.price}</h1>
                        <p>Booked on {booking.createdAt.split('T')[0]}</p>
                     </div>
                </div>
            </motion.div>
          ))}
         </div>
    </motion.div>
  )
}

export default MyBookings