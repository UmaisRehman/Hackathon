import React from "react";
import { FaHome, FaCompass, FaStore, FaUsers, FaStar, FaEnvelope, FaCog } from "react-icons/fa";

const LeftSidebar = () => {
  return (
    <div>
      <ul className="space-y-4 text-gray-700 font-medium">
        <li className="flex items-center space-x-3 hover:bg-gray-200 p-2 rounded-md">
          <FaHome /> <span>Feed</span>
        </li>
        <li className="flex items-center space-x-3 hover:bg-gray-200 p-2 rounded-md">
          <FaCompass /> <span>Explore</span>
        </li>
        <li className="flex items-center space-x-3 hover:bg-gray-200 p-2 rounded-md">
          <FaStore /> <span>Marketplace</span>
        </li>
        <li className="flex items-center space-x-3 hover:bg-gray-200 p-2 rounded-md">
          <FaUsers /> <span>Groups</span>
        </li>
        <li className="flex items-center space-x-3 hover:bg-gray-200 p-2 rounded-md">
          <FaStar /> <span>My Favorites</span>
        </li>
        <li className="flex items-center space-x-3 hover:bg-gray-200 p-2 rounded-md">
          <FaEnvelope /> <span>Messages</span>
        </li>
        <li className="flex items-center space-x-3 hover:bg-gray-200 p-2 rounded-md">
          <FaCog /> <span>Settings</span>
        </li>
      </ul>

      {/* ✅ My Contacts Section */}
      <div className="mt-6">
        <h3 className="text-lg font-bold">My Contacts</h3>
        <div className="mt-2">
          {/* Contact List Example */}
          <div className="flex items-center space-x-3 py-2">
            <img src="https://randomuser.me/api/portraits/women/1.jpg" className="w-10 h-10 rounded-full" />
            <p>Julia Clarke</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
