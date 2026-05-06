"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockClients } from '@/lib/mock-data';
import { logActivity } from '@/lib/activity-log-store';

export type PaymentChannel = 'Meta ADS' | 'Google ADS' | 'TikTok ADS';
export type PaymentStatus = 'Pendente' | 'Enviado' | 'Pago' | 'Em atraso';
export type InvestmentPayment = {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  destination: string;
  amount: number;
  channel: PaymentChannel;
  status: PaymentStatus;
};

export const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = ['Pendente', 'Enviado', 'Pago', 'Em atraso'];
export const PAYMENT_CHANNELS: Array<PaymentChannel | 'Todos'> = ['Todos', 'Meta ADS', 'Google ADS', 'TikTok ADS'];

const STORAGE_KEY = 'onmid-investment-payments';

function makeDate(day: number): string {
  return `2026-05-${String(day).padStart(2, '0')}`;
}

function seedPayments(): InvestmentPayment[] {
  return mockClients.flatMap((client, clientIndex) => {
    const offset = clientIndex * 100;

    return [
      { id: `gp-${offset + 1}`, clientId: client.id, clientName: client.name, date: makeDate(6), destination: `${client.name} - Captação`, amount: 1000 + clientIndex * 250, channel: 'Meta ADS', status: clientIndex === 1 ? 'Pago' : 'Enviado' },
      { id: `gp-${offset + 2}`, clientId: client.id, clientName: client.name, date: makeDate(6), destination: `${client.name} - Remarketing`, amount: 500 + clientIndex * 100, channel: 'Google ADS', status: clientIndex === 2 ? 'Em atraso' : 'Pendente' },
      { id: `gp-${offset + 3}`, clientId: client.id, clientName: client.name, date: makeDate(13), destination: `${client.name} - Leads`, amount: 1750 + clientIndex * 300, channel: 'Meta ADS', status: 'Pendente' },
      { id: `gp-${offset + 4}`, clientId: client.id, clientName: client.name, date: makeDate(20), destination: `${client.name} - Escala`, amount: 3200 + clientIndex * 500, channel: clientIndex === 2 ? 'TikTok ADS' : 'Meta ADS', status: clientIndex === 0 ? 'Em atraso' : 'Pendente' },
      { id: `gp-${offset + 5}`, clientId: client.id, clientName: client.name, date: makeDate(27), destination: `${client.name} - Fundo de funil`, amount: 4275 + clientIndex * 250, channel: 'Google ADS', status: 'Pendente' },
    ];
  });
}

function readPayments(): InvestmentPayment[] {
  if (typeof window === 'undefined') return seedPayments();

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return seedPayments();

  try {
    const parsed = JSON.parse(stored) as InvestmentPayment[];
    return Array.isArray(parsed) ? parsed : seedPayments();
  } catch {
    return seedPayments();
  }
}

function fmtBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function wasDispatched(status: PaymentStatus): boolean {
  return status === 'Enviado' || status === 'Pago' || status === 'Em atraso';
}

type PaymentContextValue = {
  payments: InvestmentPayment[];
  setPayments: React.Dispatch<React.SetStateAction<InvestmentPayment[]>>;
  addPayment: (payment: Omit<InvestmentPayment, 'id'>) => void;
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
  deletePayment: (id: string) => void;
};

const PaymentContext = createContext<PaymentContextValue | null>(null);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [payments, setPayments] = useState<InvestmentPayment[]>(readPayments);

  // Auto-escalate: Enviado + date already passed → Em atraso
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setPayments((prev) => {
      const needsUpdate = prev.some((p) => p.status === 'Enviado' && p.date < today);
      if (!needsUpdate) return prev;
      return prev.map((p) =>
        p.status === 'Enviado' && p.date < today ? { ...p, status: 'Em atraso' as PaymentStatus } : p
      );
    });
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setPayments(readPayments());
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  function addPayment(payment: Omit<InvestmentPayment, 'id'>) {
    setPayments((prev) => [...prev, { ...payment, id: `pay-${Date.now()}` }]);
    const dateFormatted = payment.date.split('-').reverse().join('/');
    logActivity(
      'payment_added',
      `Pix de ${fmtBRL(payment.amount)} adicionado para ${payment.clientName} (${payment.channel}) em ${dateFormatted}`,
    );
  }

  function updatePaymentStatus(id: string, status: PaymentStatus) {
    setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
  }

  function deletePayment(id: string) {
    setPayments((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) {
        const dateFormatted = target.date.split('-').reverse().join('/');
        logActivity(
          'payment_deleted',
          `Pix de ${fmtBRL(target.amount)} de ${target.clientName} (${target.channel}) excluído do dia ${dateFormatted}`,
        );
      }
      return prev.filter((p) => p.id !== id);
    });
  }

  return React.createElement(
    PaymentContext.Provider,
    { value: { payments, setPayments, addPayment, updatePaymentStatus, deletePayment } },
    children,
  );
}

export function useInvestmentPayments(): PaymentContextValue {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('useInvestmentPayments must be used within a PaymentProvider');
  return ctx;
}
