// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { prisma } from "./prisma"; // Pastikan path ini benar
// import { randomUUID } from "crypto";
// import { NextAuthOptions, Session, User } from "next-auth";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),

//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline", // WAJIB untuk mendapatkan refresh_token
//           response_type: "code",
//         },
//       },
//     }),
//   ],

//   // 💡 Menggunakan 'database' adalah pilihan yang TEPAT untuk tujuan Anda
//   session: {
//     strategy: "database",
//     // Atur durasi sesi di database
//     maxAge: 2 * 24 * 60 * 60, // 30 hari
//     updateAge: 24 * 60 * 60, // Update setiap 24 jam
//   },

//   secret: process.env.NEXTAUTH_SECRET,

//   callbacks: {
//     /**
//      * signIn: Validasi sebelum user berhasil login.
//      * Ini adalah tempat yang tepat untuk mengunci device.
//      */
//     async signIn({ user, account }) {
//       // Pastikan ada email dan account, ini adalah langkah pengamanan pertama.
//       if (!user.email || !account) {
//         console.log("Login gagal: Email atau account tidak tersedia.");
//         return false;
//       }

//       try {
//         // Cek dulu user di database untuk validasi device lock.
//         // Langkah ini penting dilakukan SEBELUM melakukan upsert.
//         const userFromDb = await prisma.user.findUnique({
//           where: { email: user.email },
//         });

//         // 1. Validasi: Tolak login jika device lain masih aktif
//         if (userFromDb?.deviceToken && userFromDb.devTokenExpiredAt && userFromDb.devTokenExpiredAt > new Date()) {
//           console.log(`Login ditolak untuk ${user.email}: Device lain sudah aktif.`);
//           return "/auth/error?error=DeviceActive"; // Arahkan ke halaman error
//         }

//         // Siapkan data untuk device lock dan token Google
//         const deviceToken = randomUUID();
//         const devTokenExpiredAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 jam dari sekarang

//         // 2. Gunakan "UPSERT": Operasi utama yang menggabungkan CREATE dan UPDATE
//         await prisma.user.upsert({
//           where: {
//             // Kunci untuk mencari user
//             email: user.email,
//           },
//           // DATA JIKA USER DI-UPDATE (PENGGUNA LAMA)
//           update: {
//             name: user.name, // Selalu update nama & gambar jika ada perubahan dari Google
//             image: user.image,
//             deviceToken,
//             devTokenExpiredAt,
//             googleAccessToken: account.access_token,
//             googleRefreshToken: account.refresh_token,
//             googleTokenExpiry: account.expires_at ? new Date(Date.now() + account.expires_at * 1000) : null,
//           },
//           // DATA JIKA USER DIBUAT (PENGGUNA BARU)
//           create: {
//             email: user.email,
//             name: user.name,
//             image: user.image,
//             role: "STUDENT",
//             emailVerified: new Date(), // Anggap email terverifikasi karena dari Google
//             deviceToken,
//             devTokenExpiredAt,
//             googleAccessToken: account.access_token,
//             googleRefreshToken: account.refresh_token,
//             googleTokenExpiry: account.expires_at ? new Date(Date.now() + account.expires_at * 1000) : null,
//             // Anda bisa menambahkan default value untuk kolom lain di sini
//             // contoh: role: 'USER',
//           },
//         });

//         console.log(`Operasi UPSERT berhasil untuk user: ${user.email}`);

//         // Karena kita sudah menangani data user, kita juga harus menautkan Akun secara manual
//         // untuk memastikan PrismaAdapter tidak menimpanya.
//         const currentUser = await prisma.user.findUnique({ where: { email: user.email } });

//         if (currentUser) {
//           await prisma.account.upsert({
//             where: {
//               provider_providerAccountId: {
//                 provider: account.provider,
//                 providerAccountId: account.providerAccountId,
//               },
//             },
//             update: {
//               access_token: account.access_token,
//               refresh_token: account.refresh_token,
//               expires_at: account.expires_at,
//               scope: account.scope,
//               token_type: account.token_type,
//               id_token: account.id_token,
//             },
//             create: {
//               userId: currentUser.id,
//               type: account.type,
//               provider: account.provider,
//               providerAccountId: account.providerAccountId,
//               access_token: account.access_token,
//               refresh_token: account.refresh_token,
//               expires_at: account.expires_at,
//               scope: account.scope,
//               token_type: account.token_type,
//               id_token: account.id_token,
//             },
//           });
//         }

//         return true; // Izinkan login
//       } catch (error) {
//         console.error("Terjadi error kritis saat proses signIn dengan upsert:", error);
//         return `/auth/error?error=SignInFailed`; // Redirect jika ada error
//       }
//     },
//     /**
//      * session: Dipanggil setiap kali sesi diakses.
//      * INI ADALAH TEMPAT KITA MELAKUKAN REFRESH TOKEN.
//      */
//     async session({ session, user }: { session: Session; user: User }) {
//       const now = new Date();

//       // 1. Cek apakah token di database sudah kedaluwarsa
//       const isTokenExpired = user.googleTokenExpiry ? now > user.googleTokenExpiry : true;

//       if (isTokenExpired) {
//         // 🔄 Token kedaluwarsa, lakukan refresh
//         console.log(`Token untuk ${user.email} kedaluwarsa, mencoba refresh...`);
//         if (!user.googleRefreshToken) {
//           // Jika tidak ada refresh token, kita tidak bisa berbuat apa-apa
//           session.error = "RefreshTokenMissing";
//           console.error("Gagal refresh: Refresh token tidak ditemukan di DB.");
//           return session;
//         }

