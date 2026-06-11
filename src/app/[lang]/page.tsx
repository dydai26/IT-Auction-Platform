import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import PopularLots from '@/components/PopularLots';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <Header />
      <HeroSection lang={resolvedParams.lang} />
      <main className="container">
        <PopularLots />
        <FaqSection />
      </main>
      <Footer lang={resolvedParams.lang} />
    </div>
  );
}
