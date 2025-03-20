import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase/config";
import { signOutUser } from "../config/firebase/firebasemethods";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);

        // Fetch user profile from Firestore
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

  // Search users by name or email
  const handleSearch = async () => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    const usersRef = collection(db, "profile");
    const q = query(usersRef, where("name", ">=", searchQuery));
    const querySnapshot = await getDocs(q);
    const userList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSearchResults(userList);
    setIsLoading(false);
  };

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
          <div className="flex-grow flex justify-center relative">
            <input
              type="text"
              placeholder="Search users..."
              className="input input-bordered w-64 md:w-96 text-center"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={handleSearch}
            />
            {/* Search Results Dropdown */}
            {searchQuery && (
              <div className="absolute top-12 bg-white rounded-lg shadow-md w-64 md:w-96 max-h-60 overflow-y-auto z-50">
                {isLoading ? (
                  <div className="p-4 text-center">Loading...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <Link
                      key={user.id}
                      to={`/profile/${user.id}`}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-100 transition duration-200"
                    >
                      <img
                        src={user.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-gray-800">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      {isAuthenticated && (
                        <button
                          className="ml-auto bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-200"
                          onClick={(e) => {
                            e.preventDefault();
                            // Add logic to send friend request
                            alert(`Friend request sent to ${user.name}`);
                          }}
                        >
                          Add Friend
                        </button>
                      )}
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center">No users found.</div>
                )}
              </div>
            )}
          </div>

          {/* Right Section - Profile and User Name */}
          <div className="flex items-center space-x-4">
            {/* Show User Name When Logged In */}
            {isAuthenticated && userData?.name && (
              <span className="text-lg font-semibold text-white">{userData.name}</span>
            )}

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full border border-white">
                  {/* Show User's Profile Image If Logged In, Else Show Dummy */}
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
    </div>
  );
};

export default Navbar;