import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const supabaseUrl = "https://usdmfhvhuksybrfntgqo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZG1maHZodWtzeWJyZm50Z3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0Njc3NDEsImV4cCI6MjA5MzA0Mzc0MX0.o3t_20YXzc6sO0HIlTYb-OKkSywR6Fn6m6Bao_LC9XQ";

const isClient = typeof window !== "undefined";
const storage = isClient && Platform.OS !== "web" ? AsyncStorage : undefined;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: isClient,
    persistSession: isClient,
    detectSessionInUrl: isClient,
  },
});
