import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { loginUser } from "../config/firebase/firebasemethods";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing Eye icons

function Login() {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/"); // Redirect to home if user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser({
      email: email.current.value,
      password: password.current.value,
    })
      .then(() => {
        toast.success("Logged in successfully!");
        navigate("/");
      })
      .catch((err) => {
        console.error("Login failed:", err.message);
        setError("Login failed. Please check your credentials.");
        toast.error("Login failed. Please try again.");
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full max-w-xs"
                ref={email}
                required
              />
            </div>
            <div className="form-control w-full max-w-xs mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input input-bordered w-full max-w-xs pr-10"
                  ref={password}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <button type="submit" className="btn btn-accent w-full mt-6">
              Login
            </button>
            <div className="mt-4 text-center">
              <h1>
                Don’t have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Register Here
                </Link>
              </h1>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
