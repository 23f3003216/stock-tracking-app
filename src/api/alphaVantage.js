// src/api/alphaVantage.js
import axios from 'axios';

const API_KEY = 'QFQ6VIQTSUH4OUGU';
const BASE_URL = 'https://www.alphavantage.co/query';

// Helper: delay to respect API limits
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

// 🔹 Gainers & Losers via Alpha Intelligence endpoint
export const fetchTopGainers = async () => {
  try {
    const res = await axios.get(`${BASE_URL}`, {
      params: {
        function: 'TOP_GAINERS_LOSERS',
        apikey: API_KEY,
      },
    });

    // Parse from response (Alpha Vantage has gainers and losers in same response)
    const gainers = res.data.top_gainers || [];

    return gainers.map((stock) => ({
      symbol: stock.ticker,
      price: parseFloat(stock.price).toFixed(2),
      change: parseFloat(stock.change_percentage.replace('%', '')).toFixed(2),
    }));
  } catch (err) {
    console.error('Error fetching gainers:', err.message);
    return [];
  }
};

export const fetchTopLosers = async () => {
  try {
    const res = await axios.get(`${BASE_URL}`, {
      params: {
        function: 'TOP_GAINERS_LOSERS',
        apikey: API_KEY,
      },
    });

    const losers = res.data.top_losers || [];

    return losers.map((stock) => ({
      symbol: stock.ticker,
      price: parseFloat(stock.price).toFixed(2),
      change: parseFloat(stock.change_percentage.replace('%', '')).toFixed(2),
    }));
  } catch (err) {
    console.error('Error fetching losers:', err.message);
    return [];
  }
};

// 🔎 Search for ticker by name or symbol
export const searchStockSymbol = async (query) => {
  try {
    const res = await axios.get(`${BASE_URL}`, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: query,
        apikey: API_KEY,
      },
    });

    const matches = res.data.bestMatches || [];

    return matches.map((match) => ({
      symbol: match['1. symbol'],
      price: '0.00', // To be fetched separately
      change: '0.00',
    }));
  } catch (err) {
    console.error('Search error:', err.message);
    return [];
  }
};

// 📊 Fetch single stock price + change
export const fetchStockData = async (symbol) => {
  try {
    const res = await axios.get(`${BASE_URL}`, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: API_KEY,
      },
    });

    const data = res.data['Global Quote'];

    if (!data || !data['05. price']) return null;

    return {
      symbol: symbol,
      price: parseFloat(data['05. price']).toFixed(2),
      change: parseFloat(data['10. change percent'].replace('%', '')).toFixed(2),
    };
  } catch (err) {
    console.error(`Error fetching stock data for ${symbol}:`, err.message);
    return null;
  }
};

// 📈 Fetch time-series for a stock (e.g., for graph)
export const fetchStockDataDetailed = async (symbol) => {
  try {
    const res = await axios.get(`${BASE_URL}`, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        apikey: API_KEY,
      },
    });

    const series = res.data['Time Series (Daily)'];
    if (!series) return null;

    const dates = Object.keys(series).slice(0, 30).reverse(); // last 30 days
    const values = dates.map((date) => parseFloat(series[date]['4. close']));

    return {
      symbol,
      price: values[values.length - 1].toFixed(2),
      change: ((values[values.length - 1] - values[0]) / values[0] * 100).toFixed(2),
      dates,
      values,
    };
  } catch (err) {
    console.error(`Error fetching detailed data for ${symbol}:`, err.message);
    return null;
  }
};
