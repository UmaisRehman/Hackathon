import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "../config/firebase/config";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(db, "profile", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUser(userSnap.data());

        // Check if the current user is friends with this user
        const currentUserRef = doc(db, "profile", auth.currentUser.uid);
        const currentUserSnap = await getDoc(currentUserRef);
        if (currentUserSnap.exists()) {
          const currentUserData = currentUserSnap.data();
          setIsFriend(currentUserData.friends?.some((friend) => friend.userId === userId));
        }
      }
    };

    fetchUser();
  }, [userId]);

  // Send friend request
  const sendFriendRequest = async () => {
    const currentUserRef = doc(db, "profile", auth.currentUser.uid);
    const toUserRef = doc(db, "profile", userId);

    // Add request to recipient's profile
    await updateDoc(toUserRef, {
      friendRequests: arrayUnion({ userId: auth.currentUser.uid, status: "pending" }),
    });

    alert("Friend request sent!");
  };

  return (
    <div className="p-6">
      {/* User Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={user?.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Friend Request Button */}
        {!isFriend && (
          <button
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-200"
            onClick={sendFriendRequest}
          >
            Add Friend
          </button>
        )}
      </div>

      {/* Friends List */}
      <div>
        <h3 className="font-semibold text-gray-800">Friends</h3>
        <div className="space-y-3 mt-2">
          {user?.friends?.map((friend, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-medium text-gray-900 text-sm">{friend.userId}</h4>
                <p className="text-xs text-gray-500">Friend since {new Date(friend.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;