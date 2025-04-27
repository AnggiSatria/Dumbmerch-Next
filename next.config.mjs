/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "192.168.1.41",
      "192.168.1.13",
      "b65f-36-70-110-159",
      "b65f-36-70-110-159.ngrok-free.app",
      "http://localhost:3000/uploads",
    ],
  },
  experimental: {
    appDir: true, // ← Tambahkan ini supaya Next.js tahu kamu pakai App Router!
  },
};

export default nextConfig;
