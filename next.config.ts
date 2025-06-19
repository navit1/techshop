import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Экспорт как статический сайт
  typescript: {
    ignoreBuildErrors: true, // Опционально: игнорировать ошибки TypeScript при сборке
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'https://9000-firebase-studio-1746856088333.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev',
    ],
  },
  serverComponentsExternalPackages: [
      '@opentelemetry/api',
      '@opentelemetry/sdk-trace-node',
      '@opentelemetry/context-async-hooks',
      // Add other OpenTelemetry packages if needed
  ],
};

export default nextConfig;
