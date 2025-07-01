import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WatchlistContext } from '../src/context/WatchlistContext';

const WatchlistScreen = () => {
  const navigation = useNavigation();
  const { watchlists } = useContext(WatchlistContext);

  const watchlistNames = Object.keys(watchlists);

  if (watchlistNames.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Your watchlist is empty.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {watchlistNames.map((listName) => (
        <View key={listName} style={styles.section}>
          <Text style={styles.header}>{listName}</Text>
          {watchlists[listName].map((symbol) => (
            <TouchableOpacity
              key={symbol}
              style={styles.card}
              onPress={() => navigation.navigate('ProductScreen', { symbol })}
            >
              <Text style={styles.symbol}>{symbol}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  section: {
    marginBottom: 24,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1c1c1e',
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  symbol: {
    fontSize: 18,
    color: '#1c1c1e',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  emptyText: {
    fontSize: 18,
    color: '#999999',
  },
});

export default WatchlistScreen;
