"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/card';

export default function DashboardPage() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // THEME COLORS (consistent with main app theme)
  const mainBg = "#D9EAFD";
  const cardBg = "#3F72AF";
  const cardAlt = "#3F72AF";
  const inputBg = "#DBE2EF";
  const textMain = "#112D4E";
  const textSub = "#6DA9E4";
  const accentGreen = "#9BC53D";
  const accentGreenDarker = "#7FB069";

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Check authentication status
      const authResponse = await fetch('/api/auth', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!authResponse.ok) {
        // User not authenticated, redirect to login
        router.push('/login');
        return;
      }

      const authData = await authResponse.json();

      if (!authData.isLoggedIn) {
        // User not authenticated, redirect to login
        router.push('/login');
        return;
      }

      setUsername(authData.user.name || authData.user.email);
      setIsAuthenticated(true);

      // Fetch user's cards using their email
      const userEmail = authData.user.email;
      const cardsResponse = await fetch(`/api/cards?email=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (cardsResponse.ok) {
        const cardsData = await cardsResponse.json();
        setCards(Array.isArray(cardsData) ? cardsData : []);
      } else {
        console.error('Failed to fetch cards');
        setCards([]);
      }
    } catch (error) {
      console.error('Error checking auth or loading data:', error);
      // On error, redirect to login
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    router.push("/home");
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      router.push('/login');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20" style={{ backgroundColor: mainBg }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-64 rounded mb-4" style={{ backgroundColor: cardBg }}></div>
            <div className="h-4 w-48 rounded mb-8" style={{ backgroundColor: cardBg }}></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-6 p-6 rounded-xl" style={{ backgroundColor: cardBg }}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-16 h-16 rounded-full" style={{ backgroundColor: cardAlt }}></div>
                  <div>
                    <div className="h-4 w-24 rounded mb-2" style={{ backgroundColor: cardAlt }}></div>
                    <div className="h-3 w-32 rounded" style={{ backgroundColor: cardAlt }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded" style={{ backgroundColor: cardAlt }}></div>
                  <div className="h-4 w-3/4 rounded" style={{ backgroundColor: cardAlt }}></div>
                  <div className="h-4 w-1/2 rounded" style={{ backgroundColor: cardAlt }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Only render dashboard if authenticated
  if (!isAuthenticated) {
    return null; // This shouldn't show as user would be redirected
  }

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: mainBg }}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header with Logout */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: textMain }}>
                Your Analysis Dashboard
              </h1>
              <p className="text-lg" style={{ color: textSub }}>
                Welcome back, {username}! Here are all your sustainability analyses.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300 border self-start sm:self-auto mt-4 sm:mt-0"
              style={{
                color: textMain,
                borderColor: cardBg,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = cardBg;
                e.target.style.color = "#fff";
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = textMain;
              }}
            >
              Logout
            </button>
          </div>

          {/* Stats and New Analysis Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: accentGreen }}>
                  {cards.length}
                </div>
                <div className="text-sm" style={{ color: textSub }}>
                  Total Analyses
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: accentGreenDarker }}>
                  {cards.length > 0 ? Math.round(cards.reduce((sum, card) => sum + card.rating, 0) / cards.length) : 0}
                </div>
                <div className="text-sm" style={{ color: textSub }}>
                  Avg. Score
                </div>
              </div>
            </div>

            <button
              onClick={handleNewAnalysis}
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              style={{
                backgroundColor: accentGreen,
                color: "#fff",
                boxShadow: '0 4px 15px rgba(155,197,61,0.13)'
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = accentGreenDarker;
                e.target.style.boxShadow = '0 6px 20px rgba(127,176,105,0.18)';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = accentGreen;
                e.target.style.boxShadow = '0 4px 15px rgba(155,197,61,0.13)';
              }}
            >
              + New Analysis
            </button>
          </div>
        </div>

        {/* Cards List */}
        {cards.length > 0 ? (
          <div className="space-y-6">
            {cards.map((card) => (
              <div key={card._id} style={{
                background: cardBg,
                borderRadius: "18px",
                boxShadow: "0 2px 10px 0 #3F72AF33",
                padding: "1.5rem 1.5rem 1rem 1.5rem"
              }}>
                <Card card={card} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: cardBg }}>
              <svg className="w-12 h-12" style={{ color: accentGreen }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: textMain }}>
              No Analyses Yet
            </h3>
            <p className="mb-6 max-w-md mx-auto" style={{ color: textSub }}>
              Start your sustainability journey by analyzing your first product.
              Get insights into environmental impact and discover better alternatives.
            </p>
            <button
              onClick={handleNewAnalysis}
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: accentGreen,
                color: "#fff"
              }}
              onMouseEnter={e => e.target.style.backgroundColor = accentGreenDarker}
              onMouseLeave={e => e.target.style.backgroundColor = accentGreen}
            >
              Analyze Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}