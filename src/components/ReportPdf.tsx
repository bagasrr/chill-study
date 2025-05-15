// components/ReportAllProgress.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
    textAlign: "center",
  },
  userSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    marginBottom: 8,
  },
  kelasHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  colKelas: { width: "50%", fontSize: 10 },
  colSelesai: { width: "20%", fontSize: 10 },
  colTotal: { width: "15%", fontSize: 10 },
  colPercent: { width: "15%", fontSize: 10 },
});

export const ReportPdf = ({
  data,
}: {
  data: {
    userId: string;
    nama: string | null;
    email: string;
    progress: {
      namaKelas: string;
      kelasId: string;
      totalMateri: number;
      selesai: number;
      progressPercent: number;
    }[];
  }[];
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Laporan Progres Semua Siswa</Text>

      {data &&
        data.map((user, index) => (
          <View key={index} style={styles.userSection}>
            <Text style={styles.userName}>
              {user.nama || "Tanpa Nama"} (ID: {user.userId})
            </Text>
            <Text style={styles.userEmail}>{user.email}</Text>

            <View style={styles.kelasHeader}>
              <Text style={styles.colKelas}>Kelas</Text>
              <Text style={styles.colSelesai}>Selesai</Text>
              <Text style={styles.colTotal}>Total</Text>
              <Text style={styles.colPercent}>%</Text>
            </View>

            {user.progress ? (
              user.progress.map((kelas, idx) => (
                <View key={idx} style={styles.row}>
                  <Text style={styles.colKelas}>{kelas.namaKelas}</Text>
                  <Text style={styles.colSelesai}>{kelas.selesai}</Text>
                  <Text style={styles.colTotal}>{kelas.totalMateri}</Text>
                  <Text style={styles.colPercent}>{kelas.progressPercent}%</Text>
                </View>
              ))
            ) : (
              <View>
                <Text>Belum ada kelas yang diambil</Text>
              </View>
            )}
          </View>
        ))}
    </Page>
  </Document>
);
