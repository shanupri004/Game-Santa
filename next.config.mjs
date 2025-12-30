/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",                 // ⭐ REQUIRED

  basePath: "/Game-Santa",   // ⭐ REPO NAME
  assetPrefix: "/Game-Santa",

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
