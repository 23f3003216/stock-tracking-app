import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  fetchTopGainers,
  fetchTopLosers,
  searchStockSymbol,
  fetchStockData,
} from '../src/api/alphaVantage';

const ExploreScreen = () => {
  const navigation = useNavigation();
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const g = await fetchTopGainers();
      const l = await fetchTopLosers();
      setGainers(g);
      setLosers(l);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      const results = await searchStockSymbol(searchQuery);

      // Fetch price and change for each symbol
      const enriched = await Promise.all(
        results.map(async (item) => {
          const full = await fetchStockData(item.symbol);
          return full || item;
        })
      );

      setSearchResults(enriched);
      setLoading(false);
    };

    const delay = setTimeout(fetchSearch, 500);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductScreen', { symbol: item.symbol })}
    >
      <Text style={styles.symbol}>{item.symbol}</Text>
      <Text style={styles.price}>${item.price}</Text>
      <Text style={[styles.change, { color: parseFloat(item.change) >= 0 ? 'green' : 'red' }]}>
        {item.change}%
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search Stock Symbol (e.g., AAPL)"
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : searchQuery.length > 0 ? (
        searchResults.length === 0 ? (
          <Text style={{ marginVertical: 16, color: 'red' }}>
            No stocks found for "{searchQuery}"
          </Text>
        ) : (
          <>
            <Text style={styles.header}>Search Results</Text>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.symbol}
              renderItem={renderCard}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.listContent}
            />
          </>
        )
      ) : (
        <>
          <Text style={styles.header}>Top Gainers</Text>
          <FlatList
            data={gainers}
            keyExtractor={(item) => item.symbol}
            renderItem={renderCard}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
          />
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => navigation.navigate('ViewAll', { section: 'gainers' })}
          >
            <Text style={styles.viewAllText}>View All Gainers →</Text>
          </TouchableOpacity>

          <Text style={styles.header}>Top Losers</Text>
          <FlatList
            data={losers}
            keyExtractor={(item) => item.symbol}
            renderItem={renderCard}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
          />
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => navigation.navigate('ViewAll', { section: 'losers' })}
          >
            <Text style={styles.viewAllText}>View All Losers →</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    elevation: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '48%',
    elevation: 2,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
  },
  change: {
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 12,
  },
  viewAllBtn: {
    alignSelf: 'flex-end',
    marginTop: -6,
    marginBottom: 18,
  },
  viewAllText: {
    color: '#00b894',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ExploreScreen;
