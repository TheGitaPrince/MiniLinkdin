import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createUser,  } from "../store/userSlice.js";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSignup = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Email and Password are required.");
      return;  
    }
    const response = await dispatch(createUser({ email, password }));
    if (createUser.fulfilled.match(response)) {
        toast.success(`Welcome to ${email}.`);
        navigate("/home")
    }
  }

  return (
    <section className="flex items-center justify-center py-8 min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl py-7 px-8 shadow-lg">
            <h2 className="text-center text-2xl text-primary-700 font-bold leading-tight mb-4">
              Sign up to your account
            </h2>
            <p className="mb-5 text-center text-primary-500 text-base">
              Already have an account?&nbsp;
              <Link to="/login" className="hover:underline hover:text-primary-700 font-semibold">
                Sign in
              </Link>
            </p>

            <form onSubmit={onSignup} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-3 py-2 rounded-lg text-neutral-700 bg-blue-100 outline-none placeholder:text-neutral-500 focus:ring-1"
                placeholder="Enter your email"
              />
              <input
                type="t"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3 py-2 rounded-lg text-neutral-700 bg-blue-100 outline-none placeholder:text-neutral-500 focus:ring-1"
                placeholder="Enter your Password"
              />

              <button
                type="submit"
                className="w-full rounded-lg px-4 py-2 font-semibold cursor-pointer transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? "Createing..." : "Create Account"}
              </button>
            </form>   
      </div>
    </section>
)};
