import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default:  'Craftpack Solution — Premium Paper Bags & Packaging',
    template: '%s | Craftpack Solution',
  },
  description:
    'Ethiopia\'s leading paper bag and packaging manufacturer. Custom printed bags, eco-friendly packaging, and bulk manufacturing for enterprises, hotels, cafes, and retailers in Addis Ababa.',
  keywords: [
    'paper bags Ethiopia',
    'packaging manufacturer Addis Ababa',
    'custom printed bags',
    'eco friendly packaging',
    'wholesale paper bags',
    'kraft paper bags',
    'luxury packaging',
    'Craftpack Solution',
  ],
  authors:   [{ name: 'Craftpack Solution', url: 'https://craftpacksolution.com' }],
  creator:   'Craftpack Solution',
  publisher: 'Craftpack Solution',
  robots:    { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type:     'website',
    locale:   'en_ET',
    url:      'https://craftpacksolution.com',
    siteName: 'Craftpack Solution',
    title:    'Craftpack Solution — Premium Paper Bags & Packaging',
    description: 'Ethiopia\'s leading paper bag and packaging manufacturer.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Craftpack Solution — Premium Paper Bags & Packaging',
    description: 'Ethiopia\'s leading paper bag and packaging manufacturer.',
    images:      ['/og-image.jpg'],
  },
  icons: {
    icon:  '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#228b55',
  width:      'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="bg-[#faf8f4] dark:bg-[#111110] text-zinc-900 dark:text-white antialiased transition-colors duration-300">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(25, 8%, 9%)',
                color:      '#fff',
                border:     '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize:   '14px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
