import React from "react";

export default function CommunityUser({ closeOpenProfile, post }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto p-0 overflow-hidden">
        <div className="flex flex-col items-center  bg-blue-100 px-5 py-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-row items-center gap-3">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold uppercase shadow">
                  {post.author?.name?.[0] || "U"}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-blue-800">
                    {post.author?.name || "No Name"}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {post.author?.email || "No Email"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeOpenProfile}
                className="text-gray-500 hover:text-blue-600 text-3xl leading-6 cursor-pointer"
                aria-label="Close dialog"
              >
                &times;
              </button>
            </div>
            <div className="text-sm text-black/80">
              <span className="font-semibold ">Bio:</span>{" "}
              {post.author?.bio || (
                <span className="italic text-blue-100">No bio yet</span>
              )}
            </div>
          </div>
        </div>
        <div className="px-7 py-4">
          <h3 className="text-base font-bold text-blue-700 mb-1">Post</h3>
          <div className="bg-gray-50 border p-4 rounded-lg shadow">
            <p className="mb-3">{post.content}</p>
            <small className="text-xs text-gray-400 block">
              Posted on {new Date(post.createdAt).toLocaleString()}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
