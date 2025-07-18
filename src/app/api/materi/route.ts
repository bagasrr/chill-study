import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createMateriSchema } from "@/lib/validation/materi";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kelasName = searchParams.get("kelas"); // ambil query 'kelas'
  const limitRaw = searchParams.get("limit");
  const limit = limitRaw && !isNaN(Number(limitRaw)) ? parseInt(limitRaw) : undefined;

  try {
    const materi = await prisma.materi.findMany({
      where: {
        IsDeleted: null,
        kelas: {
          title: kelasName || undefined, // filter berdasarkan nama kelas
          IsDeleted: null,
        },
      },
      // select: {
      //   id: true,
      //   title: true,
      //   content: true,
      //   videoUrl: true,
      //   createdAt: true,
      //   price: true,
      //   CreatedBy: true,
      //   LastUpdatedBy: true,
      //   LastUpdateDate: true,
      //   kelas: {
      //     select: {
      //       title: true,
      //       CompanyCode: true,
      //     },
      //   },
      // },
      include: {
        kelas: {
          select: {
            title: true,
            CompanyCode: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(materi);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const body = await req.json();

    // Pastikan skema validasi (createMateriSchema) sesuai dengan payload baru
    // Anda mungkin perlu memperbaruinya di lib/validation/materi.ts
    const parsed = createMateriSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Validation Errors:", parsed.error.flatten());
      return NextResponse.json({ message: "Data tidak valid.", errors: parsed.error.flatten() }, { status: 400 });
    }

    // Ambil data yang sudah divalidasi, termasuk 'contents'
    const { title, content, price, kelasId, contents } = parsed.data;

    // Gunakan "nested write" untuk membuat Materi dan MateriContent sekaligus
    const materi = await prisma.materi.create({
      data: {
        title,
        content,
        price,
        kelasId,
        // Properti default
        CreatedBy: email || "system",
        LastUpdatedBy: email || "system",
        LastUpdateDate: new Date(),
        CompanyCode: "Materi",
        Status: 1,

        // Bagian ini akan membuat record MateriContent yang terhubung
        contents: {
          create: contents?.map((item) => ({
            type: item.type, // "VIDEO" atau "PDF"
            title: item.title, // "Judul Item"
            url: item.url, // URL video atau PDF dari Supabase
            weight: item.weight, // Bobot item (misal: 50)
          })),
        },
      },
      // Sertakan contents dalam respons untuk verifikasi
      include: {
        contents: true,
      },
    });

    return NextResponse.json(materi, { status: 201 });
  } catch (error) {
    console.error("Error creating materi:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
