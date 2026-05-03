import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SeatConfirmedScreen() {
  const { seatNumber: initialSeatNumber, zone: initialZone } =
    useLocalSearchParams<{
      seatNumber: string;
      zone: string;
    }>();

  const [seatNumber, setSeatNumber] = useState(initialSeatNumber);
  const [zone, setZone] = useState(initialZone);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleGoToLibrary = () => {
    router.replace("/(tabs)/" as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.checkmarkContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.checkmarkCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Checked in!</Text>
          <Text style={styles.subtitle}>Welcome to the library</Text>
        </Animated.View>

        <Animated.View style={[styles.seatCard, { opacity: fadeAnim }]}>
          <Text style={styles.seatLabel}>YOUR ASSIGNED SEAT</Text>
          <Text style={styles.seatNumber}>{seatNumber}</Text>
          <View style={styles.zonePill}>
            <Text style={styles.zoneText}>
              {zone === "quiet" ? "Quiet Zone" : "Group Zone"}
            </Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGoToLibrary}
          >
            <Text style={styles.primaryButtonText}>Go to library →</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  checkmarkContainer: {
    marginBottom: 32,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#00A896",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 48,
    color: "#0D1B2A",
    fontWeight: "bold",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#7B8FA8",
  },
  seatCard: {
    backgroundColor: "#132333",
    borderWidth: 1,
    borderColor: "#1e3448",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
  },
  seatLabel: {
    fontSize: 11,
    color: "#7B8FA8",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  seatNumber: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#00A896",
    marginBottom: 16,
  },
  zonePill: {
    backgroundColor: "#1e3448",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  zoneText: {
    fontSize: 14,
    color: "#00A896",
    fontWeight: "600",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#00A896",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#0D1B2A",
    fontSize: 16,
    fontWeight: "bold",
  },
});
