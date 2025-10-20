import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { assets, ownerMenuLinks } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Slidebar = () => {
  const { user, axios, fetchUser } = useAppContext();
  const location = useLocation();
  const [image, setImage] = useState('');

  const updateImage = async () => {
    if (!image) return;

    try {
      const formData = new FormData();
      formData.append('image', image);

      const { data } = await axios.put('/api/owner/update-image', formData);

      if (data.success) {
        // Wait for fetchUser to complete so the updated image is available
        await fetchUser();
        toast.success(data.message);
        setImage(''); // clear local file only after context updates
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error('Upload error', err.response?.data || err.message);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Something went wrong while updating the image.';
      toast.error(msg);
    }
  };

  // Safe handling for environment & image path
  const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

  const displayedImage = (() => {
    if (image) return URL.createObjectURL(image); // local preview
    if (user?.image && user.image.trim() !== '') {
      return user.image.startsWith('http')
        ? user.image
        : `${BASE_URL}/${user.image}`;
    }
    return assets.default_user || '/default_user.png';
  })();

  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borrderColor text-sm">
      <div className="group relative">
        <label htmlFor="image">
          {displayedImage && (
            <img
              src={displayedImage}
              alt="Profile"
              className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto object-cover"
            />
          )}
          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
            <img src={assets.edit_icon} alt="Edit Icon" />
          </div>
        </label>
      </div>

      {image && (
        <button
          className="absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer"
          onClick={updateImage}
        >
          Save <img src={assets.check_icon} width={13} alt="Check" />
        </button>
      )}

      <p className="mt-2 text-base max-md:hidden">{user?.name || 'User'}</p>

      <div className="w-full">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
              link.path === location.pathname
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600'
            }`}
          >
            <img
              src={link.path === location.pathname ? link.coloredIcon : link.icon}
              alt="menu-icon"
            />
            <span className="max-md:hidden">{link.name}</span>
            {link.path === location.pathname && (
              <div className="bg-primary w-1.5 h-8 rounded-xl right-0 absolute"></div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Slidebar;
