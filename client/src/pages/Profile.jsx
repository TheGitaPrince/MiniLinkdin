import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/userSlice";
import { createPost, getPostsByUser, deletePost } from "../store/postSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EditProfile from "../components/EditProfile.jsx";
import EditPost from "../components/EditPost.jsx";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { myPosts, loading, error } = useSelector((state) => state.post);

  const [editing, setEditing] = useState(false);
  const [editingPost, setEditingPost] = useState(false);
  const [postData, setPostData] = useState(null);

  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    dispatch(getPostsByUser());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleLogout = async () => {
    const response = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(response)) {
      navigate("/login");
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      toast.error("Content is required.");
      return;
    }
    const response = await dispatch(createPost({ content: newPostContent }));
    if (createPost.fulfilled.match(response)) {
      toast.success("Post created.");
      setNewPostContent("");
      dispatch(getPostsByUser());
    }
  };

  const handleEditPost = (post) => {
    setPostData(post);
    setEditingPost(true);
  };

  const handleDeletePost = async (postId) => {
    const response = await dispatch(deletePost({ postId }));
    if (deletePost.fulfilled.match(response)) {
      toast.success("Post deleted.");
      dispatch(getPostsByUser());
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <section className="flex md:flex-row flex-col gap-7 md:justify-between bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg md:p-8 p-5 mb-10 shadow-lg text-white overflow-hidden">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-3">
            <div className="bg-white/40 w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold shadow border border-white">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-lg font-semibold tracking-wide">
                {" "}
                {user?.name || "Please set your name"}{" "}
              </div>
              <div className="text-blue-900/70 text-sm font-medium">
                {user?.email}
              </div>
            </div>
          </div>
          <div className="text-justify md:max-w-[500px]">
            <span className="font-semibold text-white/90">Bio:</span>{" "}
            {user?.bio || (
              <span className="italic text-blue-100">No bio yet</span>
            )}
          </div>
        </div>
        <div className="flex md:flex-col flex-row gap-4 justify-between ">
          <button
            onClick={() => setEditing(true)}
            className="bg-white/80 flex-shrink-0 text-blue-700 font-medium py-1 px-4 rounded hover:bg-white shadow transition cursor-pointer"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 flex-shrink-0 hover:bg-red-600 text-white font-bold py-1 px-4 rounded shadow transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-5 mb-8">
        <form onSubmit={handleCreatePost}>
          <textarea
            className="w-full ring-1 focus:ring-2 focus:ring-blue-300 rounded p-3 resize-none text-gray-700 focus:outline-none "
            rows={3}
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button
            type="submit"
            className="mt-2 px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition cursor-pointer"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow p-5">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">Your Posts</h3>
        <ul className="divide-y divide-gray-200">
          {myPosts && myPosts.length > 0 ? (
            myPosts.map((post) => (
              <li key={post._id} className="py-4">
                <div className="flex justify-between items-center">
                  <small className="text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </small>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="text-blue-600 hover:underline text-sm font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-red-500 hover:underline text-sm font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-gray-800 whitespace-pre-line">
                  {post.content}
                </p>
              </li>
            ))
          ) : (
            <p className="italic text-gray-500 text-center py-4">
              No posts yet.
            </p>
          )}
        </ul>
      </section>

      {editing && <EditProfile closeEditing={() => setEditing(false)} />}

      {editingPost && (
        <EditPost
          postData={postData}
          closeEditingPost={() => setEditingPost(false)}
        />
      )}
    </div>
  );
}
