// app/api/users/route.js

import { prisma } from '@/lib/prisma'; // Sesuaikan dengan lokasi file prisma client Anda

// Fungsi untuk mengkonversi BigInt menjadi string
function convertBigIntToString(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}

// export async function GET() {
//   try {
//     const users = await prisma.user.findMany({
//       include: {
//         profile: true,            // Menyertakan informasi profile user
//         products: true,           // Menyertakan produk-produk milik user
//         buyerTransactions: true,  // Menyertakan transaksi sebagai pembeli
//         sellerTransactions: true, // Menyertakan transaksi sebagai penjual
//         senderMessage: true,     // Menyertakan pesan yang dikirim oleh user
//         recipientMessage: true,  // Menyertakan pesan yang diterima oleh user
//       },
//     });

//     const usersWithoutBigIntError = convertBigIntToString(users);

//     return new Response(JSON.stringify(usersWithoutBigIntError), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     return new Response('Error fetching users', { status: 500 });
//   }
// }

export async function GET(req) {
  try {
    // Ambil parameter status dari query string
    const url = new URL(req.url);
    const status = url.searchParams.get('status'); // Misalnya: /api/users?status=active

    const users = await prisma.user.findMany({
      where: {
        status: status || undefined, // Filter berdasarkan status jika ada, jika tidak undefined
      },
      include: {
        profile: true,            
        products: true,           
        buyerTransactions: true,  
        sellerTransactions: true, 
        senderMessage: true,     
        recipientMessage: true,  
      },
    });

    const usersWithoutBigIntError = convertBigIntToString(users);

    return new Response(JSON.stringify(usersWithoutBigIntError), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response('Error fetching users', { status: 500 });
  }
}

