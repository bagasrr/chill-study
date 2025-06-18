// File: app/api/progress/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function POST(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   // 1. Harapkan `materiContentId`, bukan `materiId`.
//   const { materiContentId } = await req.json();
//   const userId = session.user.id;

//   if (!materiContentId) {
//     return NextResponse.json({ message: "materiContentId is required" }, { status: 400 });
//   }

//   try {
//     // 2. Ambil data dari MateriContent, bukan Materi.
//     const contentItem = await prisma.materiContent.findUnique({
//       where: { id: materiContentId },
//       include: {
//         materi: true, // Sertakan data materi induk untuk validasi harga/kelas
//       },
//     });

//     if (!contentItem || !contentItem.materi) {
//       return NextResponse.json({ message: "Content item not found" }, { status: 404 });
//     }

//     const { materi } = contentItem;

//     // 3. Lakukan validasi akses berdasarkan materi induk.
//     // Jika materi berbayar, cek apakah user sudah terdaftar di kelasnya.
//     if (materi.price > 0) {
//       const enrollment = await prisma.kelasUser.findUnique({
//         where: {
//           userId_kelasId: {
//             userId,
//             kelasId: materi.kelasId,
//           },
//         },
//       });

//       if (!enrollment) {
//         return NextResponse.json(
//           { message: "You must be enrolled to access this content." },
//           { status: 403 } // 403 Forbidden lebih cocok
//         );
//       }
//     }

//     // 4. Gunakan `upsert` pada tabel Progress dengan relasi yang benar.
//     // `upsert` akan membuat record baru jika belum ada, atau tidak melakukan apa-apa jika sudah ada.
//     // Ini aman dan efisien.
//     await prisma.progress.upsert({
//       where: {
//         // Gunakan unique identifier yang benar dari skema Prisma Anda
//         userId_materiContentId: {
//           userId,
//           materiContentId,
//         },
//       },
//       update: {
//         // Anda bisa update `completedAt` di sini jika perlu,
//         // tapi untuk "save" awal, cukup pastikan record ada.
//       },
//       create: {
//         userId,
//         materiContentId,
//         // Tambahkan field default lain jika ada di model Anda
//       },
//     });

//     return NextResponse.json({ message: "Progress saved successfully." });
//   } catch (error) {
//     console.error("🔥 Error in progress API:", error);
//     // Cek jika error karena relasi, ini sering terjadi
//     if (error instanceof Error && error.message.includes("Foreign key constraint failed")) {
//       return NextResponse.json({ message: "Invalid data relation. Check IDs." }, { status: 400 });
//     }
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

// File: app/api/progress/route.ts (Versi Final dengan Aturan Akses Lengkap)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { materiContentId } = await req.json();
  const userId = session.user.id;
  const userRole = session.user.role; // Ambil role user dari sesi

  if (!materiContentId) {
    return NextResponse.json({ message: "materiContentId is required" }, { status: 400 });
  }

  try {
    const contentItem = await prisma.materiContent.findUnique({
      where: { id: materiContentId },
      include: {
        materi: true, // Sertakan materi induk untuk cek harga dan kelasId
      },
    });

    if (!contentItem || !contentItem.materi) {
      return NextResponse.json({ message: "Content item not found" }, { status: 404 });
    }

    const { materi } = contentItem;

    // --- LOGIKA AKSES DAN PENDAFTARAN OTOMATIS ---

    // 1. Cek dulu apakah user sudah terdaftar di kelas ini
    const enrollment = await prisma.kelasUser.findUnique({
      where: {
        userId_kelasId: {
          userId,
          kelasId: materi.kelasId,
        },
      },
    });

    // Definisikan flag untuk hak akses
    let hasAccess = false;

    // Aturan #1: ADMIN selalu punya akses
    if (userRole === "ADMIN") {
      hasAccess = true;
    }
    // Aturan #2: Kelas gratis selalu bisa diakses
    else if (materi.price === 0) {
      hasAccess = true;
    }
    // Aturan #3: Untuk kelas berbayar, user harus sudah terdaftar (misal, setelah proses pembayaran)
    else if (enrollment) {
      hasAccess = true;
    }

    // Jika user TIDAK punya akses, tolak.
    if (!hasAccess) {
      return NextResponse.json(
        { message: "You do not have permission to access this content." },
        { status: 403 } // 403 Forbidden
      );
    }

    // Jika user PUNYA akses, TAPI BELUM terdaftar di KelasUser, daftarkan sekarang.
    // Ini menangani kasus ADMIN dan Kelas Gratis yang mengakses untuk pertama kali.
    if (hasAccess && !enrollment) {
      await prisma.kelasUser.create({
        data: {
          userId,
          kelasId: materi.kelasId,
          CreatedBy: session.user.email || "system",
          CompanyCode: "KelasUser-AutoEnroll",
          Status: 1,
        },
      });
      console.log(`User ${userId} automatically enrolled to class ${materi.kelasId} based on access rules.`);
    }

    // --- AKHIR LOGIKA AKSES ---

    // Setelah semua validasi dan pendaftaran otomatis selesai, simpan progress.
    await prisma.progress.upsert({
      where: {
        userId_materiContentId: {
          userId,
          materiContentId,
        },
      },
      update: {},
      create: {
        userId,
        materiContentId,
      },
    });

    return NextResponse.json({ message: "Progress saved successfully." });
  } catch (error) {
    console.error("🔥 Error in progress API:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
