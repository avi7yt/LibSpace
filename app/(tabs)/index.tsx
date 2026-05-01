import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../supabase';

type Seat = {
  seat_id: number | string;
  zone: string | null;
  is_buffer: boolean | null;
  status: 'free' | 'occupied' | string | null;
};

const ZONES = {
  quiet: 'Quiet Zone',
  group: 'Group Zone',
} as const;

const normalizeZone = (zone: string | null) => {
  const value = (zone ?? '').toLowerCase().trim();
  if (value.includes('quiet')) return 'quiet';
  if (value.includes('group')) return 'group';
  return value;
};

export default function HomeScreen() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [activeZone, setActiveZone] = useState<'quiet' | 'group'>('quiet');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadSeats = useCallback(async () => {
    setErrorMessage('');

    const { data, error } = await supabase
      .from('seats')
      .select('seat_id, zone, is_buffer, status')
      .order('seat_id', { ascending: true });

    if (error) {
      setErrorMessage('Could not load seats right now.');
      return;
    }

    setSeats(data ?? []);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await loadSeats();
      setLoading(false);
    };

    initialize();

    const channel = supabase.channel('seats-live-count');

    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'seats' },
      () => {
        loadSeats();
      }
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadSeats]);

  const freeSeats = seats.filter((seat) => seat.status === 'free').length;
  const occupiedSeats = seats.filter((seat) => seat.status === 'occupied').length;
  const visibleSeats = seats.filter((seat) => normalizeZone(seat.zone) === activeZone);

  const getSeatColor = (seat: Seat) => {
    if (seat.is_buffer) return '#F4A261';
    if (seat.status === 'occupied') return '#D9534F';
    return '#2A9D8F';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.appName}>LibSpace</Text>
        <Text style={styles.subtitle}>Live seat availability</Text>

        <View style={styles.statsRow}>
          <View style={[styles.badge, styles.freeBadge]}>
            <Text style={styles.badgeLabel}>Free</Text>
            <Text style={styles.badgeValue}>{loading ? '...' : freeSeats}</Text>
          </View>
          <View style={[styles.badge, styles.occupiedBadge]}>
            <Text style={styles.badgeLabel}>Occupied</Text>
            <Text style={styles.badgeValue}>{loading ? '...' : occupiedSeats}</Text>
          </View>
        </View>

        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, activeZone === 'quiet' && styles.tabActive]}
            onPress={() => setActiveZone('quiet')}>
            <Text style={[styles.tabText, activeZone === 'quiet' && styles.tabTextActive]}>
              {ZONES.quiet}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeZone === 'group' && styles.tabActive]}
            onPress={() => setActiveZone('group')}>
            <Text style={[styles.tabText, activeZone === 'group' && styles.tabTextActive]}>
              {ZONES.group}
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#00A896" style={styles.loader} />
        ) : (
          <FlatList
            data={visibleSeats}
            keyExtractor={(item) => String(item.seat_id)}
            numColumns={5}
            columnWrapperStyle={styles.seatRow}
            contentContainerStyle={styles.gridContainer}
            renderItem={({ item }) => (
              <View style={[styles.seatCard, { backgroundColor: getSeatColor(item) }]}>
                <Text style={styles.seatText}>{item.seat_id}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No seats found for this zone.</Text>
            }
          />
        )}

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#2A9D8F' }]} />
            <Text style={styles.legendText}>Free</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#D9534F' }]} />
            <Text style={styles.legendText}>Occupied</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#F4A261' }]} />
            <Text style={styles.legendText}>Buffer</Text>
          </View>
        </View>

        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  appName: {
    color: '#E0FBFC',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#8EC7C1',
    fontSize: 16,
    marginTop: 6,
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    gap: 8,
  },
  freeBadge: {
    backgroundColor: '#2A9D8F',
  },
  occupiedBadge: {
    backgroundColor: '#D9534F',
  },
  badgeLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  badgeValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1D3A4D',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#132A3D',
  },
  tabActive: {
    borderColor: '#00A896',
    backgroundColor: '#174A59',
  },
  tabText: {
    color: '#9CC8C3',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#E0FBFC',
  },
  loader: {
    marginTop: 24,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  seatRow: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  seatCard: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  emptyText: {
    color: '#8EC7C1',
    marginTop: 16,
    textAlign: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#1D3A4D',
    marginTop: 'auto',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#B8D9D5',
    fontSize: 12,
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});
