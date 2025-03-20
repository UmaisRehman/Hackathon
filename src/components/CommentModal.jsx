import React from "react";

const CommentModal = ({ post, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Comments</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition duration-200"
            >
              &times;
            </button>
          </div>

          {/* Post Content */}
          <div className="mb-6">
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
            {post.content && (
              <p className="mt-3 text-gray-700">{post.content}</p>
            )}
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="mt-3 rounded-lg w-full"
              />
            )}
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            {post.comments.map((comment, index) => (
              <div key={index} className="flex items-start space-x-3">
                <img
                  src={comment.userImage}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">
                    {comment.userName}
                  </h3>
                  <p className="text-sm text-gray-600">{comment.text}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(comment.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;