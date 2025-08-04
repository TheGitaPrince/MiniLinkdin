import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllPosts } from "../store/postSlice.js";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import CommunityUser from "../components/CommunityUser.jsx";

export default function HomeFeed() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts, loading, error } = useSelector((state) => state.post);

  const [openProfile, setOpenProfile] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleCommunityUser = (post) => {
    setOpenProfile(true);
    setPost(post);
  };

  return (
    <div className="min-h-screen bg-blue-50 pt-4 pb-10 px-2">
      <header className="bg-white shadow rounded-md max-w-xl mx-auto flex items-center justify-between px-3 md:px-6 py-3 mb-8">
        <div className="flex items-center gap-3 w-full">
          <div className="bg-blue-600 text-white flex items-center justify-center rounded-full w-10 h-10 font-bold text-lg uppercase">
            {user?.name?.[0] || "U"}
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between">
              <div className="font-semibold">{user?.name || "Please set your name"}</div>
              <Link
                to="/profile"
                className="bg-blue-600 hover:bg-blue-700 text-white md:px-4 px-3 py-0.5 md:py-1 rounded transition shadow cursor-pointer"
              >
                My Profile
              </Link>
            </div>
            <div className="text-gray-500 text-sm">{user?.email}</div>
          </div>
        </div>
      </header>
      <main className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-5 text-blue-700 text-center">
          Community Feed
        </h1>
        {loading && (
          <p className="text-center text-gray-400 mb-8">Loading posts...</p>
        )}
        <ul className="space-y-5">
          {posts &&
            posts.length > 0 &&
            posts.map((post) => (
              <li
                onClick={() => handleCommunityUser(post)}
                key={post._id}
                className="bg-white shadow rounded-lg p-4 hover:ring-2 hover:ring-blue-200 duration-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-blue-700">
                    {post.author.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-800">{post.content}</p>
              </li>
            ))}
        </ul>
        {!loading && posts.length === 0 && (
          <div className="text-center mt-10 text-gray-400 italic">
            No posts to show.
          </div>
        )}
      </main>
      {openProfile && (
        <CommunityUser
          closeOpenProfile={() => setOpenProfile(false)}
          post={post}
        />
      )}
    </div>
  );
}
