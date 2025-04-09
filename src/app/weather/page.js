"use client";

import { useEffect, useState } from "react";

const cities = [
  { name: "New York", id: "5128581" },
  { name: "London", id: "2643743" },
  { name: "Tokyo", id: "1850147" },
];

export default function Weather() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      const responses = await Promise.all(
        cities.map((city) =>
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?id=${city.id}&units=metric&appid=${apiKey}`
          ).then((res) => res.json())
        )
      );

      setWeatherData(responses);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  if (loading) {
    return <div className="p-6 text-2xl">Loading weather data...</div>;
  }

  if (error) {
    return <div className="p-6 text-2xl text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🌦️ Weather Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {weatherData.map((cityWeather, index) => {
          // Defensive checks for missing data
          const temp = cityWeather?.main?.temp;
          const humidity = cityWeather?.main?.humidity;
          const description = cityWeather?.weather?.[0]?.description;

          return (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-md  text-center flex flex-col items-center justify-center bg-gray-800 text-white"
            >
              <h2 className="text-xl font-semibold">{cities[index].name}</h2>
              {temp !== undefined ? (
                <p className="text-lg">🌡️ {temp}°C</p>
              ) : (
                <p className="text-lg text-red-500">Temperature unavailable</p>
              )}
              {humidity !== undefined ? (
                <p>💧 Humidity: {humidity}%</p>
              ) : (
                <p className="text-red-500">Humidity unavailable</p>
              )}
              {description ? (
                <p>🌥️ {description}</p>
              ) : (
                <p className="text-red-500">Description unavailable</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