//         try {
//           // 2. Minta token baru ke Google menggunakan refresh_token
//           const response = await fetch("https://oauth2.googleapis.com/token", {
//             method: "POST",
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//             body: new URLSearchParams({
//               client_id: process.env.GOOGLE_CLIENT_ID!,
//               client_secret: process.env.GOOGLE_CLIENT_SECRET!,
//               grant_type: "refresh_token",
//               refresh_token: user.googleRefreshToken,
//             }),
//           });

//           const refreshedTokens = await response.json();
//           if (!response.ok) throw refreshedTokens;

//           // 3. Update database dengan token yang baru
//           await prisma.user.update({
//             where: { id: user.id },
//             data: {
//               googleAccessToken: refreshedTokens.access_token,
//               googleTokenExpiry: new Date(Date.now() + refreshedTokens.expires_in * 1000),
//               // Google kadang mengirim refresh token baru, update jika ada
//               googleRefreshToken: refreshedTokens.refresh_token ?? user.googleRefreshToken,
//             },
//           });

//           console.log(`Token untuk ${user.email} berhasil di-refresh.`);
//           // 4. Kirim access token yang BARU ke session client
//           session.access_token = refreshedTokens.access_token;
//         } catch (error) {
//           console.error("Gagal melakukan refresh token:", error);
//           session.error = "RefreshAccessTokenError";
//         }
//       } else {
//         // ✅ Token masih aktif, langsung gunakan dari database
//         session.access_token = user.googleAccessToken ?? undefined;
//       }

//       // Tambahkan data lain yang dibutuhkan client
//       session.user.id = user.id;
//       session.user.role = user.role;

//       return session;
//     },
//   },

//   pages: {
//     signIn: "/auth/signin",
//     error: "/auth/error",
//   },
// };
// auth.ts
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { randomUUID } from "crypto";
import { NextAuthOptions, Session, User } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 2 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account) {
        console.log("Login gagal: Email atau account tidak tersedia.");
        return false;
      }

      try {
        const userFromDb = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (userFromDb?.deviceToken && userFromDb.devTokenExpiredAt && userFromDb.devTokenExpiredAt > new Date()) {
          console.log(`Login ditolak untuk ${user.email}: Device lain sudah aktif.`);
          return "/auth/error?error=DeviceActive";
        }

        const deviceToken = randomUUID();
        const devTokenExpiredAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            image: user.image,
            deviceToken,
            devTokenExpiredAt,
            googleAccessToken: account.access_token,
            googleRefreshToken: account.refresh_token,
            googleTokenExpiry: account.expires_at ? new Date(Date.now() + account.expires_at * 1000) : null,
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
            role: "STUDENT",
            emailVerified: new Date(),
            deviceToken,
            devTokenExpiredAt,
            googleAccessToken: account.access_token,
            googleRefreshToken: account.refresh_token,
            googleTokenExpiry: account.expires_at ? new Date(Date.now() + account.expires_at * 1000) : null,
          },
        });

        console.log(`Operasi UPSERT berhasil untuk user: ${user.email}`);

        const currentUser = await prisma.user.findUnique({ where: { email: user.email } });

        if (currentUser) {
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            update: {
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              scope: account.scope,
              token_type: account.token_type,
              id_token: account.id_token,
            },
            create: {
              userId: currentUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              scope: account.scope,
              token_type: account.token_type,
              id_token: account.id_token,
            },
          });
        }
        return true;
      } catch (error) {
        console.error("Terjadi error kritis saat proses signIn dengan upsert:", error);
        return `/auth/error?error=SignInFailed`;
      }
    },
    async session({ session, user }: { session: Session; user: User }) {
      const now = new Date();
      const isTokenExpired = user.googleTokenExpiry ? now > user.googleTokenExpiry : true;

      if (isTokenExpired) {
        console.log(`Token untuk ${user.email} kedaluwarsa, mencoba refresh...`);
        if (!user.googleRefreshToken) {
          session.error = "RefreshTokenMissing";
          console.error("Gagal refresh: Refresh token tidak ditemukan di DB.");
          return session;
        }

        try {
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

          await prisma.user.update({
            where: { id: user.id },
            data: {
              googleAccessToken: refreshedTokens.access_token,
              googleTokenExpiry: new Date(Date.now() + refreshedTokens.expires_in * 1000),
              googleRefreshToken: refreshedTokens.refresh_token ?? user.googleRefreshToken,
            },
          });

          console.log(`Token untuk ${user.email} berhasil di-refresh.`);
          session.access_token = refreshedTokens.access_token;
        } catch (error) {
          console.error("Gagal melakukan refresh token:", error);
          session.error = "RefreshAccessTokenError";
        }
      } else {
        session.access_token = user.googleAccessToken ?? undefined;
      }
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
  },

  // auth.ts (bagian events)
  events: {
    async signOut({ session }: { session: Session }) {
      console.log("signOut event triggered!");
      const adapterSession = session as { userId?: string };

      if (adapterSession.userId) {
        console.log(`Attempting to clear deviceToken for userId: ${adapterSession.userId}`);
        const userIdFromSession = adapterSession.userId;
        try {
          const updatedUser = await prisma.user.update({
            where: { id: userIdFromSession },
            data: { deviceToken: null, devTokenExpiredAt: null },
          });
          console.log(`deviceToken for userId ${userIdFromSession} successfully cleared. Updated user:`, updatedUser);
        } catch (error) {
          console.error("CRITICAL ERROR: Failed to clear deviceToken during signOut event:", error);
          if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
          }
        }
      } else {
        console.log("signOut event triggered, but no userId found directly in session object. Session object:", session);
      }
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
