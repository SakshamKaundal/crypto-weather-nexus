'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        color: '#2D3748'
      },
      ticks: {
        color: '#A0AEC0',
        maxTicksLimit: 6
      }
    },
    y: {
      grid: {
        color: '#2D3748'
      },
      ticks: {
        color: '#A0AEC0',
        callback: function(value) {
          return '$' + value.toLocaleString();
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  elements: {
    line: {
      tension: 0.4
    },
    point: {
      radius: 0
    }
  }
};

const CryptoGraph = ({ symbol }) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=7&interval=hourly`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch price data');
        }

        const data = await response.json();
        
        // Process the price data
        const prices = data.prices.map(([timestamp, price]) => ({
          time: new Date(timestamp).toLocaleString(),
          price: price
        }));

        setPriceData({
          labels: prices.map(p => new Date(p.time).toLocaleDateString()),
          datasets: [
            {
              data: prices.map(p => p.price),
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              borderWidth: 2
            }
          ]
        });
      } catch (err) {
        console.error('Error fetching price history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchPriceHistory();
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="h-[200px] bg-[#1F2937] rounded-lg p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[200px] bg-[#1F2937] rounded-lg p-4 flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  if (!priceData) {
    return (
      <div className="h-[200px] bg-[#1F2937] rounded-lg p-4 flex items-center justify-center text-gray-400">
        No price data available
      </div>
    );
  }

  return (
    <div className="h-[200px] bg-[#1F2937] rounded-lg p-4">
      <Line options={options} data={priceData} />
    </div>
  );
};

export default CryptoGraph; 