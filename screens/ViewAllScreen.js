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
import { fetchTopGainers, fetchTopLosers } from '../src/api/alphaVantage';
import { useNavigation, useRoute } from '@react-navigation/native';

const PAGE_SIZE = 10;

const ViewAllScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const section = route.params?.section || 'gainers'; // default to gainers

  const [allStocks, setAllStocks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const paginatedData = allStocks.slice(0, page * PAGE_SIZE);

  const loadData = async () => {
    setLoading(true);
    const data =
      section === 'gainers' ? await fetchTopGainers() : await fetchTopLosers();
    setAllStocks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [section]);

  const loadMore = () => {
    if (page * PAGE_SIZE < allStocks.length) {
      setPage((prev) => prev + 1);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductScreen', { symbol: item.symbol })}
    >
      <Text style={styles.symbol}>{item.symbol}</Text>
      <Text style={styles.price}>${item.price}</Text>
      <Text
        style={[styles.change, { color: parseFloat(item.change) >= 0 ? 'green' : 'red' }]}
      >
        {item.change}%
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Top {section === 'gainers' ? 'Gainers' : 'Losers'}</Text>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={paginatedData}
          keyExtractor={(item) => item.symbol}
          renderItem={renderItem}
          ListFooterComponent={
            page * PAGE_SIZE < allStocks.length ? (
              <Button title="Load More" onPress={loadMore} />
            ) : (
              <Text style={{ textAlign: 'center', margin: 16 }}>End of List</Text>
            )
          }
        />
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
