import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

const Login = () => {
  const { setShowLogin, axios, setToken, navigate, fetchAllCars } = useAppContext();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle form submit
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Basic validation
    if (state === "register" && !name.trim()) return toast.error("Name is required");
    if (!email.trim() || !password.trim()) return toast.error("All fields are required");

    try {
      setLoading(true);
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        // ✅ Save token and attach to Axios
        localStorage.setItem("token", data.token);
        setToken(data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        // ✅ Success flow
        toast.success(`Welcome ${state === "register" ? "on board!" : "back!"}`);
        setShowLogin(false);

        // Refresh available cars after login (optional)
        fetchAllCars();

        // Redirect user
        navigate("/cars");
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Network error. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset input fields when switching login/register
  const toggleState = (newState) => {
    setState(newState);
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="flex justify-center items-center fixed inset-0 bg-black/50 text-sm text-gray-600 z-50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Type your name"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Type your email"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>

        <p className="text-center w-full">
          {state === "register" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => toggleState("login")}
                className="text-primary cursor-pointer font-medium"
              >
                Login
              </span>
            </>
          ) : (
            <>
              Create an account?{" "}
              <span
                onClick={() => toggleState("register")}
                className="text-primary cursor-pointer font-medium"
              >
                Sign Up
              </span>
            </>
          )}
        </p>

        <button
          type="submit"
          disabled={loading}
          className={`bg-primary text-white w-full py-2 rounded-md transition-all flex justify-center items-center gap-2 ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:bg-primary/90"
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <FaSpinner className="animate-spin" /> Please wait...
            </span>
          ) : state === "register" ? (
            "Create Account"
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
