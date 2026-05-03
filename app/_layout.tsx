import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { supabase } from "../supabase";

export default function RootLayout() {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      console.log("Session:", session?.user?.email);
      if (event === "SIGNED_IN" && session) {
        router.replace("/auth-callback");
      }
      if (event === "SIGNED_OUT") {
        router.replace("/");
      }
    });
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0D1B2A" },
      }}
    >
      <Stack.Screen name="auth-callback" options={{ headerShown: false }} />
      <Stack.Screen name="seat-confirmed" options={{ headerShown: false }} />
      <Stack.Screen name="checkin" options={{ headerShown: false }} />
    </Stack>
  );
}
