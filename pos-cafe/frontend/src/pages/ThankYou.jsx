import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppState } from '../context/AppStateContext';
import { downloadTicketPDF } from '../utils/generateTicketPDF';

export default function ThankYou() {
  const location = useLocation();
  const { lastPlacedOrder, clearLastPlacedOrder } = useAppState();

  const order = useMemo(() => location.state?.order || lastPlacedOrder, [lastPlacedOrder, location.state]);

  if (!order) {
    return (
      <div className="bg-[#0B1220] py-20">
        <div className="mx-auto max-w-3xl px-6">
          <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-semibold text-[#F9FAFB]">No recent order found</h1>
              <p className="mt-3 text-sm text-[#9CA3AF]">Start a new order from the menu and your confirmation will appear here.</p>
              <div className="mt-6 flex justify-center">
                <Link to="/menu">
                  <Button className="h-11 rounded-xl border-[#F59E0B] bg-[#F59E0B] px-5 text-sm text-[#0B1220] hover:bg-[#D97706]">Start new order</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1220] py-10">
      <div className="mx-auto max-w-4xl px-6">
        <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
          <CardHeader className="p-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="text-sm text-[#9CA3AF]">Order completed</p>
            <CardTitle className="mt-2 text-2xl font-semibold text-[#F9FAFB]">Thank you for your order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-4 pt-0">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-5">
                <p className="text-sm text-[#9CA3AF]">Order ID</p>
                <p className="mt-2 text-base font-medium text-[#F9FAFB]">{order.id}</p>
              </div>
              <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-5">
                <p className="text-sm text-[#9CA3AF]">Table number</p>
                <p className="mt-2 text-base font-medium text-[#F9FAFB]">{order.tableId}</p>
              </div>
              <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-5">
                <p className="text-sm text-[#9CA3AF]">Estimated preparation time</p>
                <p className="mt-2 text-base font-medium text-[#F9FAFB]">{order.estimatedPrepMinutes} minutes</p>
              </div>
            </div>

            <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-5">
              <p className="text-sm text-[#9CA3AF]">Ticket summary</p>
              <p className="mt-2 text-base text-[#F9FAFB]">
                Your order has been saved in Supabase and a PDF ticket was generated automatically. You can download it again below at any time.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                className="h-11 rounded-xl border-[#374151] bg-[#1F2937] px-5 text-sm text-[#F9FAFB] hover:bg-[#111827]"
                onClick={() => downloadTicketPDF(order)}
              >
                Download ticket
              </Button>
              <Link to={`/track-order?orderId=${order.id}`}>
                <Button variant="outline" className="h-11 rounded-lg border border-slate-600 px-5 text-sm text-white hover:bg-slate-800">
                  Track order
                </Button>
              </Link>
              <Link to="/menu" onClick={() => clearLastPlacedOrder()}>
                <Button className="h-11 rounded-lg bg-[#F59E0B] px-5 text-sm text-black hover:brightness-110">
                  Start new order
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}