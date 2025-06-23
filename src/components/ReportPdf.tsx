import React from "react";
import { Document, Page, Text, View, StyleSheet, Svg, Line, Rect } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica" },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 15,
    fontWeight: "bold",
    color: "#333",
  },
  userSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 11,
    marginBottom: 8,
    color: "#555",
  },
  kelasTableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  colKelas: { width: "40%", fontSize: 10, paddingLeft: 5 },
  colCompleted: { width: "20%", fontSize: 10, textAlign: "center" },
  colTotal: { width: "20%", fontSize: 10, textAlign: "center" },
  colPercent: { width: "20%", fontSize: 10, textAlign: "center" },
  noData: {
    fontSize: 10,
    color: "#888",
    marginTop: 5,
    marginLeft: 5,
  },
  // Style untuk chart dalam PDF
  chartContainer: {
    width: "100%",
    height: 200, // Tinggi chart dalam PDF
    marginBottom: 20,
    marginTop: 20,
    border: "1px solid #ccc",
    padding: 10,
  },
  chartTitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  chartAxisText: {
    fontSize: 8,
    color: "#666",
  },
  // Kolom untuk layout bar chart
  chartBarColumn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end", // Batang mulai dari bawah
    marginHorizontal: 2,
    flexGrow: 1,
    height: "100%", // Akan diisi oleh BarRect
  },
  chartBarsWrapper: {
    flexDirection: "row",
    alignItems: "flex-end", // Batang sejajar di bagian bawah
    width: "100%",
    height: "calc(100% - 20pt)", // Ruang untuk label X-axis
  },
  chartYAxisLabel: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: 20,
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  chartXAxisLabel: {
    fontSize: 8,
    marginTop: 5,
    textAlign: "center",
    width: "100%",
  },
});

// --- Definisi Interface untuk Data Chart ---
interface KelasOverviewData {
  kelasId: string;
  namaKelas: string;
  averageProgress: number;
  studentsCount: number;
}

interface SimplePdfBarChartProps {
  data: KelasOverviewData[];
  width: number;
  height: number;
}

// --- Komponen Chart Sederhana untuk PDF ---
// Ini akan menggambar bar chart secara manual menggunakan Svg dari @react-pdf/renderer
const SimplePdfBarChart = ({ data, width, height }: SimplePdfBarChartProps) => {
  // <<< FIX: Tambahkan tipe di sini
  if (!data || data.length === 0) {
    return <Text style={styles.noData}>Tidak ada data chart.</Text>;
  }

  const paddingX = 40; // Ruang untuk label Y-axis di kiri
  const paddingY = 20; // Ruang untuk label X-axis di bawah
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const maxValue = 100; // Progres maksimal 100%
  // Pastikan data.length tidak nol untuk menghindari pembagian dengan nol
  const barWidth = Math.max(5, (chartWidth / (data.length || 1)) * 0.7);
  const barGap = (chartWidth / (data.length || 1)) * 0.3;

  return (
    <Svg width={width} height={height}>
      {/* Grid Y-axis */}
      {[0, 25, 50, 75, 100].map((val, i) => (
        <Line key={i} x1={paddingX} y1={height - paddingY - (val / maxValue) * chartHeight} x2={width - paddingX} y2={height - paddingY - (val / maxValue) * chartHeight} stroke="#ccc" strokeWidth={0.5} strokeDasharray="2 2" />
      ))}
      {/* Label Y-axis */}
      {[0, 25, 50, 75, 100].map((val, i) => (
        <Text key={`y-label-${i}`} x={paddingX - 5} y={height - paddingY - (val / maxValue) * chartHeight + 4} textAnchor="end" style={styles.chartAxisText}>
          {val}%
        </Text>
      ))}

      {/* Bars */}
      {data.map((item: KelasOverviewData, index) => {
        // <<< FIX: Tambahkan tipe di sini
        const barHeight = (item.averageProgress / maxValue) * chartHeight;
        const x = paddingX + index * (barWidth + barGap) + barGap / 2;
        const y = height - paddingY - barHeight;

        return (
          <React.Fragment key={item.kelasId}>
            <Rect x={x} y={y} width={barWidth} height={barHeight} fill="#8884d8" />
            {/* Label di atas bar */}
            <Text
              x={x + barWidth / 2}
              y={y - 5} // Sedikit di atas bar
              textAnchor="middle"
              style={styles.chartAxisText}
            >
              {item.averageProgress}%
            </Text>
            {/* Label X-axis (nama kelas) */}
            <Text
              x={x + barWidth / 2}
              y={height - paddingY + 5} // Sedikit di bawah sumbu X
              textAnchor="middle"
              style={styles.chartAxisText}
            >
              {item.namaKelas.length > 10 ? item.namaKelas.substring(0, 7) + "..." : item.namaKelas}
            </Text>
          </React.Fragment>
        );
      })}

      {/* X-axis line */}
      <Line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#666" strokeWidth={1} />
      {/* Y-axis line */}
      <Line x1={paddingX} y1={height - paddingY} x2={paddingX} y2={paddingY} stroke="#666" strokeWidth={1} />
    </Svg>
  );
};

// --- Komponen ReportPdf Utama ---
export const ReportPdf = ({
  data,
  kelasOverviewData, // Menerima data overview untuk chart
}: {
  data: {
    userId: string;
    nama: string | null;
    email: string;
    progress: {
      namaKelas: string;
      kelasId: string;
      totalMateriContent: number;
      completedMateriContentCount: number;
      progressPercent: number;
    }[];
  }[];
  kelasOverviewData: KelasOverviewData[]; // <<< FIX: Gunakan tipe yang sudah didefinisikan
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Laporan Progres Semua Siswa</Text>

      {/* Bagian Chart di Laporan PDF */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Rata-rata Progres Siswa per Kelas</Text>
        <SimplePdfBarChart data={kelasOverviewData} width={500} height={180} />
      </View>

      <Text style={styles.subHeader}>Detail Progres Siswa:</Text>
      {data && data.length > 0 ? (
        data.map((user, index) => (
          <View key={index} style={styles.userSection}>
            <Text style={styles.userName}>
              {user.nama || "Tanpa Nama"} (ID: {user.userId})
            </Text>
            <Text style={styles.userEmail}>{user.email}</Text>

            <View style={styles.kelasTableHeader}>
              <Text style={styles.colKelas}>Kelas</Text>
              <Text style={styles.colCompleted}>Selesai</Text>
              <Text style={styles.colTotal}>Total</Text>
              <Text style={styles.colPercent}>%</Text>
            </View>

            {user.progress && user.progress.length > 0 ? (
              user.progress.map((kelas, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.colKelas}>{kelas.namaKelas}</Text>
                  <Text style={styles.colCompleted}>{kelas.completedMateriContentCount}</Text>
                  <Text style={styles.colTotal}>{kelas.totalMateriContent}</Text>
                  <Text style={styles.colPercent}>{kelas.progressPercent}%</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noData}>Belum terdaftar di kelas manapun atau belum ada progres.</Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.header}>Tidak ada data siswa yang ditemukan.</Text>
      )}
    </Page>
  </Document>
);
