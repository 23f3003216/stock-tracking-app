import React, { createContext, useState } from 'react';

export const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlists, setWatchlists] = useState({});

  const addToWatchlist = (listName, symbol) => {
    setWatchlists((prev) => {
      const updatedList = new Set([...(prev[listName] || []), symbol]);
      return { ...prev, [listName]: Array.from(updatedList) };
    });
  };

  const removeFromWatchlist = (listName, symbol) => {
    setWatchlists((prev) => {
      const filteredList = (prev[listName] || []).filter((s) => s !== symbol);
      const updated = { ...prev, [listName]: filteredList };
      if (updated[listName].length === 0) delete updated[listName];
      return updated;
    });
  };

  return (
    <WatchlistContext.Provider value={{ watchlists, addToWatchlist, removeFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
