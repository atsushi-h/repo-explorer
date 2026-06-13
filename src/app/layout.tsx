import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { PageHeaderPresenter } from '@/shared/components/layout/PageHeader/PageHeaderPresenter'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'GitHub リポジトリ検索',
  description: 'GitHub 上の公開リポジトリを検索できます',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <div className="flex h-full flex-col">
          <Suspense fallback={<PageHeaderPresenter href="/" />}>
            <PageHeader />
          </Suspense>
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </body>
    </html>
  )
}
