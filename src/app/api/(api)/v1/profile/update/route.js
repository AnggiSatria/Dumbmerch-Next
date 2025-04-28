// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import fs from "fs";
// import path from "path";
// import { getTokenFromCookie } from "@/lib/auth";
// import { uploadToCloudinary } from "@/lib/cloudinary";

// export async function PUT(req) {
//   try {
//     const authHeader = req.headers.get("authorization");

//     if (!authHeader) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1]; // Ambil token setelah "Bearer"

//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.SECRET_KEY);
//     } catch (error) {
//       return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
//     }

//     const userId = decoded.id;

//     // Ambil form data dari request
//     const formData = await req.formData();
//     const phone = formData.get("phone");
//     const gender = formData.get("gender");
//     const address = formData.get("address");
//     const imageFile = formData.get("image");

//     // Cek apakah profile sudah ada
//     let profile = await prisma.profile.findUnique({
//       where: {
//         idUser: userId,
//       },
//     });

//     let image = "";

//     // Jika ada file gambar, simpan gambar di server
//     if (imageFile) {
//       const buffer = Buffer.from(await imageFile.arrayBuffer());
//       const uploadsDir = path.join(process.cwd(), "public", "uploads");

//       // Pastikan direktori uploads ada
//       if (!fs.existsSync(uploadsDir)) {
//         fs.mkdirSync(uploadsDir, { recursive: true });
//       }

//       const timestamp = Date.now();
//       const ext = path.extname(imageFile.name);
//       const safeName = `${timestamp}-${imageFile.name}`.replace(/\s+/g, "-");
//       const filePath = path.join(uploadsDir, safeName);

//       // Menyimpan file gambar ke server
//       fs.writeFileSync(filePath, buffer);
//       image = safeName;
//     }

//     // Jika profile tidak ada, buat profile baru
//     if (!profile) {
//       profile = await prisma.profile.create({
//         data: {
//           idUser: userId,
//           phone: phone || null,
//           gender: gender || null,
//           address: address || null,
//           image: image || null,
//         },
//       });
//       return NextResponse.json({
//         status: "Profile Created",
//         data: { profile },
//       });
//     }

//     // Jika profile ada, update profile
//     const updatedProfile = await prisma.profile.update({
//       where: {
//         idUser: userId,
//       },
//       data: {
//         phone: phone || undefined,
//         gender: gender || undefined,
//         address: address || undefined,
//         image: image || profile.image, // Jaga agar gambar lama tetap jika tidak ada gambar baru
//       },
//     });

//     return NextResponse.json({
//       status: "Success",
//       data: {
//         profile: updatedProfile,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: "Server Error" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function PUT(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1]; // Ambil token setelah "Bearer"

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
    }

    const userId = decoded.id;

    // Ambil form data dari request
    const formData = await req.formData();
    const phone = formData.get("phone");
    const gender = formData.get("gender");
    const address = formData.get("address");
    const imageFile = formData.get("image");

    // Cek apakah profile sudah ada
    let profile = await prisma.profile.findUnique({
      where: {
        idUser: userId,
      },
    });

    let image = "";

    // Jika ada file gambar, upload ke Cloudinary
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const timestamp = Date.now();
      const safeName = `${timestamp}-${imageFile.name}`.replace(/\s+/g, "-");

      // Upload gambar ke Cloudinary
      const uploadResult = await uploadToCloudinary(buffer, safeName);
      image = uploadResult.secure_url; // URL gambar dari Cloudinary
    }

    // Jika profile tidak ada, buat profile baru
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          idUser: userId,
          phone: phone || null,
          gender: gender || null,
          address: address || null,
          image: image || null,
        },
      });
      return NextResponse.json({
        status: "Profile Created",
        data: { profile },
      });
    }

    // Jika profile ada, update profile
    const updatedProfile = await prisma.profile.update({
      where: {
        idUser: userId,
      },
      data: {
        phone: phone || undefined,
        gender: gender || undefined,
        address: address || undefined,
        image: image || profile.image, // Jaga agar gambar lama tetap jika tidak ada gambar baru
      },
    });

    return NextResponse.json({
      status: "Success",
      data: {
        profile: updatedProfile,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
