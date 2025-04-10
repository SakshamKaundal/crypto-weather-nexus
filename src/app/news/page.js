"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function News() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("cryptocurrency");
  const { favoriteCryptos } = useSelector((state) => state.preferences);

  const fetchNewsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // If we have favorite cryptos, use the first one as a search term
      let searchQuery = category;
      if (category === "cryptocurrency" && favoriteCryptos.length > 0) {
        searchQuery = favoriteCryptos[0];
      }

      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}&q=${searchQuery}&language=en`

      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === "error") {
        throw new Error(data.message || "API error");
      }
      
      setNewsData(data.results.slice(0, 6)); // Get the top 6 news articles
    } catch (err) {
      console.error("News fetch error:", err);
      setError(`Failed to fetch news: ${err.message}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsData();
  }, [category]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📰 News Dashboard</h1>
      
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange("cryptocurrency")}
          className={`px-4 py-2 rounded ${
            category === "cryptocurrency"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Cryptocurrency
        </button>
        <button
          onClick={() => handleCategoryChange("weather")}
          className={`px-4 py-2 rounded ${
            category === "weather"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Weather
        </button>
        <button
          onClick={() => handleCategoryChange("finance")}
          className={`px-4 py-2 rounded ${
            category === "finance"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Finance
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {newsData.length === 0 && !loading && !error && (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">No news articles found for this category.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsData.map((article, index) => (
          <div
            key={index}
            className="card p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow mb-4"
          >
            {article.image_url && (
              <div className="mb-4 overflow-hidden rounded-md h-48">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <h2 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h2>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {article.description || "No description available."}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {new Date(article.pubDate).toLocaleDateString()}
              </span>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Read more →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}