import React, { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../constants/colors';

export default function CheckInScreen() {
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        easing: (value) => 1 - (1 - value) * (1 - value),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 500,
        easing: (value) => 1 - (1 - value) * (1 - value),
        useNativeDriver: true,
      }),
    ]).start();
  }, [contentOpacity, contentTranslateY]);

  const handleCheckIn = () => {
    if (!rollNumber.trim()) {
      setError('Please enter your roll number');
      return;
    }

    setError('');
    router.push('/seat-confirmed' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backArrow}>{"\u2190"}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Check in</Text>
          <Text style={styles.subtitle}>Enter your roll number or scan your ID card</Text>

          <View style={styles.card}>
            <Text style={styles.inputLabel}>ROLL NUMBER</Text>
            <TextInput
              value={rollNumber}
              onChangeText={(value) => {
                setRollNumber(value);
                if (error) {
                  setError('');
                }
              }}
              placeholder="e.g. 2021CS0042"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
              autoCapitalize="none"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <TouchableOpacity style={styles.scanButton}>
            <Text style={styles.scanButtonText}>Scan QR code on ID card</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleCheckIn}>
            <Text style={styles.primaryButtonText}>Check in</Text>
          </TouchableOpacity>

          <Text style={styles.note}>Default zone: Quiet - changeable after check-in</Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingRight: 8,
  },
  backArrow: {
    color: COLORS.teal,
    fontSize: 24,
    fontWeight: '700',
  },
  title: {
    marginTop: 8,
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 14,
  },
  card: {
    marginTop: 24,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  inputLabel: {
    color: COLORS.teal,
    fontSize: 11,
    letterSpacing: 0.8,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
    color: COLORS.white,
    fontSize: 16,
  },
  errorText: {
    marginTop: 8,
    color: COLORS.occupied,
    fontSize: 12,
  },
  orRow: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  orText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  scanButton: {
    borderWidth: 1.5,
    borderColor: COLORS.teal,
    borderRadius: 12,
    padding: 14,
  },
  scanButtonText: {
    color: COLORS.teal,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: COLORS.teal,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '700',
  },
  note: {
    marginTop: 16,
    color: COLORS.muted,
    fontSize: 11,
    textAlign: 'center',
  },
});
