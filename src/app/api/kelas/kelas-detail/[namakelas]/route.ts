// // file: /api/kelas/kelas-detail/[namakelas]/route.ts

// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function GET(req: Request, { params }: { params: { namakelas: string } }) {
//   const session = await getServerSession(authOptions);
//   // Jika butuh info user, pastikan user login
//   if (!session?.user) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const { namakelas } = params;
//   const userId = session.user.id;
//   const userRole = session.user.role;

//   try {
//     const kelas = await prisma.kelas.findFirst({
//       where: {
//         CompanyCode: namakelas,
//         IsDeleted: null,
//       },
//       // Select tidak perlu diubah, karena sudah lengkap
//       select: {
//         id: true,
//         title: true,
//         deskripsi: true,
//         thumbnail: true,
//         CompanyCode: true,
//         materi: {
//           where: { IsDeleted: null },
//           select: {
//             id: true,
//             title: true,
//             price: true,
//             content: true,
//             contents: {
//               // Pastikan ini tetap ada
//               select: {
//                 id: true,
//                 type: true,
//                 title: true,
//                 weight: true,
//                 url: true,
//               },
//             },
//           },
//           orderBy: {
//             createdAt: "asc",
//           },
//         },
//       },
//     });

//     if (!kelas) {
//       return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 });
//     }

//     // --- LOGIKA TAMBAHAN DARI API MATERI-USER ---
//     const materiIds = kelas.materi.map((m) => m.id);

//     const paidItems = await prisma.paymentItem.findMany({
//       where: { payment: { userId, status: "PAID" }, materiId: { in: materiIds } },
//       select: { materiId: true },
//     });

//     // Asumsi: model Progress Anda punya relasi ke Materi (materiId)
//     // Jika tidak, sesuaikan dengan skema Anda
//     const progress = await prisma.progress.findMany({
//       where: { userId, materiContent: { materiId: { in: materiIds } } },
//       select: { materiContent: { select: { materiId: true } } },
//       distinct: ["materiContentId"], // Ambil progress unik per materi
//     });

//     const paidMateriIds = new Set(paidItems.map((p) => p.materiId));
//     // Dapatkan ID materi yang unik dari progress
//     const accessedMateriIds = new Set(progress.map((p) => p.materiContent.materiId));

//     // Tambahkan properti canAccess dan hasProgress ke setiap materi
//     const materiWithAccess = kelas.materi.map((m) => {
//       const hasProgress = accessedMateriIds.has(m.id);
//       const hasPaid = paidMateriIds.has(m.id) || userRole === "ADMIN";
//       const canAccess = hasProgress || hasPaid || m.price === 0;

//       return {
//         ...m,
//         canAccess,
//         hasProgress,
//       };
//     });
//     // --- AKHIR LOGIKA TAMBAHAN ---

//     // Kembalikan objek kelas dengan materi yang sudah diperkaya
//     return NextResponse.json({ ...kelas, materi: materiWithAccess });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// file: /api/kelas/kelas-detail/[namakelas]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { namakelas: string } }) {
  const session = await getServerSession(authOptions);

  const { namakelas } = params;

  try {
    const kelas = await prisma.kelas.findFirst({
      where: {
        CompanyCode: namakelas,
        IsDeleted: null,
      },
      select: {
        id: true,
        title: true,
        deskripsi: true,
        thumbnail: true,
        CompanyCode: true,
        materi: {
          where: { IsDeleted: null },
          select: {
            id: true,
            title: true,
            price: true,
            content: true,
            contents: {
              select: {
                id: true,
                type: true,
                title: true,
                weight: true,
                url: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!kelas) {
      return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 });
    }

    // --- LOGIKA TAMBAHAN DARI API MATERI-USER ---
    const materiIds = kelas.materi.map((m) => m.id);

    let userId: string | null = null; // Menambahkan tipe string | null
    let userRole: string | null | undefined = null; // Menambahkan tipe string | null

    if (session?.user) {
      userId = session.user.id;
      userRole = session.user.role;
    }

    // Memberikan tipe eksplisit pada paidItems dan progress
    let paidItems: { materiId: string }[] = [];
    let progress: { materiContent: { materiId: string } }[] = [];

    // Hanya ambil data paidItems dan progress jika user login
    if (userId) {
      paidItems = await prisma.paymentItem.findMany({
        where: { payment: { userId, status: "PAID" }, materiId: { in: materiIds } },
        select: { materiId: true },
      });

      progress = await prisma.progress.findMany({
        where: { userId, materiContent: { materiId: { in: materiIds } } },
        select: { materiContent: { select: { materiId: true } } },
        distinct: ["materiContentId"],
      });
    }

    const paidMateriIds = new Set(paidItems.map((p) => p.materiId));
    // Perhatikan bahwa progress.map((p) => p.materiContent.materiId) adalah benar
    const accessedMateriIds = new Set(progress.map((p) => p.materiContent.materiId));

    const materiWithAccess = kelas.materi.map((m) => {
      const hasProgress = userId ? accessedMateriIds.has(m.id) : false;
      const hasPaid = userId ? paidMateriIds.has(m.id) || userRole === "ADMIN" : false;
      const canAccess = hasProgress || hasPaid || m.price === 0;

      return {
        ...m,
        canAccess,
        hasProgress,
      };
    });
    // --- AKHIR LOGIKA TAMBAHAN ---

    return NextResponse.json({ ...kelas, materi: materiWithAccess });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
