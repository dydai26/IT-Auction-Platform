import React from 'react';
import AuctionDetail from './AuctionDetail';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function Page({ params }: { params: Promise<{ id: string, lang: string }> }) {
  const resolvedParams = await params;
  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <Header />
      <AuctionDetail id={resolvedParams.id} />
      <Footer lang={resolvedParams.lang} />
    </div>
  );
}
