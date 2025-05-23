"use client"; // for app directory or interaction (optional)

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function SignupPage() {
  const [Username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, Username, rememberMe }),
      });

      const data = await response.json();
      if (data.valid === 0 || data.valid === 2) {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("Username",Username);
        router.push("/");
      } else if(data.valid === 3){
        alert("User already registered!");
        router.push("/login");
      }else {
        alert("Username Exists Already!");
        return;
      }
    } catch (err) {
      console.error("Login error:", err);
    } 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-600 text-transparent bg-clip-text">
          Create Your Account
        </h2>
        
        <form className="mt-6" onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 border-gray-300"
            required
          />

          <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            placeholder="youremail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 border-gray-300"
            required
          />

          <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 border-gray-300"
            required
          />

          <div className="flex items-center mt-4">
            <label className="flex items-center text-sm font-medium text-gray-800">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me on this device
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 active:scale-95 text-white font-semibold py-2 rounded-md transition-all duration-150 transform"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}