import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { PaymentProviderWrapper } from '@/components/layout/payment-provider-wrapper';
import { HolidayPaymentAlert } from '@/components/layout/holiday-payment-alert';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PaymentProviderWrapper>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
        <HolidayPaymentAlert />
      </div>
    </PaymentProviderWrapper>
  );
}
