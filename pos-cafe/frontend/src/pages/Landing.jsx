import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import MenuPreviewSection from '../components/MenuPreviewSection';
import ReserveSection from '../components/ReserveSection';
import { useAppState } from '../context/AppStateContext';

export default function Landing() {
  const { tables, catalogItems, reservations } = useAppState();

  return (
    <div className="bg-[#0B1220]">
      <HeroSection />
      <MenuPreviewSection />
      <FeaturesSection />
      <ReserveSection />
      <section className="border-b border-[#374151] bg-[#111827] py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),360px]">
            <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-4 shadow-sm">
              <p className="text-sm text-[#F59E0B]">About cafe</p>
              <h2 className="mt-2 text-xl font-medium text-[#F9FAFB]">A restaurant frontend built for service speed</h2>
              <p className="mt-4 text-sm text-[#9CA3AF]">
                Cafe POS Suite connects guests and staff in one responsive interface. QR ordering, reservations, live kitchen status, and billing all run against the existing Supabase schema.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-4 shadow-sm">
                <p className="text-sm text-[#9CA3AF]">Tables</p>
                <p className="mt-2 text-xl font-medium text-[#F9FAFB]">{tables.length}</p>
              </div>
              <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-4 shadow-sm">
                <p className="text-sm text-[#9CA3AF]">Menu items</p>
                <p className="mt-2 text-xl font-medium text-[#F9FAFB]">{catalogItems.length}</p>
              </div>
              <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-4 shadow-sm">
                <p className="text-sm text-[#9CA3AF]">Reservations</p>
                <p className="mt-2 text-xl font-medium text-[#F9FAFB]">{reservations.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-[#374151] bg-[#0B1220] py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 shadow-sm">
              <p className="text-xl font-medium text-[#F9FAFB]">Contact section</p>
              <p className="mt-3 text-sm text-[#9CA3AF]">Need booking help or support with a live order? The contact routes are integrated into the same frontend system.</p>
            </div>
            <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 shadow-sm">
              <p className="text-base font-semibold text-[#F9FAFB]">Cafe phone</p>
              <p className="mt-3 text-sm text-[#9CA3AF]">+91 98765 43210</p>
            </div>
            <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 shadow-sm">
              <p className="text-base font-semibold text-[#F9FAFB]">Email</p>
              <p className="mt-3 text-sm text-[#9CA3AF]">support@cafepossuite.com</p>
            </div>
            <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 shadow-sm">
              <p className="text-base font-semibold text-[#F9FAFB]">Opening hours</p>
              <p className="mt-3 text-sm text-[#9CA3AF]">Every day, 8:00 AM to 11:00 PM</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
