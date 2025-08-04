import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePost, getPostsByUser } from "../store/postSlice";
import toast from "react-hot-toast";

function EditPost({ closeEditingPost, postData }) {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.post);

  const [editPostContent, setEditPostContent] = useState(postData?.content || "");
 
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error ]);

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editPostContent.trim()) {
      toast.error("Content is required.");
      return;
    }
    const response = await dispatch(updatePost({ postId: postData._id, content: editPostContent }));
    if (updatePost.fulfilled.match(response)) {
      toast.success("Post updated.");
      closeEditingPost();
      dispatch(getPostsByUser());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Edit Post</h3>
        <form onSubmit={handleUpdatePost} className="flex flex-col">
          <textarea
            className="border p-2 rounded mb-4"
            value={editPostContent}
            onChange={(e) => setEditPostContent(e.target.value)}
            rows={3}
            placeholder="Update your post..."
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeEditingPost}
              className="px-3 py-1 rounded border border-gray-400 hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
