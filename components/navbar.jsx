"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // Add this to detect route changes

  // Check authentication status on component mount, route changes, and when localStorage changes
  useEffect(() => {
    checkAuthStatus();
  }, [pathname]); // Add pathname as dependency

  useEffect(() => {
    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    // Listen for focus events (when user comes back to tab)
    const handleFocus = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      // First check if user data exists in localStorage
      const userEmail = localStorage.getItem("userEmail");
      const storedUsername = localStorage.getItem("Username");
      
      if (userEmail && storedUsername) {
        // Then verify with server that the JWT is still valid
        const response = await fetch("/api/auth", {
          method: "GET",
          credentials: "include", // Include cookies
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.isLoggedIn) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
          } else {
            // Token is invalid, clear localStorage
            localStorage.removeItem("userEmail");
            localStorage.removeItem("Username");
            setIsLoggedIn(false);
            setUsername("");
          }
        } else {
          // Server error, but keep user logged in based on localStorage
          setIsLoggedIn(true);
          setUsername(storedUsername);
        }
      } else {
        // No user data in localStorage
        setIsLoggedIn(false);
        setUsername("");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      // On network error, fall back to localStorage data
      const userEmail = localStorage.getItem("userEmail");
      const storedUsername = localStorage.getItem("Username");
      
      if (userEmail && storedUsername) {
        setIsLoggedIn(true);
        setUsername(storedUsername);
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Always clear localStorage first
      localStorage.removeItem("userEmail");
      localStorage.removeItem("Username");
      
      // Update state immediately
      setIsLoggedIn(false);
      setUsername("");
      
      // Try to call logout API
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Logout API failed, but user is logged out locally");
      }
      
      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if API fails, user is logged out locally
    }
  };

  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 w-full z-50 py-3 px-6 border-b" style={{ 
        backgroundColor: '#384D48',
        borderColor: '#4A5D57'
      }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="h-6 w-16 rounded animate-pulse" style={{ backgroundColor: '#4A5D57' }}></div>
          <div className="h-6 w-20 rounded animate-pulse" style={{ backgroundColor: '#4A5D57' }}></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 py-3 px-6 border-b shadow-lg" style={{ 
      backgroundColor: '#384D48',
      borderColor: '#4A5D57'
    }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Brand Name */}
        <Link 
          href="/" 
          className="text-xl font-bold transition-colors duration-200 hover:no-underline"
          style={{ color: '#F5F5F5' }}
          onMouseEnter={(e) => e.target.style.color = '#9BC53D'}
          onMouseLeave={(e) => e.target.style.color = '#F5F5F5'}
        >
          NAME
        </Link>

        {/* Right Side Navigation */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              {/* Welcome Message */}
              <span className="text-base font-medium hidden sm:inline" style={{ color: '#D0D0D0' }}>
                Welcome, {username}
              </span>
              
              {/* Dashboard Link */}
              <Link 
                href="/dashboard" 
                className="px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:no-underline text-sm"
                style={{ 
                  color: '#F5F5F5',
                  backgroundColor: '#4A5D57'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#7FB069';
                  e.target.style.color = '#1A2B24';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#4A5D57';
                  e.target.style.color = '#F5F5F5';
                }}
              >
                Dashboard
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:scale-105 text-sm"
                style={{ 
                  backgroundColor: '#7FB069',
                  color: '#1A2B24',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#9BC53D';
                  e.target.style.boxShadow = '0 4px 12px rgba(155, 197, 61, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#7FB069';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Logout
              </button>
            </>
          ) : (
            /* Login Link */
            <Link 
              href="/login" 
              className="px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:no-underline hover:scale-105 text-sm"
              style={{ 
                backgroundColor: '#7FB069',
                color: '#1A2B24'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#9BC53D';
                e.target.style.boxShadow = '0 4px 12px rgba(155, 197, 61, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#7FB069';
                e.target.style.boxShadow = 'none';
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}