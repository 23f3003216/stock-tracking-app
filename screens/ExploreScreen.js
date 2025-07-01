import React, { useState } from 'react';
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

const mockTopGainers = [
  { symbol: 'AAPL', price: '180.12', change: '1.5' },
  { symbol: 'MSFT', price: '315.24', change: '2.1' },
  { symbol: 'GOOGL', price: '132.80', change: '3.2' },
  { symbol: 'TSLA', price: '285.40', change: '2.5' },
];

const mockTopLosers = [
  { symbol: 'NFLX', price: '405.20', change: '-1.8' },
  { symbol: 'META', price: '312.00', change: '-2.3' },
  { symbol: 'AMZN', price: '135.12', change: '-0.9' },
  { symbol: 'NVDA', price: '455.90', change: '-3.0' },
];

const ExploreScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');

  const allStocks = [...mockTopGainers, ...mockTopLosers];

  const filteredStocks = allStocks.filter((stock) =>
    stock.symbol.toLowerCase().includes(query.toLowerCase())
  );

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductScreen', { symbol: item.symbol })}
    >
      <Text style={styles.symbol}>{item.symbol}</Text>
      <Text style={styles.price}>${item.price}</Text>
      <Text
        style={[
          styles.change,
          { color: parseFloat(item.change) >= 0 ? 'green' : 'red' },
        ]}
      >
        {item.change}%
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        placeholder="Search Stock Symbol (e.g., AAPL)"
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
      />

      {query.length > 0 ? (
        filteredStocks.length === 0 ? (
          <Text style={{ marginVertical: 16, color: 'red' }}>
            No stocks found for "{query}"
          </Text>
        ) : (
          <>
            <Text style={styles.header}>Search Results</Text>
            <FlatList
              data={filteredStocks}
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
            data={mockTopGainers}
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
            <Text style={styles.viewAllText}>View All Gainers</Text>
          </TouchableOpacity>

          <Text style={styles.header}>Top Losers</Text>
          <FlatList
            data={mockTopLosers}
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
            <Text style={styles.viewAllText}>View All Losers</Text>
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
  viewAllBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#00d09c',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 12,
  },
});

export default ExploreScreen;
