import React, { useState } from 'react';

const PostSection = () => {
  const [postContent, setPostContent] = useState('');

  const handleContentChange = (e) => {
    setPostContent(e.target.value);
  };

  const handlePostSubmit = () => {
    if (postContent) {
      console.log('Post submitted: ', postContent);
      setPostContent(''); // Clear the text after submission
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        {/* User Avatar and Input */}
        <div className="flex items-center space-x-3">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src="https://www.w3schools.com/w3images/avatar2.png"
            alt="User Avatar"
          />
          <input
            className="flex-1 bg-gray-100 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="What's on your mind?"
            value={postContent}
            onChange={handleContentChange}
          />
        </div>

        {/* Options for Adding Media or Tagging */}
        <div className="mt-4 flex space-x-4 text-sm text-gray-600">
          <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 text-blue-500"
            >
              <path d="M19 19l-7-7 7-7" />
            </svg>
            <span>Add Photo/Video</span>
          </button>
          <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 text-green-500"
            >
              <path d="M12 4v16M4 12h16" />
            </svg>
            <span>Tag Friends</span>
          </button>
          <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 text-yellow-500"
            >
              <path d="M12 6v12m6-6H6" />
            </svg>
            <span>Feeling/Activity</span>
          </button>
        </div>

        {/* Post Button */}
        <div className="mt-4 flex justify-end">
          <button
            className={`btn btn-primary ${!postContent ? 'btn-disabled' : ''}`}
            onClick={handlePostSubmit}
            disabled={!postContent}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostSection;
