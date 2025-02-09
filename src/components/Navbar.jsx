import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase/config";
import { signOutUser } from "../config/firebase/firebasemethods";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);

        // ✅ Fetch user profile from Firestore
        const userRef = doc(db, "profile", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data()); // Save user data (name & profileImage)
        } else {
          setUserData(null); // No data found
        }
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }
    });
  }, []);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        console.log("Logged out successfully");
        navigate("/login");
      })
      .catch((err) => {
        console.log("Sign-out failed:", err);
      });
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-teal-500 sticky top-0 z-50 shadow-lg w-full">
      <div className="max-w-screen-xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center w-full">
          {/* Left Section - App Name */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="btn btn-ghost text-xl font-bold">Scrolling App</Link>
          </div>

          {/* Center - Search Input */}
          <div className="flex-grow flex justify-center">
            <input type="text" placeholder="Search" className="input input-bordered w-64 md:w-96 text-center" />
          </div>

          {/* Right Section - Profile and User Name */}
          <div className="flex items-center space-x-4">
            {/* ✅ Show User Name When Logged In */}
            {isAuthenticated && userData?.name && (
              <span className="text-lg font-semibold text-white">{userData.name}</span>
            )}

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full border border-white">
                  {/* ✅ Show User's Profile Image If Logged In, Else Show Dummy */}
                  <img
                    alt="User Avatar"
                    src={
                      isAuthenticated && userData?.profileImage
                        ? userData.profileImage
                        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link to="/profile" className="justify-between">Profile</Link>
                    </li>
                    <li>
                      <button onClick={handleSignOut}>Logout</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`md:hidden transform transition-transform duration-300 ${isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"} origin-top bg-blue-600 p-4`}>
        <Link to="/" className="block text-white py-2 hover:bg-blue-500 rounded-md px-4">Home</Link>
        <Link to="/dashboard" className="block text-white py-2 hover:bg-blue-500 rounded-md px-4">Dashboard</Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="block text-white py-2 hover:bg-blue-500 rounded-md px-4">Profile</Link>
            <button 
              onClick={handleSignOut} 
              className="block w-full text-left text-white py-2 hover:bg-red-500 rounded-md px-4 transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="block text-white py-2 hover:bg-blue-500 rounded-md px-4">Login</Link>
            <Link to="/register" className="block text-white py-2 hover:bg-blue-500 rounded-md px-4">Register</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
