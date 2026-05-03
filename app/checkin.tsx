import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../hooks/useSession";

export default function CheckInScreen() {
  const [selectedZone, setSelectedZone] = useState("quiet");
  const [rollNumber, setRollNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { checkIn } = useSession();

  const handleCheckIn = async () => {
    if (!rollNumber.trim()) {
      setError("Please enter your roll number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await checkIn(rollNumber.trim(), selectedZone);
      setLoading(false);

      if (result.success) {
        router.push({
          pathname: "/seat-confirmed",
          params: {
            seatNumber: String(result.seatNumber),
            zone: result.zone,
          },
        });
      } else {
        if (result.error === "Library is full") {
          setError("Library is full - please try again later");
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Check in</Text>
          <Text style={styles.subtitle}>
            Select your preferred zone to check in
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>ROLL NUMBER</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Enter your roll number"
              placeholderTextColor="#7B8FA8"
              value={rollNumber}
              onChangeText={setRollNumber}
              editable={!loading}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <View style={styles.zoneSelectionContainer}>
            <Text style={styles.zoneSelectionLabel}>SELECT ZONE</Text>
            <View style={styles.zoneCardsRow}>
              <TouchableOpacity
                style={[
                  styles.zoneCard,
                  selectedZone === "quiet"
                    ? styles.zoneCardActive
                    : styles.zoneCardInactive,
                ]}
                onPress={() => setSelectedZone("quiet")}
              >
                <Text
                  style={[
                    styles.zoneCardTitle,
                    selectedZone === "quiet"
                      ? styles.zoneCardTitleActive
                      : styles.zoneCardTitleInactive,
                  ]}
                >
                  Quiet Zone
                </Text>
                <Text
                  style={[
                    styles.zoneCardSubtitle,
                    selectedZone === "quiet"
                      ? styles.zoneCardSubtitleActive
                      : styles.zoneCardSubtitleInactive,
                  ]}
                >
                  Study alone · Silence required
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.zoneCard,
                  selectedZone === "group"
                    ? styles.zoneCardActive
                    : styles.zoneCardInactive,
                ]}
                onPress={() => setSelectedZone("group")}
              >
                <Text
                  style={[
                    styles.zoneCardTitle,
                    selectedZone === "group"
                      ? styles.zoneCardTitleActive
                      : styles.zoneCardTitleInactive,
                  ]}
                >
                  Group Zone
                </Text>
                <Text
                  style={[
                    styles.zoneCardSubtitle,
                    selectedZone === "group"
                      ? styles.zoneCardSubtitleActive
                      : styles.zoneCardSubtitleInactive,
                  ]}
                >
                  With friends · Low talk OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.checkInButton, loading && styles.buttonDisabled]}
            onPress={handleCheckIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0D1B2A" size="small" />
            ) : (
              <Text style={styles.checkInButtonText}>Check in</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#7B8FA8",
    textAlign: "center",
    marginBottom: 48,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 11,
    color: "#00A896",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#1e3448",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#FFFFFF",
    backgroundColor: "transparent",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 8,
  },
  checkInButton: {
    height: 56,
    backgroundColor: "#00A896",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#1e3448",
  },
  checkInButtonText: {
    color: "#0D1B2A",
    fontSize: 16,
    fontWeight: "600",
  },
  zoneSelectionContainer: {
    marginBottom: 32,
  },
  zoneSelectionLabel: {
    fontSize: 11,
    color: "#00A896",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  zoneCardsRow: {
    flexDirection: "row",
    gap: 12,
  },
  zoneCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  zoneCardActive: {
    backgroundColor: "#0e3d2c",
    borderColor: "#00A896",
  },
  zoneCardInactive: {
    backgroundColor: "#132333",
    borderColor: "#1e3448",
  },
  zoneCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  zoneCardTitleActive: {
    color: "#FFFFFF",
  },
  zoneCardTitleInactive: {
    color: "#7B8FA8",
  },
  zoneCardSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  zoneCardSubtitleActive: {
    color: "#FFFFFF",
  },
  zoneCardSubtitleInactive: {
    color: "#7B8FA8",
  },
});
