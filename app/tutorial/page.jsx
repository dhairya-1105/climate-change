"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TutorialPage() {
  const router = useRouter();
  const [showUnderline, setShowUnderline] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUnderline(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#D9EAFD' }}>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#112D4E' }}>
            Beyond the Surface: The{' '}
            <span 
              style={{ 
                color: '#3F72AF',
                cursor: 'pointer',
                position: 'relative',
                display: 'inline-block'
              }}
            >
              real
              <span
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '0',
                  width: '100%',
                  height: '3px',
                  backgroundColor: '#3F72AF',
                  transform: showUnderline ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.8s ease'
                }}
              />
            </span>{' '}
            cost
          </h1>
          <p className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed" style={{ color: '#112D4E' }}>
            Beyond the price tag lies the real environmental impact. Our platform analyzes any product's ecological footprint, 
            grades its sustainability, and suggests better alternatives available in your area. Make informed choices that matter 
            for our planet's future.
          </p>
        </div>

        {/* Tutorial Section 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#3F72AF' }}>
              Step 1: Share Your Product
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#112D4E' }}>
              Simply describe the product you're interested in or upload an image of its specifications. 
              Our AI-powered system can analyze everything from electronics and clothing to household items 
              and furniture. The more details you provide, the more accurate our environmental assessment will be.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6DA9E4' }}></div>
                <span style={{ color: '#112D4E' }}>Type a detailed product description</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6DA9E4' }}></div>
                <span style={{ color: '#112D4E' }}>Upload product specification images</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6DA9E4' }}></div>
                <span style={{ color: '#112D4E' }}>Include brand, model, and materials if known</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div 
              className="rounded-2xl shadow-2xl overflow-hidden border-2 transform hover:scale-105 transition-transform duration-300"
              style={{ 
                backgroundColor: '#3F72AF',
                borderColor: '#6DA9E4',
                aspectRatio: '4/3'
              }}
            >
              <div className="h-full flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 rounded-full mb-4 flex items-center justify-center" style={{ backgroundColor: '#6DA9E4' }}>
                  <svg className="w-10 h-10" style={{ color: '#112D4E' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                    <path d="M10 14l-3-3 1.41-1.41L10 11.17l5.59-5.59L17 7l-7 7z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#112D4E' }}>
                  Product Analysis
                </h3>
                <p className="text-center text-sm" style={{ color: '#112D4E' }}>
                  Upload or describe your product for comprehensive environmental impact assessment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Section 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative md:order-1">
            <div 
              className="rounded-2xl shadow-2xl overflow-hidden border-2 transform hover:scale-105 transition-transform duration-300"
              style={{ 
                backgroundColor: '#3F72AF',
                borderColor: '#6DA9E4',
                aspectRatio: '4/3'
              }}
            >
              <div className="h-full flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 rounded-full mb-4 flex items-center justify-center" style={{ backgroundColor: '#6DA9E4' }}>
                  <svg className="w-10 h-10" style={{ color: '#112D4E' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#112D4E' }}>
                  Smart Recommendations
                </h3>
                <p className="text-center text-sm" style={{ color: '#112D4E' }}>
                  Get personalized eco-friendly alternatives available locally in your area
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 md:order-2">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#3F72AF' }}>
              Step 2: Get Your Environmental Report
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#112D4E' }}>
              Receive a comprehensive sustainability score from 0-100 based on carbon footprint, recyclability, 
              manufacturing impact, and lifecycle analysis. We don't just tell you what's wrong – 
              we provide actionable alternatives that are available in your local market, 
              making sustainable choices accessible and practical.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border" style={{ backgroundColor: '#3F72AF', borderColor: '#6DA9E4' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: '#D9EAFD' }}>0-100</div>
                <div className="text-sm" style={{ color: '#D9EAFD' }}>Sustainability Score</div>
              </div>
              <div className="p-4 rounded-lg border" style={{ backgroundColor: '#3F72AF', borderColor: '#6DA9E4' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: '#D9EAFD' }}>3+</div>
                <div className="text-sm" style={{ color: '#D9EAFD' }}>Better Alternatives</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#3F72AF' }}>
              Step 3: Track Your Progress
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#112D4E' }}>
              All your past product analyses are saved and displayed on your personal dashboard. 
              Keep track of your sustainability journey, revisit previous recommendations, and monitor 
              your environmental impact over time. Don't lose track of your eco-friendly discoveries – 
              create an account to access your personalized dashboard!
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6DA9E4' }}></div>
                <span style={{ color: '#112D4E' }}>View all your past product analyses</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6DA9E4' }}></div>
                <span style={{ color: '#112D4E' }}>Track your sustainability improvements</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6DA9E4' }}></div>
                <span style={{ color: '#112D4E' }}>Access saved alternative recommendations</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div 
              className="rounded-2xl shadow-2xl overflow-hidden border-2 transform hover:scale-105 transition-transform duration-300"
              style={{ 
                backgroundColor: '#112D4E',
                borderColor: '#3F72AF',
                aspectRatio: '4/3'
              }}
            >
              {/* Mock Dashboard Image */}
              <div className="h-full p-6 flex flex-col">
                {/* Dashboard Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: '#D9EAFD' }}>Your Dashboard</h3>
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#6DA9E4' }}></div>
                </div>
                
                {/* Mock Analysis Cards */}
                <div className="space-y-3 flex-1">
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: '#3F72AF', borderColor: '#6DA9E4' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium" style={{ color: '#D9EAFD' }}>iPhone 15 Pro</span>
                      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#6DA9E4', color: '#112D4E' }}>Score: 65</span>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: '#3F72AF', borderColor: '#6DA9E4' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium" style={{ color: '#D9EAFD' }}>Nike Air Max</span>
                      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#6DA9E4', color: '#112D4E' }}>Score: 42</span>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: '#3F72AF', borderColor: '#6DA9E4' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium" style={{ color: '#D9EAFD' }}>Dell Laptop</span>
                      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#6DA9E4', color: '#112D4E' }}>Score: 78</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <span className="text-xs" style={{ color: '#DBE2EF' }}>Login to save your analyses</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* General Talk Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative md:order-1">
            <div 
              className="rounded-2xl shadow-2xl overflow-hidden border-2 transform hover:scale-105 transition-transform duration-300"
              style={{ 
                backgroundColor: '#3F72AF',
                borderColor: '#6DA9E4',
                aspectRatio: '4/3'
              }}
            >
              <div className="h-full flex flex-col p-6">
                {/* Chat Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: '#D9EAFD' }}>General Talk</h3>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#6DA9E4', color: '#112D4E' }}>
                      Ctrl + Q
                    </div>
                  </div>
                </div>
                
                {/* Mock Chat Messages */}
                <div className="space-y-3 flex-1">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#112D4E' }}>
                    <p className="text-sm" style={{ color: '#D9EAFD' }}>
                      What are the main causes of climate change?
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg ml-4" style={{ backgroundColor: '#6DA9E4' }}>
                    <p className="text-sm" style={{ color: '#112D4E' }}>
                      Climate change is primarily caused by greenhouse gas emissions from human activities...
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#112D4E' }}>
                    <p className="text-sm" style={{ color: '#D9EAFD' }}>
                      How can individuals make a difference?
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-2 rounded-lg border-2 border-dashed" style={{ borderColor: '#6DA9E4' }}>
                  <p className="text-xs text-center" style={{ color: '#D9EAFD' }}>
                    Ask me anything about climate change!
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 md:order-2">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#3F72AF' }}>
              Bonus: General Climate Chat
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#112D4E' }}>
              Have questions about climate change, sustainability practices, or environmental topics? 
              Use our General Talk feature on the homepage by pressing Ctrl + Q. Get instant answers to your 
              climate-related questions, learn about sustainable practices, and expand your environmental knowledge. 
              It's like having an expert climate advisor available 24/7!
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6DA9E4' }}></div>
                <span style={{ color: '#112D4E' }}>Press Ctrl + Q on homepage to open chat</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6DA9E4' }}></div>
                <span style={{ color: '#112D4E' }}>Ask any climate or sustainability question</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6DA9E4' }}></div>
                <span style={{ color: '#112D4E' }}>Get expert-level environmental insights</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: '#112D4E' }}>
            Ready to Make a Difference?
          </h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#112D4E' }}>
            Start your journey towards sustainable living. Every conscious choice contributes to a healthier planet.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            style={{ 
              backgroundColor: '#3F72AF',
              color: '#D9EAFD',
              boxShadow: '0 8px 25px rgba(63, 114, 175, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#6DA9E4';
              e.target.style.boxShadow = '0 12px 35px rgba(109, 169, 228, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3F72AF';
              e.target.style.boxShadow = '0 8px 25px rgba(63, 114, 175, 0.3)';
            }}
          >
            Start Analyzing Products
          </button>
        </div>
        
      </div>
    </div>
  );
}