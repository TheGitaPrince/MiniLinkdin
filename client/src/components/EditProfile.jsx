import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { update as updateUser } from "../store/userSlice";
import toast from "react-hot-toast";

function EditProfile({ closeEditing }) {
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);

  const [editName, setEditName] = useState(user?.name || "");
  const [editBio, setEditBio] = useState(user?.bio || "");

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim() && !editBio.trim()) {
      toast.error("Name and bio are required.");
      return;
    }
    const response = await dispatch(
      updateUser({ name: editName, bio: editBio })
    );
    if (updateUser.fulfilled.match(response)) {
      toast.success("Profile Updated.");
      closeEditing();
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
        <form onSubmit={handleProfileUpdate} className="flex flex-col">
          <label className="mb-1 font-semibold">Name</label>
          <input
            type="text"
            className="border p-2 rounded mb-4"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <label className="mb-1 font-semibold">Bio</label>
          <textarea
            className="border p-2 rounded mb-4"
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            rows={3}
            placeholder="Write something about yourself..."
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeEditing}
              className="px-3 py-1 rounded border border-gray-400 hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
