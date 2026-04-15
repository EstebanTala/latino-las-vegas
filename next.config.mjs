/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: undefined,
  async redirects() {
    return [
      {
        source: '/guia/shows-en-espanol-las-vegas',
        destination: '/guia/mejores-shows-las-vegas',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
