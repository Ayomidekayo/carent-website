import React, { useEffect, useState } from 'react';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const dashboardCards = [
    { title: 'Total Cars', value: data.totalCars, icon: assets.carIconColored },
    { title: 'Total Bookings', value: data.totalBookings, icon: assets.listIconColored },
    { title: 'Pending', value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: 'Confirmed', value: data.completedBookings, icon: assets.listIconColored },
  ];

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/owner/dashboard');
      if (response.data?.success) {
        setData(response.data.dashboardData);
      } else {
        toast.error(response.data?.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Unable to fetch dashboard data. Please try again later.');
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData();
    }
  }, [isOwner]);

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title="Admin Dashboard"
        subTitle="Monitor platform performance including total cars, bookings, revenue, and recent activities"
      />

      {/* === Dashboard Stats Cards === */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor"
          >
            <div>
              <h1 className="text-xs text-gray-500">{card.title}</h1>
              <p className="text-lg font-semibold">{card.value}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              {card.icon && <img src={card.icon} alt={card.title} className="h-4 w-4" />}
            </div>
          </div>
        ))}
      </div>

      {/* === Recent Bookings & Monthly Revenue === */}
      <div className="flex flex-wrap items-start gap-6 mb-8 w-full">
        {/* === Recent Bookings === */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full">
          <h1 className="text-lg font-medium">Recent Bookings</h1>
          <p className="text-gray-500">Latest customer bookings</p>

          {Array.isArray(data.recentBookings) && data.recentBookings.length > 0 ? (
            data.recentBookings.map((booking, index) => (
              <div key={index} className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    {assets.listIconColored && (
                      <img
                        src={assets.listIconColored}
                        alt="Booking Icon"
                        className="h-5 w-5"
                      />
                    )}
                  </div>
                  <div>
                    <p>
                      {booking?.car?.brand || 'N/A'} {booking?.car?.model || ''}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking?.createdAt
                        ? booking.createdAt.split('T')[0]
                        : 'Unknown date'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <p className="text-sm text-gray-500">
                    {currency}
                    {booking?.price || 0}
                  </p>
                  <p className="px-3 py-0.5 border border-borderColor rounded-full text-sm capitalize">
                    {booking?.status || 'pending'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-4 text-sm">No recent bookings found.</p>
          )}
        </div>

        {/* === Monthly Revenue === */}
        <div className="p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs">
          <h1 className="text-lg font-medium">Monthly Revenue</h1>
          <p className="text-gray-500">Revenue for current month</p>
          <p className="text-3xl mt-6 font-semibold text-primary">
            {currency} {data?.monthlyRevenue?.toLocaleString() || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
