import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../supabase';

type Seat = {
  seat_id: number | string;
  zone: string | null;
  is_buffer: boolean | null;
  status: 'free' | 'occupied' | string | null;
};

const normalizeZone = (zone: string | null) => {
  const value = (zone ?? '').toLowerCase().trim();
  if (value.includes('quiet')) return 'quiet';
  if (value.includes('group')) return 'group';
  return value;
};

export default function HomeScreen() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const pulse = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [pulse]);

  const freeSeats = seats.filter((seat) => seat.status === 'free').length;
  const occupiedSeats = seats.filter((seat) => seat.status === 'occupied').length;
  const toSeatNumber = (seatId: number | string) => Number(String(seatId).replace(/\D/g, ''));
  const quietSeats = seats.filter((seat) => {
    const id = toSeatNumber(seat.seat_id);
    return Number.isFinite(id) && id >= 1 && id <= 18;
  });
  const groupSeats = seats.filter((seat) => {
    const id = toSeatNumber(seat.seat_id);
    return Number.isFinite(id) && id >= 19 && id <= 27;
  });
  const bufferSeats = seats.filter((seat) => {
    const id = toSeatNumber(seat.seat_id);
    return Number.isFinite(id) && id >= 28 && id <= 30;
  });

  const getSeatTheme = (seat: Seat) => {
    if (seat.is_buffer) {
      return {
        backgroundColor: '#3d2b0a',
        borderColor: '#F4A261',
        textColor: '#F4A261',
      };
    }

    if (seat.status === 'occupied') {
      return {
        backgroundColor: '#3d1515',
        borderColor: '#E74C3C',
        textColor: '#E74C3C',
      };
    }

    return {
      backgroundColor: '#0e3d2c',
      borderColor: '#27AE60',
      textColor: '#27AE60',
    };
  };

  const renderSeatCard = (seat: Seat) => {
    const theme = getSeatTheme(seat);

    return (
      <View
        key={String(seat.seat_id)}
        style={[
          styles.seatCard,
          {
            backgroundColor: theme.backgroundColor,
            borderColor: theme.borderColor,
          },
        ]}>
        <Text style={[styles.seatText, { color: theme.textColor }]}>{seat.seat_id}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.contentWrapper}>
        <View style={styles.container}>
          <View style={styles.headerSection}>
            <View style={styles.titleRow}>
              <Text style={styles.appName}>LibSpace</Text>
              <View style={styles.liveRow}>
                <Animated.View style={[styles.liveDot, { opacity: pulse }]} />
                <Text style={styles.liveText}>Live</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={[styles.badge, styles.freeBadge]}>
                <View style={[styles.statDot, styles.statDotFree]} />
                <View>
                  <Text style={styles.badgeLabel}>Free</Text>
                  <Text style={[styles.badgeValue, styles.badgeValueFree]}>
                    {loading ? '...' : freeSeats}
                  </Text>
                </View>
              </View>
              <View style={[styles.badge, styles.occupiedBadge]}>
                <View style={[styles.statDot, styles.statDotOccupied]} />
                <View>
                  <Text style={styles.badgeLabel}>Occupied</Text>
                  <Text style={[styles.badgeValue, styles.badgeValueOccupied]}>
                    {loading ? '...' : occupiedSeats}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#00A896" style={styles.loader} />
          ) : (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}>
              <View style={styles.zoneStack}>
                <View style={styles.zoneSection}>
                  <View style={styles.zoneHeaderRow}>
                    <Text style={styles.zoneLabelTeal}>QUIET ZONE</Text>
                    <Text style={styles.zoneCount}>{quietSeats.length} seats</Text>
                  </View>
                  <View style={styles.seatGrid}>{quietSeats.map((seat) => renderSeatCard(seat))}</View>
                </View>

                <View style={styles.zoneSection}>
                  <View style={styles.zoneHeaderRow}>
                    <Text style={styles.zoneLabelTeal}>GROUP ZONE</Text>
                    <Text style={styles.zoneCount}>{groupSeats.length} seats</Text>
                  </View>
                  <View style={styles.seatGrid}>{groupSeats.map((seat) => renderSeatCard(seat))}</View>
                </View>

                <View style={styles.zoneSection}>
                  <View style={styles.zoneHeaderRow}>
                    <Text style={styles.zoneLabelOrange}>BUFFER ZONE</Text>
                  </View>
                  <View style={styles.seatGrid}>{bufferSeats.map((seat) => renderSeatCard(seat))}</View>
                </View>
              </View>
            </ScrollView>
          )}

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#27AE60' }]} />
              <Text style={styles.legendText}>Free</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#E74C3C' }]} />
              <Text style={styles.legendText}>Occupied</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#F4A261' }]} />
              <Text style={styles.legendText}>Buffer</Text>
            </View>
          </View>

          {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  headerSection: {
    paddingTop: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00A896',
  },
  liveText: {
    color: '#00A896',
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 12,
  },
  badge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#132333',
  },
  freeBadge: {
    borderColor: '#1e3448',
  },
  occupiedBadge: {
    borderColor: '#1e3448',
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statDotFree: {
    backgroundColor: '#27AE60',
  },
  statDotOccupied: {
    backgroundColor: '#E74C3C',
  },
  badgeLabel: {
    color: '#7B8FA8',
    fontSize: 11,
    fontWeight: '600',
  },
  badgeValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  badgeValueFree: {
    color: '#27AE60',
  },
  badgeValueOccupied: {
    color: '#E74C3C',
  },
  loader: {
    marginTop: 24,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  zoneStack: {
    gap: 12,
  },
  zoneSection: {
    width: '100%',
  },
  zoneHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  zoneLabelTeal: {
    color: '#00A896',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  zoneLabelOrange: {
    color: '#F4A261',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  zoneCount: {
    color: '#7B8FA8',
    fontSize: 11,
  },
  seatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginHorizontal: 0,
  },
  seatCard: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatText: {
    fontWeight: '700',
    fontSize: 11,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#1e3448',
    marginTop: 8,
    gap: 16,
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
    color: '#7B8FA8',
    fontSize: 11,
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});
