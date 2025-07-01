// MOCKED API FOR TESTING NAVIGATION / UI WITHOUT NETWORK

export const fetchStockData = async (symbol) => {
  // Simulate network delay (optional)
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    symbol,
    price: "150.00", // mock price
    change: "1.25",  // mock percent change
  };
};

export const fetchStockDataDetailed = async (symbol) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const values = Array.from({ length: 30 }, (_, i) => 140 + i); // example linearly increasing prices
  const dates = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

  return {
    symbol,
    price: "150.00",
    change: "1.25",
    dates,
    values,
  };
};
