import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/inventory', destination: '/crm/inventory', permanent: false },
      { source: '/admin', destination: '/crm/admin', permanent: false },
      { source: '/admin/:path*', destination: '/crm/admin/:path*', permanent: false },
      { source: '/cotizador', destination: '/crm/cotizador', permanent: false },
      { source: '/cotizador/:path*', destination: '/crm/cotizador/:path*', permanent: false },
      { source: '/proformas', destination: '/crm/proformas', permanent: false },
      { source: '/proformas/:path*', destination: '/crm/proformas/:path*', permanent: false },
    ];
  },
};

export default nextConfig;
