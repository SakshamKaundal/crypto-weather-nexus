"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeatherData, initializeWebSocket, setError } from "@/redux/slices/weatherSlice";
import {
  addFavoriteCity,
  removeFavoriteCity,
} from "@/redux/slices/preferencesSlice";
import { FaHeart, FaThermometerHalf, FaWind, FaTint } from "react-icons/fa";

const Weather = () => {
  const dispatch = useDispatch();
  const { weatherData, loading, error, alerts } = useSelector((state) => state.weather);
  const { favoriteCities } = useSelector((state) => state.preferences);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    console.log("API Key available:", !!apiKey);
    
    if (!apiKey) {
      console.error("OpenWeather API key is not configured");
      dispatch(setError("OpenWeather API key is not configured. Please add it to your .env.local file."));
      return;
    }

    console.log("Fetching weather data...");
    dispatch(fetchWeatherData())
      .unwrap()
      .then(() => {
        console.log("Weather data fetched successfully");
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });

    const cleanup = dispatch(initializeWebSocket());
    
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [dispatch, isClient]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError("");
    
    if (!searchQuery.trim()) {
      setSearchError("Please enter a city name");
      return;
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      console.log("Search with API Key available:", !!apiKey);
      
      if (!apiKey) {
        throw new Error("OpenWeather API key is not configured");
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "City not found");
      }
      
      const data = await response.json();
      setSearchResults([data]);
      setSearchQuery("");
    } catch (error) {
      console.error("Error searching for city:", error);
      setSearchError(error.message || "Failed to search for city");
      setSearchResults([]);
    }
  };

  const toggleFavorite = (cityName) => {
    if (!cityName) return;
    
    console.log("Toggling favorite for:", cityName);
    if (favoriteCities.includes(cityName)) {
      dispatch(removeFavoriteCity(cityName));
    } else {
      dispatch(addFavoriteCity(cityName));
    }
  };

  const getWeatherIcon = (weatherCode) => {
    const iconUrl = `http://openweathermap.org/img/wn/${weatherCode}@2x.png`;
    return iconUrl;
  };

  const renderAlerts = () => {
    if (!alerts || alerts.length === 0) return null;

    return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-500 animate-slide-in ${
              alert.type === 'danger'
                ? 'bg-red-500 bg-opacity-90'
                : alert.type === 'warning'
                ? 'bg-yellow-500 bg-opacity-90'
                : 'bg-blue-500 bg-opacity-90'
            } text-white`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{alert.location}</p>
                <p>{alert.message}</p>
                <p className="text-sm opacity-75 mt-1">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWeatherCard = (city, index) => {
    if (!city || !city.main || !city.weather || !city.weather[0]) {
      return (
        <div className="bg-[#1F2937] rounded-lg p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white">{city?.name || "Unknown City"}</h3>
              <p className="text-gray-400">Weather data unavailable</p>
            </div>
            {city?.name && (
              <button
                onClick={() => toggleFavorite(city.name)}
                className="text-2xl hover:scale-110 transition-transform"
                aria-label={
                  favoriteCities.includes(city.name)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <FaHeart
                  className={
                    favoriteCities.includes(city.name)
                      ? "text-red-500"
                      : "text-gray-600 hover:text-gray-400"
                  }
                />
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#1F2937] rounded-lg p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-800">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{city.name}</h3>
              <button
                onClick={() => toggleFavorite(city.name)}
                className="text-2xl hover:scale-110 transition-transform"
                aria-label={
                  favoriteCities.includes(city.name)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <FaHeart
                  className={
                    favoriteCities.includes(city.name)
                      ? "text-red-500"
                      : "text-gray-600 hover:text-gray-400"
                  }
                />
              </button>
            </div>
            
            <div className="flex items-center mb-4">
              <img 
                src={getWeatherIcon(city.weather[0].icon)}
                alt={city.weather[0].description}
                className="w-16 h-16 mr-4"
              />
              <div>
                <p className="text-3xl font-bold text-white">
                  {Math.round(city.main.temp)}°C
                </p>
                <p className="text-gray-400 capitalize">
                  {city.weather[0].description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-gray-300">
              <div className="flex items-center">
                <FaThermometerHalf className="mr-2 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Feels like</p>
                  <p className="font-semibold">{Math.round(city.main.feels_like)}°C</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaTint className="mr-2 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Humidity</p>
                  <p className="font-semibold">{city.main.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaWind className="mr-2 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Wind</p>
                  <p className="font-semibold">{city.wind.speed} m/s</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading weather data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Weather Dashboard</h1>

        {renderAlerts()}

        {error && (
          <div className="bg-red-900 text-red-100 px-4 py-3 rounded mb-4">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city..."
              className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
          {searchError && (
            <p className="text-red-400 mt-2">{searchError}</p>
          )}
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((city, index) => (
                <div key={`search-${city.id || city.name || index}`}>
                  {renderWeatherCard(city, index)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weather Data */}
        {weatherData && weatherData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weatherData.map((city, index) => (
              <div key={`weather-${city.id || city.name || index}`}>
                {renderWeatherCard(city, index)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p>No weather data available. Try searching for a city.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
