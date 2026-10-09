const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '**.blob.vercel-storage.com',
      },
    ],
  },
  // Increase body size limit for file uploads (500 MB)
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
  async redirects() {
    return [
      // Legacy standalone therapy URLs to homepage therapies section
      {
        source: '/speech-therapy',
        destination: '/#therapies',
        permanent: true,
      },
      {
        source: '/occupational-therapy',
        destination: '/#therapies',
        permanent: true,
      },
      {
        source: '/special-education',
        destination: '/#therapies',
        permanent: true,
      },
      {
        source: '/aba-therapy',
        destination: '/#therapies',
        permanent: true,
      },
      {
        source: '/physiotherapy',
        destination: '/#therapies',
        permanent: true,
      },
      {
        source: '/parent-guidance',
        destination: '/#therapies',
        permanent: true,
      },
      {
        source: '/sensory-integration',
        destination: '/#therapies',
        permanent: true,
      },
      {
        source: '/clinical-psychology',
        destination: '/#therapies',
        permanent: true,
      },
      {
        source: '/school-readiness',
        destination: '/#therapies',
        permanent: true,
      },
      // Nested legacy therapies routes
      {
        source: '/therapies',
        destination: '/#therapies',
        permanent: true,
      },
      {
        source: '/therapies/:slug',
        destination: '/#therapies',
        permanent: true,
      },
      // Legacy standalone condition URLs to homepage conditions section
      {
        source: '/autism',
        destination: '/#conditions',
        permanent: true,
      },
      {
        source: '/adhd',
        destination: '/#conditions',
        permanent: true,
      },
      {
        source: '/down-syndrome',
        destination: '/#conditions',
        permanent: true,
      },
      {
        source: '/cerebral-palsy',
        destination: '/#conditions',
        permanent: true,
      },
      {
        source: '/dyslexia',
        destination: '/#conditions',
        permanent: true,
      },
      // Nested legacy conditions routes
      {
        source: '/conditions',
        destination: '/#conditions',
        permanent: true,
      },
      {
        source: '/conditions/:slug',
        destination: '/#conditions',
        permanent: true,
      },
      // Top-level section aliases
      {
        source: '/about',
        destination: '/#about',
        permanent: true,
      },
      {
        source: '/appointment',
        destination: '/#appointment',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/#appointment',
        permanent: true,
      },
      {
        source: '/media',
        destination: '/#gallery',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent MIME type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Control referrer information
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restrict browser features and APIs
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // XSS protection (legacy but still useful)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;