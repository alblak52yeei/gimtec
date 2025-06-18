/** @type {import('next').NextConfig} */
const nextConfig = {
  // Включаем standalone для Docker
  output: 'standalone',
  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '10.0.6.178',
        port: '8088',
        pathname: '/get_forecast_image/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8088',
        pathname: '/get_forecast_image/**',
      },
    ],
  },
  
  // Отключаем strict mode для лучшей совместимости
  reactStrictMode: false,
  
  // Настройка для обработки внешних доменов
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  }
}

module.exports = nextConfig 