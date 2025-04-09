"use client";

import { useEffect, useState } from "react";

export default function News() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=pub_79396bab8df15891bf6d9cd50be4d96f79c3a&q=cryptocurrency&language=en`
      );

      const data = await response.json();
      setNewsData(data.results.slice(0, 5)); // Get the top 5 news articles
    } catch (err) {
      setError("Failed to fetch news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsData();
  }, []);

  if (loading) {
    return <div className="p-6 text-2xl">Loading news...</div>;
  }

  if (error) {
    return <div className="p-6 text-2xl text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📰 Crypto News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {newsData.map((article, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-md bg-gray-800 text-white"
          >
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p className="text-sm mb-4">{article.description || "No description available."}</p>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}