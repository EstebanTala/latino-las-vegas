/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sxwmeoujphvnnxggiqzp.supabase.co",
      },
    ],
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
      {
        source: '/restaurantes',
        destination: '/explorar?cat=restaurantes',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
