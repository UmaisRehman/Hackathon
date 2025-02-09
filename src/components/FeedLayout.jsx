import React from "react";
import LeftSidebar from "../components/LeftSidebar";
import Feeds from "../components/Feeds";
import RightSidebar from "../components/RightSidebar";

const FeedLayout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* ✅ Left Sidebar */}
      <div className="w-1/5 bg-white shadow-lg p-4 hidden md:block">
        <LeftSidebar />
      </div>

      {/* ✅ Center Feed */}
      <div className="w-3/5 p-6">
        <Feeds />
      </div>

      {/* ✅ Right Sidebar */}
      <div className="w-1/5 bg-white shadow-lg p-4 hidden md:block">
        <RightSidebar />
      </div>
    </div>
  );
};

export default FeedLayout;
