import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(20)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(nameOpacity, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 600,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [buttonOpacity, logoOpacity, logoTranslateY, nameOpacity, taglineOpacity]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.upperSection}>
        <Animated.View
          style={[
            styles.logoBox,
            {
              opacity: logoOpacity,
              transform: [{ translateY: logoTranslateY }],
            },
          ]}
        >
          <Text style={styles.logoLetter}>L</Text>
        </Animated.View>

        <Animated.Text style={[styles.appName, { opacity: nameOpacity }]}>
          LibSpace
        </Animated.Text>

        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Smart university library
        </Animated.Text>

        <Text style={styles.description}>
          Seat availability {"\u00B7"} Book discovery {"\u00B7"} Zero
          frustration
        </Text>
      </View>

      <Animated.View style={[styles.buttonWrapper, { opacity: buttonOpacity }]}>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/checkin")}
        >
          <Text style={styles.buttonText}>Get started</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 48,
  },
  upperSection: {
    flex: 1,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#00A896",
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: {
    fontSize: 36,
    fontWeight: "700",
    color: "#0D1B2A",
  },
  appName: {
    marginTop: 16,
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#00A896",
  },
  description: {
    marginTop: 12,
    fontSize: 13,
    color: "#7B8FA8",
    textAlign: "center",
  },
  buttonWrapper: {
    width: "100%",
    maxWidth: 360,
  },
  button: {
    backgroundColor: "#00A896",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#0D1B2A",
    fontSize: 15,
    fontWeight: "700",
  },
});
