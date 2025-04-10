"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCryptoData } from "@/redux/slices/cryptoSlice";
import CryptoGraph from '../components/CryptoGraph';

// Default cryptocurrencies to display
const defaultCryptos = ["bitcoin", "ethereum", "dogecoin", "ripple", "cardano"];

export default function Crypto() {
  const dispatch = useDispatch();
  const { data: cryptoData, loading, error } = useSelector((state) => state.crypto);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [displayCryptos, setDisplayCryptos] = useState(defaultCryptos);

  useEffect(() => {
    dispatch(fetchCryptoData(displayCryptos));
    const interval = setInterval(() => {
      dispatch(fetchCryptoData(displayCryptos));
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [dispatch, displayCryptos]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const newCryptos = [...displayCryptos, searchQuery.toLowerCase()];
      setDisplayCryptos(newCryptos);
      dispatch(fetchCryptoData(newCryptos));
      setSearchQuery('');
    }
  };

  const handleCryptoClick = (cryptoId) => {
    setSelectedCrypto(cryptoId);
  };

  const removeCrypto = (cryptoId, e) => {
    e.stopPropagation();
    const newCryptos = displayCryptos.filter(id => id !== cryptoId);
    setDisplayCryptos(newCryptos);
    dispatch(fetchCryptoData(newCryptos));
  };

  const filteredCryptos = displayCryptos.filter(cryptoId =>
    cryptoId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !Object.keys(cryptoData).length) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Cryptocurrency Tracker</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or symbol..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCryptos.map((cryptoId) => {
            const crypto = cryptoData[cryptoId];
            if (!crypto) return null;

            return (
              <div
                key={cryptoId}
                className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all ${
                  selectedCrypto === cryptoId ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleCryptoClick(cryptoId)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold capitalize">{cryptoId}</h2>
                  </div>
                  <button
                    onClick={(e) => removeCrypto(cryptoId, e)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold">${crypto.usd.toLocaleString()}</p>
                  <p className={`text-sm ${crypto.usd_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {crypto.usd_24h_change >= 0 ? '↑' : '↓'} {Math.abs(crypto.usd_24h_change).toFixed(2)}%
                  </p>
                </div>

                {selectedCrypto === cryptoId && (
                  <div className="mt-4">
                    <CryptoGraph symbol={cryptoId} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-gray-400">Market Cap</p>
                    <p className="font-medium">${(crypto.usd_market_cap / 1e9).toFixed(2)}B</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}