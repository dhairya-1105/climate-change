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
    <div className="min-h-screen" style={{ backgroundColor: '#1A2420' }}>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#F5F5F5' }}>
            Beyond the Surface: The{' '}
            <span 
              style={{ 
                color: '#9BC53D',
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
                  backgroundColor: '#9BC53D',
                  transform: showUnderline ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.8s ease'
                }}
              />
            </span>{' '}
            cost
          </h1>
          <p className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed" style={{ color: '#D0D0D0' }}>
            Beyond the price tag lies the real environmental impact. Our platform analyzes any product's ecological footprint, 
            grades its sustainability, and suggests better alternatives available in your area. Make informed choices that matter 
            for our planet's future.
          </p>
        </div>

        {/* Tutorial Section 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#7FB069' }}>
              Step 1: Share Your Product
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#E8E8E8' }}>
              Simply describe the product you're interested in or upload an image of its specifications. 
              Our AI-powered system can analyze everything from electronics and clothing to household items 
              and furniture. The more details you provide, the more accurate our environmental assessment will be.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#9BC53D' }}></div>
                <span style={{ color: '#D0D0D0' }}>Type a detailed product description</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#9BC53D' }}></div>
                <span style={{ color: '#D0D0D0' }}>Upload product specification images</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#9BC53D' }}></div>
                <span style={{ color: '#D0D0D0' }}>Include brand, model, and materials if known</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div 
              className="rounded-2xl shadow-2xl overflow-hidden border-2 transform hover:scale-105 transition-transform duration-300"
              style={{ 
                backgroundColor: '#384D48',
                borderColor: '#4A5D57',
                aspectRatio: '4/3'
              }}
            >
              <div className="h-full flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 rounded-full mb-4 flex items-center justify-center" style={{ backgroundColor: '#7FB069' }}>
                  <svg className="w-10 h-10" style={{ color: '#1A2B24' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                    <path d="M10 14l-3-3 1.41-1.41L10 11.17l5.59-5.59L17 7l-7 7z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#F5F5F5' }}>
                  Product Analysis
                </h3>
                <p className="text-center text-sm" style={{ color: '#D0D0D0' }}>
                  Upload or describe your product for comprehensive environmental impact assessment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Section 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative md:order-1">
            <div 
              className="rounded-2xl shadow-2xl overflow-hidden border-2 transform hover:scale-105 transition-transform duration-300"
              style={{ 
                backgroundColor: '#384D48',
                borderColor: '#4A5D57',
                aspectRatio: '4/3'
              }}
            >
              <div className="h-full flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 rounded-full mb-4 flex items-center justify-center" style={{ backgroundColor: '#9BC53D' }}>
                  <svg className="w-10 h-10" style={{ color: '#1A2B24' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#F5F5F5' }}>
                  Smart Recommendations
                </h3>
                <p className="text-center text-sm" style={{ color: '#D0D0D0' }}>
                  Get personalized eco-friendly alternatives available locally in your area
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 md:order-2">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#7FB069' }}>
              Step 2: Get Your Environmental Report
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#E8E8E8' }}>
              Receive a comprehensive sustainability grade based on carbon footprint, recyclability, 
              manufacturing impact, and lifecycle analysis. We don't just tell you what's wrong – 
              we provide actionable alternatives that are available in your local market, 
              making sustainable choices accessible and practical.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border" style={{ backgroundColor: '#384D48', borderColor: '#4A5D57' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: '#9BC53D' }}>A-F</div>
                <div className="text-sm" style={{ color: '#D0D0D0' }}>Sustainability Grade</div>
              </div>
              <div className="p-4 rounded-lg border" style={{ backgroundColor: '#384D48', borderColor: '#4A5D57' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: '#9BC53D' }}>3+</div>
                <div className="text-sm" style={{ color: '#D0D0D0' }}>Better Alternatives</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: '#F5F5F5' }}>
            Ready to Make a Difference?
          </h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#D0D0D0' }}>
            Start your journey towards sustainable living. Every conscious choice contributes to a healthier planet.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            style={{ 
              backgroundColor: '#7FB069',
              color: '#1A2B24',
              boxShadow: '0 8px 25px rgba(127, 176, 105, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#9BC53D';
              e.target.style.boxShadow = '0 12px 35px rgba(155, 197, 61, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#7FB069';
              e.target.style.boxShadow = '0 8px 25px rgba(127, 176, 105, 0.3)';
            }}
          >
            Start Analyzing Products
          </button>
        </div>
        
      </div>
    </div>
  );
}