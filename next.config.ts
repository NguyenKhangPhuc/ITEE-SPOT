import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cho phép Next.js tải ảnh từ IP nội bộ
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1', // Thay vì localhost, hãy dùng IP cụ thể
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
