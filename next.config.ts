import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Hides route/build indicators in dev — production never shows these */
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/observatory/cinematic",
        destination: "/observatory",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Chrome can serve stale HTML after deploy — revalidate document, keep hashed assets cached
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
