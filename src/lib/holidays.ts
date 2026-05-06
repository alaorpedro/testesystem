import type { InvestmentPayment } from '@/lib/payment-store';

export type Holiday = {
  date: string;
  name: string;
  type: 'nacional' | 'ponto facultativo';
};

export const BRAZIL_HOLIDAYS_2026: Holiday[] = [
  { date: '2026-01-01', name: 'Confraternização Universal', type: 'nacional' },
  { date: '2026-02-16', name: 'Carnaval', type: 'ponto facultativo' },
  { date: '2026-02-17', name: 'Carnaval', type: 'ponto facultativo' },
  { date: '2026-04-03', name: 'Sexta-feira Santa', type: 'nacional' },
  { date: '2026-04-21', name: 'Tiradentes', type: 'nacional' },
  { date: '2026-05-01', name: 'Dia do Trabalhador', type: 'nacional' },
  { date: '2026-06-04', name: 'Corpus Christi', type: 'ponto facultativo' },
  { date: '2026-09-07', name: 'Independência do Brasil', type: 'nacional' },
  { date: '2026-10-12', name: 'Nossa Senhora Aparecida', type: 'nacional' },
  { date: '2026-11-02', name: 'Finados', type: 'nacional' },
  { date: '2026-11-15', name: 'Proclamação da República', type: 'nacional' },
  { date: '2026-11-20', name: 'Consciência Negra', type: 'nacional' },
  { date: '2026-12-25', name: 'Natal', type: 'nacional' },
];

function parseISODate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toISODate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getTodayISO(): string {
  return toISODate(new Date());
}

export function formatDateBR(date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

export function getHoliday(date: string): Holiday | undefined {
  return BRAZIL_HOLIDAYS_2026.find((holiday) => holiday.date === date);
}

export function isHoliday(date: string): boolean {
  return Boolean(getHoliday(date));
}

export function isWeekend(date: string): boolean {
  const weekday = parseISODate(date).getDay();
  return weekday === 0 || weekday === 6;
}

export function previousBusinessDay(date: string): string {
  const current = parseISODate(date);

  do {
    current.setDate(current.getDate() - 1);
  } while (isWeekend(toISODate(current)) || isHoliday(toISODate(current)));

  return toISODate(current);
}

export function getUpcomingHolidays(fromDate = getTodayISO(), daysAhead = 45): Holiday[] {
  const from = parseISODate(fromDate);
  const until = new Date(from);
  until.setDate(from.getDate() + daysAhead);
  const untilISO = toISODate(until);

  return BRAZIL_HOLIDAYS_2026.filter((holiday) => holiday.date >= fromDate && holiday.date <= untilISO);
}

export function getHolidayPaymentImpacts(payments: InvestmentPayment[], fromDate = getTodayISO(), daysAhead = 45) {
  const upcomingHolidayDates = new Set(getUpcomingHolidays(fromDate, daysAhead).map((holiday) => holiday.date));

  return payments
    .filter((payment) => upcomingHolidayDates.has(payment.date) && (payment.status === 'Pendente' || payment.status === 'Em atraso'))
    .map((payment) => {
      const holiday = getHoliday(payment.date);
      return {
        payment,
        holiday,
        sendDate: previousBusinessDay(payment.date),
      };
    })
    .filter((impact) => impact.holiday);
}
