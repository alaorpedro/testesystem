"use client";

import { PaymentProvider } from '@/lib/payment-store';

export function PaymentProviderWrapper({ children }: { children: React.ReactNode }) {
  return <PaymentProvider>{children}</PaymentProvider>;
}
