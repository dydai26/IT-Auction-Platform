import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://it-auction-platform.vercel.app';
  const lang = resolvedParams.lang;
  
  const title = lang === 'en' ? "IT Auction - Secure Platform" : 
                lang === 'zh' ? "IT 拍卖 - 安全平台" : 
                "ІТ - Безпечний Аукціон";
  
  const description = lang === 'en' ? "Exclusive real-time IT equipment auctions" : 
                      lang === 'zh' ? "独家实时 IT 设备拍卖" : 
                      "Ексклюзивні аукціони техніки в реальному часі";

  return {
    title,
    description,
    keywords: "аукціон, IT, техніка, auction, equipment, bids",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'uk-UA': `${baseUrl}/uk`,
        'en-US': `${baseUrl}/en`,
        'zh-CN': `${baseUrl}/zh`,
        'ru-RU': `${baseUrl}/ru`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}`,
      siteName: 'IT Auction Platform',
      images: [
        {
          url: '/baner.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/baner.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const resolvedParams = await params;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'IT Auction Platform',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://it-auction-platform.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://it-auction-platform.vercel.app'}/${resolvedParams.lang}/auctions?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang={resolvedParams.lang}>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
