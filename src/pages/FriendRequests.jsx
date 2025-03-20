import React, { useEffect, useState } from "react";
import { db } from "../config/firebase/config";
import { collection, addDoc, getDocs, doc, onSnapshot, query, where } from "firebase/firestore";

const Friends = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);

  // Fetch all users (for search)
  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(db, "profile");
      const q = query(usersRef, where("name", ">=", searchQuery));
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };

    fetchUsers();
  }, [searchQuery]);

  // Fetch real-time friend requests
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "friendRequests"), (snapshot) => {
      const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFriendRequests(requests);
    });

    return () => unsubscribe();
  }, []);

  // Send friend request
  const sendFriendRequest = async (toUserId) => {
    const fromUserId = auth.currentUser.uid;
    await addDoc(collection(db, "friendRequests"), {
      fromUserId,
      toUserId,
      status: "pending",
      timestamp: new Date().toISOString(),
    });
  };

  // Accept friend request
  const acceptFriendRequest = async (requestId) => {
    const requestRef = doc(db, "friendRequests", requestId);
    await updateDoc(requestRef, { status: "accepted" });

    // Add to friends collection
    const request = friendRequests.find((req) => req.id === requestId);
    await addDoc(collection(db, "friends"), {
      userId1: request.fromUserId,
      userId2: request.toUserId,
      timestamp: new Date().toISOString(),
    });
  };

  // Reject friend request
  const rejectFriendRequest = async (requestId) => {
    const requestRef = doc(db, "friendRequests", requestId);
    await updateDoc(requestRef, { status: "rejected" });
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* User List */}
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <img
                src={user.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={() => sendFriendRequest(user.id)}
            >
              Add Friend
            </button>
          </div>
        ))}
      </div>

      {/* Friend Requests */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
        <div className="space-y-4">
          {friendRequests
            .filter((req) => req.toUserId === auth.currentUser.uid && req.status === "pending")
            .map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
                <div className="flex items-center space-x-3">
                  <img
                    src={request.fromUserImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800">{request.fromUserName}</h3>
                    <p className="text-sm text-gray-500">Sent you a friend request</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                    onClick={() => acceptFriendRequest(request.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                    onClick={() => rejectFriendRequest(request.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Friends;