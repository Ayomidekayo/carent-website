import React, { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Navbar = () => {
  const { setShowLogin, user, setIsOwner, logout, isOwner, axios } = useAppContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between px-6 md:px-8 lg:px-24 xl:px-32 py-4 text-gray-600 border-zinc-500 relative transition-all
      ${location.pathname === "/" && "bg-slate-100"}`}
    >
      {/* Logo */}
      <Link to="/">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="Carent Logo"
          className="w-32 h-8"
        />
      </Link>

      {/* Menu */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:gap-8
          sm:static sm:w-auto sm:h-auto sm:bg-transparent sm:shadow-none
          fixed top-0 right-0 h-full w-3/4 bg-white shadow-lg
          p-6 transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "translate-x-full"} sm:translate-x-0`}
      >
        {/* Close button inside mobile menu */}
        <button
          className="sm:hidden self-end mb-4"
          onClick={() => setOpen(false)}
        >
          <img src={assets.close_icon} alt="close" />
        </button>

        {/* Links */}
        {menuLinks.map((link, index) => (
          <Link
            to={link.path}
            key={index}
            className="w-full sm:w-auto hover:text-blue-700 transition-colors"
            onClick={() => setOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        {/* Search bar (desktop only) */}
        <div className="hidden lg:flex items-center text-sm gap-2 border px-3 rounded-full max-w-56">
          <input
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
          <button
            onClick={() => (isOwner ? navigate("/owner") : changeRole())}
            className="cursor-pointer w-full sm:w-auto hover:text-blue-700 transition-colors"
          >
            {isOwner ? "Dashboard" : "List"}
          </button>

          <button
            onClick={() => {
              user ? logout() : setShowLogin(true);
              setOpen(false);
            }}
            className="cursor-pointer px-6 py-2 w-full sm:w-auto bg-blue-700 hover:bg-blue-800 transition-all text-white rounded-lg text-center"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {/* Hamburger button */}
      <button className="sm:hidden cursor-pointer" onClick={() => setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>
    </motion.div>
  );
};

export default Navbar;
