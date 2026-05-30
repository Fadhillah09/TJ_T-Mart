import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { API_URL } from "../config/api";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import {
  Home,
  ClipboardList,
  Bell,
  User,
  ScanLine,
  ShoppingBag,
} from "lucide-react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

const { width } = Dimensions.get("window");

export default function Dashboard() {
  const [userData, setUserData] = useState({
    name: "Memuat...",
    role: "Kurir",
    nip: "-",
    mart: "-",
    gaji: "Rp 0",
  });

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Session habis", "Silakan login ulang");
        return;
      }

      const response = await fetch(`${API_URL}/kurir/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Unauthorized");
      }

      const data = await response.json();

      setUserData({
        name: data.name,
        role: data.role?.name ?? "Kurir",
        nip: data.karyawan_profile?.nip ?? "-",
        mart: data.karyawan_profile?.mart?.nama ?? "-",
        gaji: data.gaji ?? "Rp 0",
      });
    } catch (error) {
      console.error("Gagal mengambil data dari backend", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleNav = (menu: string) => {
    if (menu === "Order")
      Alert.alert("Daftar Pesanan", "Menampilkan pesanan baru di Mart Anda.");
    else if (menu === "Riwayat")
      Alert.alert("Riwayat", "Membuka riwayat kerja Anda.");
    else if (menu === "Notifikasi")
      Alert.alert("Pusat Pesan", "Belum ada notifikasi baru.");
    else if (menu === "Akun") Alert.alert("Profil", "Membuka pengaturan akun.");
    else Alert.alert("Info", `Membuka menu ${menu}...`);
  };

  const [permission, requestPermission] = useCameraPermissions();

  const handlePresensi = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    setScanning(true);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanning(false);
    Alert.alert("Berhasil", `Presensi tercatat untuk Mart: ${data}`);
  };

  const handleTerima = (orderId: string) => {
    Alert.alert("Konfirmasi", `Terima pesanan #${orderId}?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Terima",
        onPress: () => Alert.alert("Sukses", "Pesanan diambil! Segera antar."),
      },
    ]);
  };

  const handleTolak = () => {
    Alert.alert(
      "Tolak Pesanan",
      "Pesanan akan dilempar ke kurir aktif lainnya.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Tolak",
          onPress: () =>
            Alert.alert("Berhasil", "Pesanan dilempar ke kurir lain."),
        },
      ],
    );
  };

  // TAMPILAN SCANNER (Jika sedang scanning)
  if (scanning) {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={({ data }) => {
            setScanning(false);
            Alert.alert("Presensi Berhasil", data);
          }}
        />

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => setScanning(false)}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>BATAL</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ED1C24" />

      <View style={styles.header}>
        <View style={styles.profileRow}>
          <View style={styles.avatarCircle}>
            <User color="#ED1C24" size={24} />
          </View>
          <View>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userSub}>
              {userData.role} • {userData.nip}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.mainCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>{userData.mart}</Text>
            <View style={styles.badgeAktif}>
              <Text style={styles.badgeText}>AKTIF</Text>
            </View>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.statsContainer}>
            <Text style={styles.statsLabel}>Total Gaji</Text>
            <Text style={styles.statsValue}>{userData.gaji}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Fitur Karyawan</Text>
        <View style={styles.menuGrid}>
          {[
            {
              name: "Order Masuk",
              icon: <ShoppingBag color="#ED1C24" size={26} />,
              action: () => handleNav("Order"),
            },
            {
              name: "Riwayat",
              icon: <ClipboardList color="#ED1C24" size={26} />,
              action: () => handleNav("Riwayat"),
            },
            {
              name: "Absensi",
              icon: <ScanLine color="#ED1C24" size={26} />,
              action: handlePresensi, // Memanggil fungsi scanner asli
            },
            {
              name: "Lainnya",
              icon: (
                <Text style={{ color: "#ED1C24", fontWeight: "bold" }}>
                  ...
                </Text>
              ),
              action: () => handleNav("Lainnya"),
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.action}
            >
              <View style={styles.iconContainer}>{item.icon}</View>
              <Text style={styles.menuLabel}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.orderCard}>
          <Text style={styles.orderAlert}>ADA PESANAN BARU!</Text>
          <Text style={styles.orderDesc}>Tujuan: GKU Telkom University</Text>
          <View style={styles.orderActions}>
            <TouchableOpacity style={styles.btnTolak} onPress={handleTolak}>
              <Text style={styles.btnTextTolak}>TOLAK</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnTerima}
              onPress={() => handleTerima("ORD-001")}
            >
              <Text style={styles.btnTextTerima}>TERIMA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => handleNav("Beranda")}
        >
          <Home color="#ED1C24" size={24} />
          <Text style={styles.navTextActive}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => handleNav("Timeline")}
        >
          <ClipboardList color="#7f8c8d" size={24} />
          <Text style={styles.navText}>Timeline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.scanButton} onPress={handlePresensi}>
          <ScanLine color="#fff" size={28} />
          <Text style={styles.scanButtonText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => handleNav("Notifikasi")}
        >
          <Bell color="#7f8c8d" size={24} />
          <Text style={styles.navText}>Notifikasi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => handleNav("Akun")}
        >
          <User color="#7f8c8d" size={24} />
          <Text style={styles.navText}>Akun</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    backgroundColor: "#ED1C24",
    height: 120,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  profileRow: { flexDirection: "row", alignItems: "center" },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  userSub: { color: "#FFB3B3", fontSize: 12 },
  content: { flex: 1, marginTop: -35 },
  mainCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    elevation: 5,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 12, fontWeight: "bold", color: "#7F8C8D" },
  cardDivider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 10 },
  statsContainer: { marginTop: 2 },
  statsLabel: { color: "#7F8C8D", fontSize: 11 },
  statsValue: { fontSize: 22, fontWeight: "bold", color: "#2C3E50" },
  badgeAktif: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  badgeText: { color: "#27AE60", fontWeight: "bold", fontSize: 9 },
  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 15,
  },
  menuGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    paddingHorizontal: 10,
  },
  menuItem: { alignItems: "center" },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  menuLabel: { fontSize: 10, color: "#2C3E50", marginTop: 6 },
  orderCard: {
    backgroundColor: "#FFF",
    margin: 20,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#ED1C24",
    elevation: 3,
  },
  orderAlert: { fontWeight: "bold", color: "#ED1C24", fontSize: 11 },
  orderDesc: { marginVertical: 8, fontSize: 13, color: "#34495E" },
  orderActions: { flexDirection: "row", justifyContent: "space-between" },
  btnTerima: {
    backgroundColor: "#27AE60",
    paddingVertical: 8,
    borderRadius: 6,
    width: "48%",
    alignItems: "center",
  },
  btnTolak: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ED1C24",
    paddingVertical: 8,
    borderRadius: 6,
    width: "48%",
    alignItems: "center",
  },
  btnTextTerima: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  btnTextTolak: { color: "#ED1C24", fontWeight: "bold", fontSize: 12 },
  bottomNav: {
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  navTab: { alignItems: "center" },
  navText: { fontSize: 9, color: "#7F8C8D", marginTop: 3 },
  navTextActive: {
    fontSize: 9,
    color: "#ED1C24",
    marginTop: 3,
    fontWeight: "bold",
  },
  scanButton: {
    backgroundColor: "#ED1C24",
    width: 60,
    height: 60,
    borderRadius: 30,
    top: -20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    borderWidth: 4,
    borderColor: "#fff",
  },
  scanButtonText: { color: "#fff", fontSize: 9, fontWeight: "bold" },
  closeBtn: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "#ED1C24",
    padding: 15,
    borderRadius: 10,
  },
});
