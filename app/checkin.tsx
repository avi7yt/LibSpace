import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

function QrIcon() {
  return (
    <View style={styles.qrGrid} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={[styles.qrCell, styles.qrCellFilled]} />
      <View style={styles.qrCell} />
      <View style={[styles.qrCell, styles.qrCellFilled]} />
      <View style={styles.qrCell} />
      <View style={[styles.qrCell, styles.qrCellFilled]} />
      <View style={styles.qrCell} />
      <View style={[styles.qrCell, styles.qrCellFilled]} />
      <View style={styles.qrCell} />
      <View style={[styles.qrCell, styles.qrCellFilled]} />
    </View>
  );
}

export default function CheckInScreen() {
  const [rollNumber, setRollNumber] = useState('');
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [contentOpacity, contentTranslateY]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backArrow}>{"\u2190"}</Text>
          </Pressable>

          <Text style={styles.title}>Check in</Text>
          <Text style={styles.subtitle}>Enter your roll number or scan your ID card</Text>

          <View style={styles.card}>
            <Text style={styles.inputLabel}>Roll number</Text>
            <TextInput
              value={rollNumber}
              onChangeText={setRollNumber}
              placeholder="e.g. 2021CS0042"
              placeholderTextColor="#7B8FA8"
              style={styles.input}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <Pressable style={styles.scanButton}>
            <QrIcon />
            <Text style={styles.scanButtonText}>Scan QR code on ID card</Text>
          </Pressable>

          <Pressable style={styles.primaryButton} onPress={() => router.push('/seat-confirmed' as any)}>
            <Text style={styles.primaryButtonText}>Check in</Text>
          </Pressable>

          <Text style={styles.note}>
            Default zone: Quiet {'\u2014'} you can change after check-in
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
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
    color: '#00A896',
    fontSize: 24,
    fontWeight: '700',
  },
  title: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 6,
    color: '#7B8FA8',
    fontSize: 14,
  },
  card: {
    marginTop: 22,
    backgroundColor: '#132333',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e3448',
    padding: 16,
  },
  inputLabel: {
    color: '#00A896',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  input: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e3448',
    paddingBottom: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  orRow: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1e3448',
  },
  orText: {
    color: '#7B8FA8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  scanButton: {
    marginTop: 18,
    borderWidth: 1.5,
    borderColor: '#00A896',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 10,
  },
  scanButtonText: {
    color: '#00A896',
    fontSize: 15,
    fontWeight: '600',
  },
  qrGrid: {
    width: 14,
    height: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  qrCell: {
    width: 4,
    height: 4,
    marginRight: 1,
    marginBottom: 1,
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
  qrCellFilled: {
    backgroundColor: '#00A896',
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: '#00A896',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#0D1B2A',
    fontSize: 15,
    fontWeight: '700',
  },
  note: {
    marginTop: 'auto',
    color: '#7B8FA8',
    fontSize: 11,
    textAlign: 'center',
    paddingTop: 20,
  },
});
