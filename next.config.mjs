/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  allowedDevOrigins: ['192.168.2.19'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable all problematic checks and compilation features
  swcMinify: false,
  skipTrailingSlashRedirect: true,
  experimental: {
    // Disable SWC completely for CI builds
    forceSwcTransforms: false,
  },
}

export default nextConfig
