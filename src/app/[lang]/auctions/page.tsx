import Header from '@/components/Header';
import AuctionsExplorer from '@/components/AuctionsExplorer';
import Footer from '@/components/Footer';

export default async function AuctionsPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <Header />
      <main className="container-wide">
        <AuctionsExplorer />
      </main>
      <Footer lang={resolvedParams.lang} />
    </div>
  );
}
