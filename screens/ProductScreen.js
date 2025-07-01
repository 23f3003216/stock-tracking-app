import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { fetchStockDataDetailed } from '../src/api/alphaVantage';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { WatchlistContext } from '../src/context/WatchlistContext';
import AddToWatchlistModal from '../src/components/AddToWatchlistModal';
const screenWidth = Dimensions.get('window').width;

const ProductScreen = ({ route }) => {
  const { symbol } = route.params;
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    watchlists,          // updated for named watchlists
    addToWatchlist,
    removeFromWatchlist,
  } = useContext(WatchlistContext);

  // Check if symbol is present in any watchlist
  const isInAnyWatchlist = Object.values(watchlists).some(list =>
    list.includes(symbol)
  );

  useEffect(() => {
    const load = async () => {
      const data = await fetchStockDataDetailed(symbol);
      setStockData(data);
      setLoading(false);
    };
    load();
  }, [symbol]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!stockData) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>Error loading stock data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{stockData.symbol}</Text>
      <Text style={styles.price}>Price: ${stockData.price}</Text>
      <Text
        style={[styles.change, { color: parseFloat(stockData.change) >= 0 ? 'green' : 'red' }]}
      >
        {stockData.change}%
      </Text>

      <LineChart
        data={{
          labels: stockData.dates.slice(0, 6),
          datasets: [{ data: stockData.values }],
        }}
        width={screenWidth - 30}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        bezier
        style={styles.chart}
      />

      <Button
        title={isInAnyWatchlist ? 'Remove from All Watchlists' : 'Add to Watchlist'}
        onPress={() => {
          if (isInAnyWatchlist) {
            // Remove from all watchlists
            Object.keys(watchlists).forEach(listName => {
              removeFromWatchlist(listName, symbol);
            });
          } else {
            setModalVisible(true); // open modal to add to selected/new watchlist
          }
        }}
      />

      <AddToWatchlistModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={(listName) => {
          addToWatchlist(listName, symbol);
        }}
        existingLists={watchlists}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    marginBottom: 4,
  },
  change: {
    fontSize: 18,
    marginBottom: 16,
  },
  chart: {
    marginVertical: 16,
    borderRadius: 8,
  },
});

export default ProductScreen;
