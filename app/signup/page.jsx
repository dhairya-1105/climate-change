"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          Username: username,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (data.valid === 0) {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("Username", username);

        setSuccess("Account created successfully! Redirecting...");

        setTimeout(() => {
          router.push("/");
          setTimeout(() => {
            router.refresh();
          }, 100);
        }, 1500);
      } else if (data.valid === 3) {
        setError("Email already registered. Please login instead!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else if (data.valid === 1) {
        setError(data.error || "Username already exists. Please choose a different one.");
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 pt-20"
      style={{ backgroundColor: "#D9EAFD" }}
    >
      <div
        className="max-w-md w-full shadow-2xl rounded-xl p-8 sm:p-10 border"
        style={{
          backgroundColor: "#112D4E",
          borderColor: "#112D4E",
        }}
      >
        <h2
          className="text-2xl sm:text-3xl font-bold text-center"
          style={{ color: "#D9EAFD" }}
        >
          Create Your Account
        </h2>

        <form className="mt-6" onSubmit={handleSubmit}>
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: "#DBE2EF" }}
          >
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-70 transition-all duration-200"
            style={{
              backgroundColor: "#DBE2EF",
              borderColor: "#3F72AF",
              color: "#112D4E",
              "--tw-ring-color": "#3F72AF",
            }}
            required
            disabled={isLoading}
            minLength={3}
            maxLength={20}
          />

          <label
            className="block mt-4 mb-2 text-sm font-medium"
            style={{ color: "#DBE2EF" }}
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="youremail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-70 transition-all duration-200"
            style={{
              backgroundColor: "#DBE2EF",
              borderColor: "#3F72AF",
              color: "#112D4E",
              "--tw-ring-color": "#3F72AF",
            }}
            required
            disabled={isLoading}
          />

          <label
            className="block mt-4 mb-2 text-sm font-medium"
            style={{ color: "#DBE2EF" }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-70 transition-all duration-200"
            style={{
              backgroundColor: "#DBE2EF",
              borderColor: "#3F72AF",
              color: "#112D4E",
              "--tw-ring-color": "#3F72AF",
            }}
            required
            disabled={isLoading}
            minLength={6}
          />

          <div className="flex items-center mt-4">
            <label
              className="flex items-center text-sm font-medium"
              style={{ color: "#DBE2EF" }}
            >
              <input
                type="checkbox"
                className="mr-2 rounded"
                style={{ accentColor: "#3F72AF" }}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              Remember me on this device
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-6 font-semibold py-3 rounded-md transition-all duration-200 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#3F72AF",
              color: "#D9EAFD",
              boxShadow: "0 4px 12px rgba(63, 114, 175, 0.2)",
            }}
            onMouseEnter={(e) =>
              !isLoading &&
              ((e.target.style.backgroundColor = "#6DA9E4"),
              (e.target.style.boxShadow =
                "0 6px 16px rgba(109, 169, 228, 0.3)"))
            }
            onMouseLeave={(e) =>
              !isLoading &&
              ((e.target.style.backgroundColor = "#3F72AF"),
              (e.target.style.boxShadow =
                "0 4px 12px rgba(63, 114, 175, 0.2)"))
            }
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>

          {error && (
            <div
              className="mt-4 p-3 rounded-md"
              style={{
                backgroundColor: "#DBE2EF",
                borderLeft: "4px solid #3F72AF",
              }}
            >
              <p className="text-sm" style={{ color: "#112D4E" }}>
                {error}
              </p>
            </div>
          )}

          {success && (
            <div
              className="mt-4 p-3 rounded-md"
              style={{
                backgroundColor: "#DBE2EF",
                borderLeft: "4px solid #3F72AF",
              }}
            >
              <p className="text-sm" style={{ color: "#112D4E" }}>
                {success}
              </p>
            </div>
          )}
        </form>

        <div
          className="text-center mt-6 text-sm"
          style={{ color: "#DBE2EF" }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium hover:underline transition-colors duration-200"
            style={{ color: "#3F72AF" }}
            onMouseEnter={(e) => (e.target.style.color = "#6DA9E4")}
            onMouseLeave={(e) => (e.target.style.color = "#3F72AF")}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}