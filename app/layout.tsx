import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GIM Прогноз',
  description: 'Веб-интерфейс для просмотра прогнозов GIM карт',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
} 