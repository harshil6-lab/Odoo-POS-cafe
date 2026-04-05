import HeroSection from '../components/HeroSection';
import FloatingFood from '../components/FloatingFood';
import FeaturesGrid from '../components/FeaturesGrid';
import StatsSection from '../components/StatsSection';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';

export default function Landing() {
  return (
    <PageWrapper className="relative z-0 bg-background">
      <HeroSection />
      <div className="relative h-96 pointer-events-none">
        <FloatingFood />
      </div>
      <section className="relative z-10"><FeaturesGrid /></section>
      <section className="relative z-10"><StatsSection /></section>
      <section className="relative z-10"><Footer /></section>
    </PageWrapper>
  );
}
