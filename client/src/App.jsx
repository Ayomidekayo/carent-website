import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CartDetails from './pages/CartDetails';
import Carts from './pages/Cars';
import MyBookings from './pages/MyBookings';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Dashboard from './pages/owner/Dashboard';
import AddCar from './pages/owner/AddCar';
import ManageCars from './pages/owner/ManageCars';
import ManageBookings from './pages/owner/ManageBookings';
import Layout from './pages/owner/Layout';
import Login from './components/Login';
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext';

const App = () => {
  const {showLogin}=useAppContext();
 // const [showLogin, setShowLogin]=useState(false);
  const isOwnerPath=useLocation().pathname.startsWith('/owner')
  return (
    <>
    <Toaster/>
         {showLogin && <Login  />}
      
      {!isOwnerPath && <Navbar />}
      <ScrollToTop />   {/* 👈 Always scroll to top on route change */}
      <Routes>
        
          <Route path='/' element={<Home/>} />
          <Route path='/car-details/:id' element={<CartDetails/>} />
          <Route path='/cars' element={<Carts/>} />
          <Route path='/my-bookings' element={<MyBookings/>} />
            
            <Route path='/owner' element={<Layout/>}>
                 <Route index element={<Dashboard/>}/>
                 <Route path='manage-bookings' element={<ManageBookings/>}/>
                 <Route path='add-car' element={<AddCar/>}/>
                 <Route path='manage-cars' element={<ManageCars/>}/>

            </Route>
      </Routes>
      <Footer/>
    </>
  )
}

export default App