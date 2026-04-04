import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import MenuPreviewSection from '../components/MenuPreviewSection';
import ReserveSection from '../components/ReserveSection';

export default function Landing() {
  return (
    <div className="bg-[#0B1220]">
      <HeroSection />
      <MenuPreviewSection />
      <FeaturesSection />
      <ReserveSection />
      <Footer />
    </div>
  );
}
