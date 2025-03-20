import React, { useEffect, useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { auth, db } from "../config/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const RightSidebar = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        console.log("Current User ID:", user.uid); // Debugging

        // Fetch current user's profile
        const userRef = doc(db, "profile", user.uid);
        const unsubscribeProfile = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            console.log("User Data:", userData); // Debugging
            setFriendRequests(userData.friendRequests || []);
            setFriends(userData.friends || []);
          } else {
            console.log("User document does not exist."); // Debugging
          }
        });

        return () => unsubscribeProfile();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Send friend request
  const sendFriendRequest = async (toUserId) => {
    const fromUserId = auth.currentUser.uid;
    console.log("Sending friend request from:", fromUserId, "to:", toUserId); // Debugging

    // Add request to recipient's profile
    const toUserRef = doc(db, "profile", toUserId);
    await updateDoc(toUserRef, {
      friendRequests: arrayUnion({ userId: fromUserId, status: "pending" }),
    });

    console.log("Friend request sent successfully."); // Debugging
    alert("Friend request sent!");
  };

  // Accept friend request
  const acceptFriendRequest = async (fromUserId) => {
    const currentUserRef = doc(db, "profile", auth.currentUser.uid);
    const fromUserRef = doc(db, "profile", fromUserId);

    // Remove request from current user's profile
    await updateDoc(currentUserRef, {
      friendRequests: arrayRemove({ userId: fromUserId, status: "pending" }),
    });

    // Add to friends list for both users
    await updateDoc(currentUserRef, {
      friends: arrayUnion({ userId: fromUserId, timestamp: new Date().toISOString() }),
    });
    await updateDoc(fromUserRef, {
      friends: arrayUnion({ userId: auth.currentUser.uid, timestamp: new Date().toISOString() }),
    });

    console.log("Friend request accepted successfully."); // Debugging
    alert("Friend request accepted!");
  };

  // Reject friend request
  const rejectFriendRequest = async (fromUserId) => {
    const currentUserRef = doc(db, "profile", auth.currentUser.uid);

    // Remove request from current user's profile
    await updateDoc(currentUserRef, {
      friendRequests: arrayRemove({ userId: fromUserId, status: "pending" }),
    });

    console.log("Friend request rejected successfully."); // Debugging
    alert("Friend request rejected!");
  };

  return (
    <div className="mx-auto p-4 space-y-4 bg-white shadow-md rounded-lg">
      {/* Friend Requests */}
      <div className="p-4 border-b">
        <h3 className="text-gray-800 font-semibold mb-3">Friend Requests</h3>
        {friendRequests.length > 0 ? (
          friendRequests.map((request, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{request.userId}</h4>
                  <p className="text-xs text-gray-500">Sent you a friend request</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition duration-200"
                  onClick={() => acceptFriendRequest(request.userId)}
                >
                  Accept
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition duration-200"
                  onClick={() => rejectFriendRequest(request.userId)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No pending friend requests.</p>
        )}
      </div>

      {/* Friends List */}
      <div>
        <h3 className="font-semibold text-gray-800">Friends</h3>
        <div className="space-y-3 mt-2">
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <div className="flex items-center space-x-3">
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
                <FaRegCommentDots className="text-gray-500" />
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No friends yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;