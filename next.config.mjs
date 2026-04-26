/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "sxwmeoujphvnnxggiqzp.supabase.co" },
      { protocol: "https", hostname: "**" },
    ],
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      {
        source: "/guia/shows-en-espanol-las-vegas",
        destination: "/guia/mejores-shows-las-vegas",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
