import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // ✅ Fetch user data (requires token)
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");
      if (data?.success) {
        setUser(data.user);
        setIsOwner(data.user.isOwner);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("User fetch error:", error);
      setUser(null);
      setIsOwner(false);
      navigate("/");
    }
  };

  // ✅ Fetch all cars (public or protected)
  const fetchAllCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      if (data?.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Cars fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to load cars");
    }
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsOwner(false);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out successfully");
    navigate("/");
  };

  // ✅ Restore token when app loads
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
  }, []);

  // ✅ Fetch cars always (public data)
  useEffect(() => {
    fetchAllCars();
  }, []);

  // ✅ Fetch user data only when logged in
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    }
  }, [token]);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    showLogin,
    setShowLogin,
    logout,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    cars,
    setCars,
    fetchAllCars,
    fetchUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
