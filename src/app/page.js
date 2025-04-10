"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray to-gray-500">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Crypto-Weather Nexus
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your all-in-one dashboard for cryptocurrency prices, weather forecasts, and related news.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Link href="/crypto" className="block">
            <div className="card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow h-full">
              <div className="text-4xl mb-4">💰</div>
              <h2 className="text-2xl font-bold mb-2">Cryptocurrency</h2>
              <p className="text-gray-600">
                Track real-time prices, market caps, and 24-hour changes for your favorite cryptocurrencies.
              </p>
            </div>
          </Link>
          
          <Link href="/weather" className="block">
            <div className="card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow h-full">
              <div className="text-4xl mb-4">🌤️</div>
              <h2 className="text-2xl font-bold mb-2">Weather</h2>
              <p className="text-gray-600">
                Get current weather conditions, forecasts, and alerts for cities around the world.
              </p>
            </div>
          </Link>
          
          <Link href="/news" className="block">
            <div className="card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow h-full">
              <div className="text-4xl mb-4">📰</div>
              <h2 className="text-2xl font-bold mb-2">News</h2>
              <p className="text-gray-600">
                Stay updated with the latest news about cryptocurrency, weather, and finance.
              </p>
            </div>
          </Link>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-500">
            Built with Next.js, React, Redux, and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
