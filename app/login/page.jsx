"use client"; // for app directory or interaction (optional)

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();
      if (data.valid === 0) {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("Username",data.username);
        router.push("/");
      } else if (data.valid === 2) {
        alert("Please Sign up first!");
        router.push("/signup");
      } else {
        setError(data.error || "Invalid Email or Password");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-600 text-transparent bg-clip-text">
          Welcome Back
        </h2>

        <form className="mt-6" onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700">
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

          <div className="flex items-center justify-between mt-4">
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

          <div className="text-right mt-2">
            <a
              href="#"
              className="text-sm text-blue-500 hover:underline font-medium"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 active:scale-95 text-white font-semibold py-2 rounded-md transition-all duration-150 transform disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {error && (
            <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
          )}
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 font-medium hover:underline">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}