/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "192.168.1.41",
      "192.168.1.13",
      "b65f-36-70-110-159",
      "b65f-36-70-110-159.ngrok-free.app",
      "http://localhost:5000/uploads",
    ],
  },
};

export default nextConfig;
