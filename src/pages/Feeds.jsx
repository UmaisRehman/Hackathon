import React, { useEffect, useState } from "react";
import {
  FaRegSmile,
  FaRegImage,
  FaRegComment,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../config/firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  arrayUnion,
  arrayRemove,
  orderBy,
  query,
} from "firebase/firestore";
import { FaCloudUploadAlt } from "react-icons/fa";
import RightSidebar from "../components/RightSidebar";
import LeftSideBar from "../components/LeftSidebar";
import CommentModal from "../components/CommentModal";

const Feeds = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState("");
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);

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

  const uploadImage = () => {
    let myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dkzm5hoxm",
        uploadPreset: "exper-hackathon",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setPostImage(result.info.secure_url);
        }
      }
    );
    myWidget.open();
  };

  const handlePostUpload = async () => {
    if (!postContent && !postImage) {
      alert("Please enter some text or upload an image.");
      return;
    }

    const newPost = {
      uid: user?.uid,
      userName: user?.name || "Unknown",
      userImage: user?.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      content: postContent,
      image: postImage || "",
      likes: [],
      comments: [],
      timestamp: new Date().toISOString(),
    };

    await addDoc(collection(db, "posts"), newPost);
    setPostContent("");
    setPostImage("");
    fetchPosts();
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

  const openCommentModal = (post) => {
    setSelectedPost(post);
  };

  const closeCommentModal = () => {
    setSelectedPost(null);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-1/5 p-4 hidden md:block">
        <LeftSideBar />
      </div>

      {/* Main Feed */}
      <div className="w-full md:w-3/5 p-6 overflow-y-auto scrollbar-hide">
        {/* Create Post Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-3">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={user?.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Profile"
            />
            <input
              className="flex-1 bg-gray-100 border border-gray-200 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>

          <div className="mt-4 flex space-x-4 text-sm text-gray-600">
            <button
              className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition duration-200"
              onClick={uploadImage}
            >
              <FaRegImage className="w-5 h-5 text-blue-500" />
              <span>Add Photo/Video</span>
            </button>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-200"
              onClick={handlePostUpload}
              disabled={!postContent}
            >
              Post
            </button>
          </div>
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              {/* Post Header */}
              <div className="flex items-center space-x-3">
                <img
                  src={post.userImage}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-gray-800">{post.userName}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(post.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              {post.content && (
                <p className="mt-3 text-gray-700">{post.content}</p>
              )}

              {/* Post Image */}
              {post.image && (
                <div className="mt-3">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-auto rounded-lg object-cover"
                    style={{ maxHeight: "500px" }}
                  />
                </div>
              )}

              {/* Like and Comment Buttons */}
              <div className="flex justify-between items-center mt-4 text-gray-600">
                <button
                  className="flex items-center space-x-2 hover:text-blue-500 transition duration-200"
                  onClick={() => toggleLike(post.id, post.likes || [])}
                >
                  {post.likes?.some((like) => like.uid === user?.uid) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span>{post.likes?.length || 0} Likes</span>
                </button>

                <button
                  className="flex items-center space-x-2 hover:text-blue-500 transition duration-200"
                  onClick={() => openCommentModal(post)}
                >
                  <FaRegComment />
                  <span>{post.comments?.length || 0} Comments</span>
                </button>
              </div>

              {/* Latest Comment */}
              {post.comments?.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={post.comments[post.comments.length - 1].userImage}
                      alt="User"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {post.comments[post.comments.length - 1].userName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {post.comments[post.comments.length - 1].text}
                      </p>
                    </div>
                  </div>

                  {/* See More Button */}
                  {post.comments.length > 1 && (
                    <button
                      className="text-blue-500 text-sm mt-2 hover:underline"
                      onClick={() => openCommentModal(post)}
                    >
                      See more comments...
                    </button>
                  )}
                </div>
              )}

              {/* Comment Input */}
              <div className="border-t pt-4 mt-4 flex items-center">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 bg-gray-100 border border-gray-200 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={commentText[post.id] || ""}
                  onChange={(e) =>
                    setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                />
                <button
                  className="p-2 bg-blue-500 text-white rounded-full ml-2 hover:bg-blue-600 transition duration-200"
                  onClick={() => addComment(post.id)}
                >
                  <IoSend />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-1/5 p-4 hidden md:block">
        <RightSidebar />
      </div>

      {/* Comment Modal */}
      {selectedPost && <CommentModal post={selectedPost} onClose={closeCommentModal} />}
    </div>
  );
};

export default Feeds;