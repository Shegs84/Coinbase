// azima_market_page.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const cryptoData = [
  { rank: 1, name: 'Bitcoin', ticker: 'BTC', image: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400' },
  { rank: 2, name: 'Ethereum', ticker: 'ETH', image: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628' },
  { rank: 3, name: 'Tether', ticker: 'USDT', image: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661' },
  { rank: 4, name: 'XRP', ticker: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/standard/xrp-symbol-white-128.png?1696501442' },
  { rank: 5, name: 'BNB', ticker: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970' },
  { rank: 6, name: 'Solana', ticker: 'SOL', image: 'https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756' },
  { rank: 7, name: 'USDC', ticker: 'USDC', image: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694' },
  { rank: 8, name: 'Tron', ticker: 'TRX', image: 'https://assets.coingecko.com/coins/images/1094/standard/tron-logo.png?1696502193' },
  { rank: 9, name: 'Dogecoin', ticker: 'DOGE', image: 'https://assets.coingecko.com/coins/images/5/standard/dogecoin.png?1696501409' },
  { rank: 10, name: 'Cardano', ticker: 'ADA', image: 'https://assets.coingecko.com/coins/images/975/standard/cardano.png?1696502090' },
];

export default function MarketPage() {
  const [timeFrame, setTimeFrame] = useState('7D');
  const [sortOrder, setSortOrder] = useState('Top');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Market</Text>

          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlText}>USD</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlText}>% {timeFrame} ▼</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlText}>{sortOrder} ▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* List */}
        <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 30 }}>
          {cryptoData.map((crypto, index) => (
            <View key={crypto.rank} style={styles.rowWrap}>
              <View style={styles.row}>
                <Text style={styles.rank}>{crypto.rank}</Text>

                <View style={styles.coinInfo}>
                  <Image
                    source={{ uri: crypto.image }}
                    style={styles.coinImage}
                    resizeMode="contain"
                    // onError can be used to handle failures (e.g. show placeholder)
                  />

                  <View>
                    <Text style={styles.coinName}>{crypto.name}</Text>
                    <Text style={styles.coinTicker}>{crypto.ticker}</Text>
                  </View>
                </View>

                <View style={styles.priceBlock}>
                  <Text style={styles.price}>$0.00</Text>
                  <Text style={styles.change}>0%</Text>
                </View>
              </View>

              {index < cryptoData.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#121212' },
  container: {
    width: Math.min(393, width),
    alignSelf: 'center',
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    backgroundColor: 'transparent',
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#00B300',
    textAlign: 'center',
    marginBottom: 15,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#3A3A3A',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  controlText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  rowWrap: {
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 10,
  },
  rank: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    width: 30,
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  coinImage: {
    width: 40,
    height: 40,
  },
  coinName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  coinTicker: {
    color: '#888888',
    fontSize: 13,
    marginTop: 2,
  },
  priceBlock: {
    alignItems: 'flex-end',
    width: 80,
  },
  price: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  change: {
    color: '#888888',
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#2B2B2B',
    marginHorizontal: 15,
  },
});
