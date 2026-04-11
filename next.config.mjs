/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/sell',
        destination: '/listings/create',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
