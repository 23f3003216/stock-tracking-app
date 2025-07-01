import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Button,
} from 'react-native';
import { fetchStockData } from '../src/api/alphaVantage';
import { useNavigation } from '@react-navigation/native';

const PAGE_SIZE = 10;

const mockSymbols = Array.from({ length: 50 }, (_, i) => `MOCK${i + 1}`); // 50 mock stock symbols

const ViewAllScreen = () => {
  const [stocks, setStocks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const loadStocks = async () => {
    setLoading(true);
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const currentSymbols = mockSymbols.slice(start, end);

    const stockData = await Promise.all(currentSymbols.map(fetchStockData));
    const valid = stockData.filter((item) => item !== null);

    setStocks((prev) => [...prev, ...valid]);
    setLoading(false);
  };

  useEffect(() => {
    loadStocks();
  }, [page]);

  const loadMore = () => setPage((prev) => prev + 1);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Top Gainers</Text>

      <FlatList
        data={stocks}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
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
        )}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator style={{ margin: 16 }} />
          ) : stocks.length < mockSymbols.length ? (
            <Button title="Load More" onPress={loadMore} />
          ) : (
            <Text style={{ textAlign: 'center', margin: 16 }}>End of List</Text>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
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
});

export default ViewAllScreen;
