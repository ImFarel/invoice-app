/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  output: 'standalone',
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/invoices',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
