"use client";

import { useEffect, useState } from "react";

const cryptos = ["bitcoin", "ethereum", "dogecoin"]; // List of cryptocurrencies

export default function Crypto() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptos.join(
          ","
        )}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`
      );

      const data = await response.json();
      setCryptoData(data);
    } catch (err) {
      setError("Failed to fetch cryptocurrency data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, []);

  if (loading) {
    return <div className="p-6 text-2xl">Loading cryptocurrency data...</div>;
  }

  if (error) {
    return <div className="p-6 text-2xl text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">💰 Crypto Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cryptos.map((crypto) => {
          const data = cryptoData[crypto];
          const price = data?.usd;
          const marketCap = data?.usd_market_cap;
          const change = data?.usd_24h_change;

          return (
            <div
              key={crypto}
              className="p-4 border rounded-lg shadow-md text-center flex flex-col items-center justify-center bg-gray-800 text-white"
            >
              <h2 className="text-xl font-semibold capitalize">{crypto}</h2>
              {price !== undefined ? (
                <p className="text-lg">💵 Price: ${price.toFixed(2)}</p>
              ) : (
                <p className="text-lg text-red-500">Price unavailable</p>
              )}
              {marketCap !== undefined ? (
                <p>📊 Market Cap: ${marketCap.toLocaleString()}</p>
              ) : (
                <p className="text-red-500">Market Cap unavailable</p>
              )}
              {change !== undefined ? (
                <p
                  className={`${
                    change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {change >= 0 ? "📈" : "📉"} 24h Change: {change.toFixed(2)}%
                </p>
              ) : (
                <p className="text-red-500">24h Change unavailable</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}