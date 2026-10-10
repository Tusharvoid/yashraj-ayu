import type { NextConfig } from 'next'

const staticBuild = process.env.YASHRAJ_STATIC_BUILD === '1'

const nextConfig: NextConfig = {
  output: staticBuild ? 'export' : 'standalone',
  ...(staticBuild
    ? { trailingSlash: true }
    : { async rewrites() {
        return [{ source: '/ayurveda', destination: '/ayurveda/index.html' }]
      } }),
  turbopack: {
    root: process.env.YASHRAJ_BUILD_ROOT || process.cwd(),
  },
  // pg loads pg-cloudflare only under the "workerd" export condition, which Next's
  // file tracer (Node conditions) skips — include it so the OpenNext bundle resolves.
  outputFileTracingIncludes: {
    '/*': ['./node_modules/pg-cloudflare/**/*'],
  },
  images: {
    unoptimized: staticBuild,
    remotePatterns: [
      { protocol: 'https', hostname: 'yashrajclinic.com' },
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'hips.hearstapps.com' },
    ],
  },
}

export default nextConfig
