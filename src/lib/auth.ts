import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma"; // Pastikan path ini benar
import { randomUUID } from "crypto";
import { NextAuthOptions, User, Account } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline", // WAJIB untuk mendapatkan refresh_token
          response_type: "code",
        },
      },
    }),
  ],

  // 💡 Menggunakan 'database' adalah pilihan yang TEPAT untuk tujuan Anda
  session: {
    strategy: "database",
    // Atur durasi sesi di database
    maxAge: 2 * 24 * 60 * 60, // 30 hari
    updateAge: 24 * 60 * 60, // Update setiap 24 jam
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    /**
     * signIn: Validasi sebelum user berhasil login.
     * Ini adalah tempat yang tepat untuk mengunci device.
     */
    async signIn({ user, account }: { user: User; account: Account | null }) {
      if (!user.email || !account) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      // ❌ Kunci Device: Jika user sudah ada dan token devicenya masih aktif, tolak.
      if (existingUser?.deviceToken && existingUser.devTokenExpiredAt && existingUser.devTokenExpiredAt > new Date()) {
        console.log(`Login ditolak untuk ${user.email}: Device lain masih aktif.`);
        return "/auth/error?error=DeviceActive"; // Arahkan ke halaman error
      }

      // ✅ Login Diizinkan: Simpan semua token penting dari Google ke database
      const deviceToken = randomUUID();
      const devTokenExpiredAt = new Date();
      devTokenExpiredAt.setHours(devTokenExpiredAt.getHours() + 3); // Kunci device berlaku 3 jam, bisa disesuaikan

      await prisma.user.update({
        where: { email: user.email },
        data: {
          deviceToken,
          devTokenExpiredAt,
          googleAccessToken: account.access_token,
          googleRefreshToken: account.refresh_token,
          // expires_at dari Google dalam detik, ubah ke milidetik lalu jadi Date
          googleTokenExpiry: new Date(Date.now() + account.expires_at! * 1000),
        },
      });

      return true;
    },

    /**
     * session: Dipanggil setiap kali sesi diakses.
     * INI ADALAH TEMPAT KITA MELAKUKAN REFRESH TOKEN.
     */
    async session({ session, user }: { session: any; user: User }) {
      const now = new Date();

      // 1. Cek apakah token di database sudah kedaluwarsa
      const isTokenExpired = user.googleTokenExpiry ? now > user.googleTokenExpiry : true;

      if (isTokenExpired) {
        // 🔄 Token kedaluwarsa, lakukan refresh
        console.log(`Token untuk ${user.email} kedaluwarsa, mencoba refresh...`);
        if (!user.googleRefreshToken) {
          // Jika tidak ada refresh token, kita tidak bisa berbuat apa-apa
          session.error = "RefreshTokenMissing";
          console.error("Gagal refresh: Refresh token tidak ditemukan di DB.");
          return session;
        }

        try {
          // 2. Minta token baru ke Google menggunakan refresh_token
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              grant_type: "refresh_token",
              refresh_token: user.googleRefreshToken,
            }),
          });

          const refreshedTokens = await response.json();
          if (!response.ok) throw refreshedTokens;

          // 3. Update database dengan token yang baru
          await prisma.user.update({
            where: { id: user.id },
            data: {
              googleAccessToken: refreshedTokens.access_token,
              googleTokenExpiry: new Date(Date.now() + refreshedTokens.expires_in * 1000),
              // Google kadang mengirim refresh token baru, update jika ada
              googleRefreshToken: refreshedTokens.refresh_token ?? user.googleRefreshToken,
            },
          });

          console.log(`Token untuk ${user.email} berhasil di-refresh.`);
          // 4. Kirim access token yang BARU ke session client
          session.accessToken = refreshedTokens.access_token;
        } catch (error) {
          console.error("Gagal melakukan refresh token:", error);
          session.error = "RefreshAccessTokenError";
        }
      } else {
        // ✅ Token masih aktif, langsung gunakan dari database
        session.accessToken = user.googleAccessToken;
      }

      // Tambahkan data lain yang dibutuhkan client
      session.user.id = user.id;
      session.user.role = user.role;

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
