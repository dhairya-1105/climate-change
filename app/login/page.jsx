"use client";

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
        credentials: "include", // Important for cookies
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (data.valid === 0) {
        // Success - store user data in localStorage
        localStorage.setItem("userEmail", email);
        localStorage.setItem("Username", data.username);

        // Redirect to home page
        setTimeout(() => {
          router.push("/");
          // wait a little before refreshing, to ensure navigation
          setTimeout(() => {
            router.refresh();
          }, 100);  // small delay after push
        }, 1500);


      } else if (data.valid === 2) {
        // User not found
        setError("User not found. Please sign up first!");
        setTimeout(() => {
          router.push("/signup");
        }, 2000);
      } else {
        // Invalid credentials or other error
        setError(data.error || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20" style={{ backgroundColor: "rgba(26,36,32,0.45)" }}>
      <div className="max-w-md w-full shadow-2xl rounded-xl p-8 sm:p-10 border" style={{
        backgroundColor: '#384D48',
        borderColor: '#4A5D57'
      }}>
        <h2 className="text-2xl sm:text-3xl font-bold text-center" style={{ color: '#F5F5F5' }}>
          Welcome Back
        </h2>

        <form className="mt-6" onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium" style={{ color: '#E8E8E8' }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="youremail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-70 transition-all duration-200"
            style={{
              backgroundColor: '#4A5D57',
              borderColor: '#6B7A73',
              color: '#F5F5F5',
              '--tw-ring-color': '#7FB069'
            }}
            required
            disabled={isLoading}
          />

          <label className="block mt-4 mb-2 text-sm font-medium" style={{ color: '#E8E8E8' }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-70 transition-all duration-200"
            style={{
              backgroundColor: '#4A5D57',
              borderColor: '#6B7A73',
              color: '#F5F5F5',
              '--tw-ring-color': '#7FB069'
            }}
            required
            disabled={isLoading}
          />

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center text-sm font-medium" style={{ color: '#D0D0D0' }}>
              <input
                type="checkbox"
                className="mr-2 rounded"
                style={{ accentColor: '#7FB069' }}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              Remember me on this device
            </label>
          </div>

          <div className="text-right mt-2">
            <a
              href="#"
              className="text-sm hover:underline font-medium transition-colors duration-200"
              style={{ color: '#9BC53D' }}
              onMouseEnter={(e) => e.target.style.color = '#B8E356'}
              onMouseLeave={(e) => e.target.style.color = '#9BC53D'}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full mt-6 font-semibold py-3 rounded-md transition-all duration-200 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#7FB069',
              color: '#1A2B24',
              boxShadow: '0 4px 12px rgba(127, 176, 105, 0.3)'
            }}
            onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#9BC53D', e.target.style.boxShadow = '0 6px 16px rgba(155, 197, 61, 0.4)')}
            onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#7FB069', e.target.style.boxShadow = '0 4px 12px rgba(127, 176, 105, 0.3)')}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {error && (
            <div className="mt-4 p-3 rounded-md" style={{ backgroundColor: '#4A2C2C', borderLeft: '4px solid #FF7B7B' }}>
              <p className="text-sm" style={{ color: '#FF7B7B' }}>{error}</p>
            </div>
          )}
        </form>

        <div className="text-center mt-6 text-sm" style={{ color: '#C5C5C5' }}>
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium hover:underline transition-colors duration-200"
            style={{ color: '#9BC53D' }}
            onMouseEnter={(e) => e.target.style.color = '#B8E356'}
            onMouseLeave={(e) => e.target.style.color = '#9BC53D'}
          >
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}