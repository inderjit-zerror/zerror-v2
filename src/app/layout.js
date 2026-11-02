import { Inter_Tight, Hanken_Grotesk } from 'next/font/google';
import SiteShell from '@/components/layout/SiteShell';
import '@/styles/base.css';
import '@/styles/layout.css';
import '@/styles/ui.css';
import '@/styles/home.css';
import '@/styles/pages.css';

// Stand-ins for the brand faces. If Alt Riviera / Roc Grotesk are installed or
// loaded (e.g. via an Adobe Fonts kit), the font stacks in base.css pick them up first.
const display = Inter_Tight({
  variable: '--font-display-fallback',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const text = Hanken_Grotesk({
  variable: '--font-text-fallback',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.zerrorstudios.com'),
  title: {
    default: 'Zerror Studios — Multidisciplinary Design Studio, Mumbai',
    template: '%s — Zerror Studios',
  },
  description:
    'Zerror is a design-led tech studio in Mumbai. Websites, custom software, eCommerce, branding, marketing and SEO, designed and built by one team since 2022.',
  openGraph: {
    title: 'Zerror Studios — Systems. Structure. Precision.',
    description: 'A design-led tech studio for founders who dream in beta.',
    url: 'https://www.zerrorstudios.com',
    siteName: 'Zerror Studios',
    locale: 'en_IN',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#0000ff',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`} data-theme="blue" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
