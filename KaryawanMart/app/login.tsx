import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_URL } from "../config/api";





export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  const handleLogin = async () => {
    try {
const response = await fetch("http://10.0.2.2:8000/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("token", data.access_token);
        router.replace("/home");
      } else {
        Alert.alert("Gagal", "Email atau password salah");
      }
    } catch (error) {
      Alert.alert("Error", "Server Laravel tidak aktif");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Karyawan MART</Text>
      <Text style={styles.subTitle}>Silakan masuk ke akun kurir Anda</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>MASUK</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#fff' },
  logo: { fontSize: 28, fontWeight: 'bold', color: '#ED1C24', textAlign: 'center' },
  subTitle: { textAlign: 'center', color: '#7f8c8d', marginBottom: 40, marginTop: 10 },
  input: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  button: { backgroundColor: '#ED1C24', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});