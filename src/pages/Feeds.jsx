import React, { useEffect, useState } from "react";
import { FaRegSmile, FaRegImage, FaVideo, FaRegComment, FaRegHeart, FaHeart, FaShare } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../config/firebase/config";
import { collection, addDoc, getDocs, updateDoc, doc, getDoc, arrayUnion, arrayRemove, orderBy, query } from "firebase/firestore";
import { FaCloudUploadAlt } from "react-icons/fa";
import RightSidebar from "../components/RightSidebar";
import LeftSideBar from "../components/LeftSidebar";

const Feeds = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState("");
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "profile", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser({ ...userSnap.data(), uid: currentUser.uid });
        }
      }
    });

    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const postList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPosts(postList);
  };

  const toggleLike = async (postId, likes) => {
    if (!user) return alert("Please log in to like a post!");

    const postRef = doc(db, "posts", postId);
    const userLike = { uid: user.uid, userName: user.name };

    if (likes.some((like) => like.uid === user.uid)) {
      await updateDoc(postRef, { likes: arrayRemove(userLike) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(userLike) });
    }
    fetchPosts();
  };

  const addComment = async (postId) => {
    if (!user) return alert("Please log in to comment!");
    if (!commentText[postId]?.trim()) return alert("Comment cannot be empty.");

    const postRef = doc(db, "posts", postId);
    const newComment = {
      uid: user.uid,
      userName: user.name,
      userImage: user.profileImage,
      text: commentText[postId],
      timestamp: new Date().toISOString(),
    };

    await updateDoc(postRef, { comments: arrayUnion(newComment) });
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    fetchPosts();
  };

  const toggleCommentSection = (postId) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="w-1/5 p-4 hidden md:block">
        <LeftSideBar />
      </div>

      <div className="w-2/5 p-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <div className="flex items-center space-x-3">
            <img
              src={user?.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <input
              type="text"
              placeholder="What's happening?"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
              onClick={() => setModalOpen(true)}
              readOnly
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow-lg rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <img src={post.userImage} alt="User" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold">{post.userName}</h3>
                  <p className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleString()}</p>
                </div>
              </div>

              {post.content && <p className="mt-2">{post.content}</p>}
              {post.image && (
                <img src={post.image} alt="Post" className="mt-2 rounded-lg w-full" />
              )}

              <div className="flex justify-between items-center mt-3 text-gray-600">
                <button className="flex items-center space-x-1 hover:text-blue-500" onClick={() => toggleLike(post.id, post.likes || [])}>
                  {post.likes?.some((like) => like.uid === user?.uid) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                  <span>{post.likes?.length || 0} Likes</span>
                </button>

                <button className="flex items-center space-x-1 hover:text-blue-500" onClick={() => toggleCommentSection(post.id)}>
                  <FaRegComment />
                  <span>{post.comments?.length || 0} Comments</span>
                </button>
              </div>

              {expandedComments[post.id] && (
                <div className="border-t mt-3 pt-3 max-h-40 overflow-y-auto">
                  {post.comments?.map((comment, index) => (
                    <div key={index} className="flex items-start space-x-2 mb-2">
                      <img src={comment.userImage} alt="User" className="w-8 h-8 rounded-full" />
                      <div className="bg-gray-100 p-2 rounded-lg w-full">
                        <p className="text-sm font-semibold">{comment.userName}</p>
                        <p className="text-sm">{comment.text}</p>
                        <p className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-3 mt-3 flex items-center">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400 ml-2"
                  value={commentText[post.id] || ""}
                  onChange={(e) => setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                />
                <button className="p-2 bg-pink-500 text-white rounded-full ml-2" onClick={() => addComment(post.id)}>
                  <IoSend />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/3 p-4 hidden md:block">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Feeds;
