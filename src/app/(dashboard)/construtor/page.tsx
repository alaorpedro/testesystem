"use client";

import { useState } from 'react';
import { Plus, X, BarChart2, TrendingUp, Layers, Hash, Check } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { cn, formatCurrencyBRL } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────
type DataSource = 'meta' | 'crm';
type ChartType = 'kpi' | 'bar' | 'line' | 'area';
type Period = '7d' | '30d' | '90d';
type WidgetSize = 1 | 2 | 3;

type DataPoint = {
  label: string;
  ml: number; sp: number; im: number;           // Meta
  ql: number; ag: number; cv: number; rv: number; // CRM
  mg: number; ld: number; ou: number;            // Cidades
};

type MetricDef = {
  key: string;
  source: DataSource;
  group: string;
  label: string;
  dataKey: keyof DataPoint | null;
  kpiCompute: (data: DataPoint[]) => number;
  format: 'number' | 'currency' | 'percent' | 'times';
  color: string;
};

type Widget = {
  id: string;
  title: string;
  metrics: string[];
  chartType: ChartType;
  size: WidgetSize;
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const DATA: Record<Period, DataPoint[]> = {
  '7d': [
    { label: 'Seg', ml: 9,  sp: 140, im: 3800, ql: 5,  ag: 3,  cv: 1, rv: 1800,  mg: 5,  ld: 3,  ou: 1  },
    { label: 'Ter', ml: 11, sp: 155, im: 4100, ql: 6,  ag: 4,  cv: 1, rv: 2200,  mg: 7,  ld: 3,  ou: 1  },
    { label: 'Qua', ml: 8,  sp: 135, im: 3500, ql: 5,  ag: 3,  cv: 1, rv: 1600,  mg: 5,  ld: 2,  ou: 1  },
    { label: 'Qui', ml: 13, sp: 165, im: 4500, ql: 8,  ag: 5,  cv: 2, rv: 4000,  mg: 8,  ld: 4,  ou: 1  },
    { label: 'Sex', ml: 15, sp: 170, im: 5000, ql: 9,  ag: 6,  cv: 2, rv: 4500,  mg: 9,  ld: 4,  ou: 2  },
    { label: 'Sáb', ml: 10, sp: 145, im: 3800, ql: 6,  ag: 4,  cv: 1, rv: 2000,  mg: 6,  ld: 3,  ou: 1  },
    { label: 'Dom', ml: 7,  sp: 130, im: 3200, ql: 4,  ag: 2,  cv: 1, rv: 1400,  mg: 4,  ld: 2,  ou: 1  },
  ],
  '30d': [
    { label: 'Sem 1', ml: 60,  sp: 900,  im: 24000, ql: 36, ag: 22, cv: 8,  rv: 16000, mg: 36, ld: 18, ou: 6  },
    { label: 'Sem 2', ml: 80,  sp: 1100, im: 30000, ql: 47, ag: 30, cv: 11, rv: 22000, mg: 48, ld: 22, ou: 10 },
    { label: 'Sem 3', ml: 95,  sp: 1250, im: 36000, ql: 57, ag: 36, cv: 13, rv: 26000, mg: 57, ld: 28, ou: 10 },
    { label: 'Sem 4', ml: 107, sp: 1570, im: 45000, ql: 65, ag: 42, cv: 15, rv: 30000, mg: 64, ld: 32, ou: 11 },
  ],
  '90d': [
    { label: 'S1',  ml: 55,  sp: 820,  im: 22000, ql: 33, ag: 20, cv: 7,  rv: 13000, mg: 33, ld: 16, ou: 6  },
    { label: 'S2',  ml: 60,  sp: 870,  im: 24000, ql: 36, ag: 22, cv: 8,  rv: 14500, mg: 36, ld: 18, ou: 6  },
    { label: 'S3',  ml: 62,  sp: 900,  im: 25000, ql: 37, ag: 23, cv: 8,  rv: 15000, mg: 37, ld: 19, ou: 6  },
    { label: 'S4',  ml: 68,  sp: 950,  im: 27000, ql: 40, ag: 25, cv: 9,  rv: 17000, mg: 41, ld: 20, ou: 7  },
    { label: 'S5',  ml: 73,  sp: 1020, im: 28300, ql: 43, ag: 27, cv: 9,  rv: 17500, mg: 44, ld: 22, ou: 7  },
    { label: 'S6',  ml: 78,  sp: 1050, im: 30000, ql: 46, ag: 29, cv: 10, rv: 19000, mg: 47, ld: 23, ou: 8  },
    { label: 'S7',  ml: 83,  sp: 1090, im: 31500, ql: 49, ag: 31, cv: 11, rv: 21000, mg: 50, ld: 25, ou: 8  },
    { label: 'S8',  ml: 80,  sp: 1100, im: 30000, ql: 47, ag: 30, cv: 11, rv: 22000, mg: 48, ld: 22, ou: 10 },
    { label: 'S9',  ml: 88,  sp: 1140, im: 33000, ql: 52, ag: 33, cv: 12, rv: 24000, mg: 53, ld: 26, ou: 9  },
    { label: 'S10', ml: 95,  sp: 1250, im: 36000, ql: 57, ag: 36, cv: 13, rv: 26000, mg: 57, ld: 28, ou: 10 },
    { label: 'S11', ml: 100, sp: 1280, im: 38000, ql: 60, ag: 38, cv: 14, rv: 28500, mg: 60, ld: 30, ou: 10 },
    { label: 'S12', ml: 105, sp: 1340, im: 41000, ql: 63, ag: 40, cv: 14, rv: 29000, mg: 63, ld: 31, ou: 11 },
    { label: 'S13', ml: 107, sp: 1570, im: 45000, ql: 65, ag: 42, cv: 15, rv: 30000, mg: 64, ld: 32, ou: 11 },
  ],
};

// ── Metrics registry ─────────────────────────────────────────────────────────
const ALL_METRICS: MetricDef[] = [
  // Meta Ads
  { key: 'ml',  source: 'meta', group: 'Meta Ads', label: 'Leads Capturados (Meta)', dataKey: 'ml', kpiCompute: (d) => d.reduce((s, r) => s + r.ml, 0), format: 'number',   color: '#55F52F' },
  { key: 'sp',  source: 'meta', group: 'Meta Ads', label: 'Investimento',             dataKey: 'sp', kpiCompute: (d) => d.reduce((s, r) => s + r.sp, 0), format: 'currency',  color: '#F59E0B' },
  { key: 'im',  source: 'meta', group: 'Meta Ads', label: 'Impressões',               dataKey: 'im', kpiCompute: (d) => d.reduce((s, r) => s + r.im, 0), format: 'number',   color: '#8B5CF6' },
  { key: 'cpl', source: 'meta', group: 'Meta Ads', label: 'CPL (Custo por Lead)',     dataKey: null, kpiCompute: (d) => { const sp = d.reduce((a, r) => a + r.sp, 0); const ml = d.reduce((a, r) => a + r.ml, 0); return ml ? sp / ml : 0; }, format: 'currency', color: '#EF4444' },
  { key: 'ctr', source: 'meta', group: 'Meta Ads', label: 'CTR (%)',                  dataKey: null, kpiCompute: () => 2.68, format: 'percent', color: '#EC4899' },
  // CRM
  { key: 'ql',  source: 'crm',  group: 'CRM',      label: 'Leads Qualificados',       dataKey: 'ql', kpiCompute: (d) => d.reduce((s, r) => s + r.ql, 0), format: 'number',   color: '#7B2CFF' },
  { key: 'ag',  source: 'crm',  group: 'CRM',      label: 'Agendamentos',             dataKey: 'ag', kpiCompute: (d) => d.reduce((s, r) => s + r.ag, 0), format: 'number',   color: '#3B82F6' },
  { key: 'cv',  source: 'crm',  group: 'CRM',      label: 'Conversões (Vendas)',      dataKey: 'cv', kpiCompute: (d) => d.reduce((s, r) => s + r.cv, 0), format: 'number',   color: '#10B981' },
  { key: 'rv',  source: 'crm',  group: 'CRM',      label: 'Receita (R$)',             dataKey: 'rv', kpiCompute: (d) => d.reduce((s, r) => s + r.rv, 0), format: 'currency',  color: '#22D3EE' },
  { key: 'cr',  source: 'crm',  group: 'CRM',      label: 'Taxa de Conversão (%)',    dataKey: null, kpiCompute: (d) => { const ql = d.reduce((a, r) => a + r.ql, 0); const cv = d.reduce((a, r) => a + r.cv, 0); return ql ? (cv / ql) * 100 : 0; }, format: 'percent', color: '#F97316' },
  { key: 'roi', source: 'crm',  group: 'CRM',      label: 'ROI',                      dataKey: null, kpiCompute: (d) => { const sp = d.reduce((a, r) => a + r.sp, 0); const rv = d.reduce((a, r) => a + r.rv, 0); return sp ? rv / sp : 0; }, format: 'times', color: '#FCD34D' },
  // Cidades
  { key: 'mg',  source: 'crm',  group: 'Cidades',  label: 'Leads — Maringá',          dataKey: 'mg', kpiCompute: (d) => d.reduce((s, r) => s + r.mg, 0), format: 'number',   color: '#F472B6' },
  { key: 'ld',  source: 'crm',  group: 'Cidades',  label: 'Leads — Londrina',         dataKey: 'ld', kpiCompute: (d) => d.reduce((s, r) => s + r.ld, 0), format: 'number',   color: '#FB923C' },
  { key: 'ou',  source: 'crm',  group: 'Cidades',  label: 'Leads — Outras Cidades',   dataKey: 'ou', kpiCompute: (d) => d.reduce((s, r) => s + r.ou, 0), format: 'number',   color: '#A3E635' },
];

const METRIC_MAP = Object.fromEntries(ALL_METRICS.map((m) => [m.key, m])) as Record<string, MetricDef>;
const METRIC_GROUPS = ['Meta Ads', 'CRM', 'Cidades'];

// ── Helpers ───────────────────────────────────────────────────────────────────
const SOURCE_BADGE: Record<DataSource, string> = {
  meta: 'bg-blue-500/20 text-blue-400',
  crm:  'bg-purple-500/20 text-purple-400',
};
const SOURCE_LABEL: Record<DataSource, string> = { meta: 'Meta', crm: 'CRM' };

function fmt(value: number, format: MetricDef['format']): string {
  switch (format) {
    case 'currency':
      return formatCurrencyBRL(value);
    case 'percent': return `${value.toFixed(2)}%`;
    case 'times':   return `${value.toFixed(1)}x`;
    default:
      return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toLocaleString('pt-BR');
  }
}

const SHORT: Record<string, string> = {
  ml: 'Leads Meta', ql: 'Qualificados', ag: 'Agendamentos', cv: 'Conversões',
  rv: 'Receita', sp: 'Investimento', im: 'Impressões', cpl: 'CPL',
  ctr: 'CTR', cr: 'Conv.%', roi: 'ROI', mg: 'Maringá', ld: 'Londrina', ou: 'Outras',
};
function autoTitle(keys: string[]): string {
  if (keys.length === 0) return 'Novo Bloco';
  return keys.map((k) => SHORT[k] ?? METRIC_MAP[k]?.label ?? k).join(' vs. ');
}

const TOOLTIP_STYLE = { backgroundColor: '#1B1D24', borderColor: '#2A2D3A', borderRadius: '8px', color: '#F5F5F5', fontSize: '12px' };
const AXIS_TICK = { fill: '#A0AEC0', fontSize: 11 };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tooltipFormatter(series: MetricDef[]): (...args: any[]) => any {
  return (value: unknown, name: unknown, item: { dataKey?: string | number }) => {
    const metric = series.find((m) => m.dataKey === item?.dataKey);
    const n = typeof value === 'number' ? value : Number(value ?? 0);
    return [Number.isFinite(n) ? fmt(n, metric?.format ?? 'number') : String(value ?? ''), name];
  };
}

// ── Widget chart ───────────────────────────────────────────────────────────────
function WidgetChart({ widget, data }: { widget: Widget; data: DataPoint[] }) {
  const metrics = widget.metrics.map((k) => METRIC_MAP[k]).filter((m): m is MetricDef => !!m);
  const series  = metrics.filter((m) => m.dataKey !== null);
  const h = widget.size === 1 ? 120 : 160;
  const yAxisFormatter = series.length > 0 && series.every((m) => m.format === 'currency')
    ? (value: number) => fmt(value, 'currency')
    : undefined;

  if (widget.chartType === 'kpi') {
    return (
      <div className={cn('flex py-4', metrics.length === 1 ? 'flex-col items-center justify-center gap-2' : 'flex-row items-center justify-around gap-4 flex-wrap')}>
        {metrics.map((m) => {
          const value = m.kpiCompute(data);
          return (
            <div key={m.key} className="flex flex-col items-center gap-0.5 text-center">
              <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: m.color }} />
              <p className={cn('font-bold font-heading', metrics.length === 1 ? 'text-4xl' : 'text-2xl')} style={{ color: m.color }}>
                {fmt(value, m.format)}
              </p>
              <p className="text-[11px] text-muted-foreground leading-tight">{m.label}</p>
            </div>
          );
        })}
      </div>
    );
  }

  if (series.length === 0) return null;

  if (widget.chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={h}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} tickFormatter={yAxisFormatter} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={tooltipFormatter(series)} />
          {series.length > 1 && <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />}
          {series.map((m) => (
            <Bar key={m.key} dataKey={m.dataKey!} fill={m.color} radius={[4, 4, 0, 0]} name={m.label} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (widget.chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height={h}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} tickFormatter={yAxisFormatter} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={tooltipFormatter(series)} />
          {series.length > 1 && <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />}
          {series.map((m) => (
            <Line key={m.key} type="monotone" dataKey={m.dataKey!} stroke={m.color} strokeWidth={2} dot={false} name={m.label} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (widget.chartType === 'area') {
    return (
      <ResponsiveContainer width="100%" height={h}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <defs>
            {series.map((m) => (
              <linearGradient key={m.key} id={`g-${widget.id}-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={m.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={m.color} stopOpacity={0}   />
              </linearGradient>
            ))}
          </defs>
          <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} tickFormatter={yAxisFormatter} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={tooltipFormatter(series)} />
          {series.length > 1 && <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />}
          {series.map((m) => (
            <Area key={m.key} type="monotone" dataKey={m.dataKey!} stroke={m.color} strokeWidth={2}
              fillOpacity={1} fill={`url(#g-${widget.id}-${m.key})`} name={m.label} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return null;
}

// ── Widget card ────────────────────────────────────────────────────────────────
function WidgetCard({ widget, data, onRemove }: {
  widget: Widget; data: DataPoint[]; onRemove: () => void;
}) {
  const metrics = widget.metrics.map((k) => METRIC_MAP[k]).filter((m): m is MetricDef => !!m);
  const primarySource = metrics[0]?.source ?? 'meta';
  const hasMixed = metrics.some((m) => m.source !== primarySource);

  return (
    <div className={cn(
      'bg-card border border-border rounded-xl overflow-hidden',
      widget.size === 1 && 'col-span-1',
      widget.size === 2 && 'col-span-1 md:col-span-2',
      widget.size === 3 && 'col-span-1 md:col-span-3',
    )}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-semibold text-sm truncate">{widget.title}</span>
          {hasMixed ? (
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 bg-violet-500/20 text-violet-400">Cruzado</span>
          ) : (
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0', SOURCE_BADGE[primarySource])}>
              {SOURCE_LABEL[primarySource]}
            </span>
          )}
        </div>
        <button onClick={onRemove} className="ml-2 shrink-0 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4">
        <WidgetChart widget={widget} data={data} />
      </div>
    </div>
  );
}

// ── Add widget dialog ──────────────────────────────────────────────────────────
const CHART_TYPE_OPTIONS: { key: ChartType; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'kpi',  label: 'Número(s)', Icon: Hash      },
  { key: 'bar',  label: 'Barras',    Icon: BarChart2  },
  { key: 'line', label: 'Linha',     Icon: TrendingUp },
  { key: 'area', label: 'Área',      Icon: Layers     },
];

function AddWidgetDialog({ open, onClose, onAdd }: {
  open: boolean; onClose: () => void; onAdd: (w: Omit<Widget, 'id'>) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [chart,    setChart]    = useState<ChartType>('bar');
  const [size,     setSize]     = useState<WidgetSize>(2);
  const [customTitle, setCustomTitle] = useState('');

  const allHaveDataKey = selected.length > 0 && selected.every((k) => METRIC_MAP[k]?.dataKey !== null);
  const availableCharts: ChartType[] = allHaveDataKey ? ['kpi', 'bar', 'line', 'area'] : ['kpi'];

  function toggle(key: string) {
    if (selected.includes(key)) {
      const next = selected.filter((k) => k !== key);
      setSelected(next);
      const nextAllHaveDataKey = next.length > 0 && next.every((k) => METRIC_MAP[k]?.dataKey !== null);
      if (!nextAllHaveDataKey && chart !== 'kpi') setChart('kpi');
    } else {
      if (selected.length >= 3) return;
      setSelected([...selected, key]);
      if (!METRIC_MAP[key]?.dataKey && chart !== 'kpi') setChart('kpi');
    }
  }

  function handleClose() {
    setSelected([]); setChart('bar'); setSize(2); setCustomTitle('');
    onClose();
  }

  function handleAdd() {
    if (selected.length === 0) return;
    onAdd({ title: customTitle.trim() || autoTitle(selected), metrics: selected, chartType: chart, size });
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Bloco ao Dashboard</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-1 max-h-[62vh] overflow-y-auto pr-1">
          {/* Selected chips */}
          {selected.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap p-3 bg-muted/40 rounded-lg">
              <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Comparando:</span>
              {selected.map((k) => {
                const m = METRIC_MAP[k];
                return (
                  <span key={k} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium"
                    style={{ borderColor: `${m?.color}66`, color: m?.color, backgroundColor: `${m?.color}18` }}>
                    {SHORT[k] ?? m?.label}
                    <button onClick={() => toggle(k)} className="opacity-60 hover:opacity-100 ml-0.5">×</button>
                  </span>
                );
              })}
              {selected.length < 3 && (
                <span className="text-[11px] text-muted-foreground/50">+ até {3 - selected.length} mais</span>
              )}
            </div>
          )}

          {/* 1 — Metrics */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
              1. Selecione as Métricas <span className="normal-case text-muted-foreground/50 font-normal">(até 3 para comparar)</span>
            </p>
            {METRIC_GROUPS.map((group) => {
              const groupMetrics = ALL_METRICS.filter((m) => m.group === group);
              return (
                <div key={group} className="mb-4">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2 px-0.5">{group}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {groupMetrics.map((m) => {
                      const isSelected = selected.includes(m.key);
                      const isDisabled = !isSelected && selected.length >= 3;
                      return (
                        <button
                          key={m.key}
                          onClick={() => !isDisabled && toggle(m.key)}
                          disabled={isDisabled}
                          className={cn(
                            'flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-colors',
                            isSelected  ? 'border-primary/60 bg-primary/10' : 'border-border bg-card',
                            isDisabled  ? 'opacity-30 cursor-not-allowed' : 'hover:bg-muted/50',
                          )}
                        >
                          <div
                            className={cn('w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors')}
                            style={isSelected ? { backgroundColor: m.color, borderColor: m.color } : { borderColor: '#4B5563' }}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 text-black font-bold" />}
                          </div>
                          <p className="font-medium text-xs leading-tight flex-1 truncate">{m.label}</p>
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2 — Chart type */}
          {selected.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">2. Visualização</p>
              <div className="flex gap-2 flex-wrap">
                {CHART_TYPE_OPTIONS.filter((o) => availableCharts.includes(o.key)).map(({ key, label, Icon }) => (
                  <button key={key} onClick={() => setChart(key)}
                    className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
                      chart === key
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'
                    )}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
              {!allHaveDataKey && (
                <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                  Métricas calculadas (CPL, CTR, ROI, Taxa Conv.) só exibem como número.
                </p>
              )}
            </div>
          )}

          {/* 3 — Title */}
          {selected.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">3. Título (opcional)</p>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={autoTitle(selected)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          {/* 4 — Size */}
          {selected.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">4. Tamanho</p>
              <div className="flex gap-2">
                {([
                  { key: 1 as WidgetSize, label: '1 Coluna',  sub: 'Compacto' },
                  { key: 2 as WidgetSize, label: '2 Colunas', sub: 'Médio'    },
                  { key: 3 as WidgetSize, label: '3 Colunas', sub: 'Largo'    },
                ]).map((s) => (
                  <button key={s.key} onClick={() => setSize(s.key)}
                    className={cn('flex-1 p-2 rounded-lg border text-center transition-colors',
                      size === s.key
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'
                    )}>
                    <p className="font-semibold text-xs">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleAdd}
            disabled={selected.length === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Bloco
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Default widgets ────────────────────────────────────────────────────────────
const DEFAULT_WIDGETS: Widget[] = [
  { id: 'w1', title: 'Leads Meta vs. Qualificados',   metrics: ['ml', 'ql'],       chartType: 'bar',  size: 2 },
  { id: 'w2', title: 'Receita',                        metrics: ['rv'],             chartType: 'kpi',  size: 1 },
  { id: 'w3', title: 'Leads Capturados vs. Agendamentos vs. Conversões', metrics: ['ml', 'ag', 'cv'], chartType: 'line', size: 3 },
  { id: 'w4', title: 'CPL + ROI',                     metrics: ['cpl', 'roi'],     chartType: 'kpi',  size: 1 },
  { id: 'w5', title: 'Leads por Cidade',               metrics: ['mg', 'ld', 'ou'], chartType: 'bar',  size: 2 },
  { id: 'w6', title: 'Investimento vs. Receita',       metrics: ['sp', 'rv'],       chartType: 'area', size: 2 },
];

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ConstruitorPage() {
  const [period,     setPeriod]     = useState<Period>('30d');
  const [widgets,    setWidgets]    = useState<Widget[]>(DEFAULT_WIDGETS);
  const [dialogOpen, setDialogOpen] = useState(false);

  const data = DATA[period];

  function addWidget(config: Omit<Widget, 'id'>) {
    setWidgets((prev) => [...prev, { ...config, id: `w${Date.now()}` }]);
  }

  function removeWidget(id: string) {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-heading tracking-wider uppercase">Construtor de Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Combine até 3 métricas em qualquer bloco. Cruze Meta Ads, CRM e cidades livremente.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex rounded-lg border border-border bg-card overflow-hidden">
            {(['7d', '30d', '90d'] as Period[]).map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={cn('px-4 py-2 text-sm font-semibold transition-colors',
                  period === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}>
                {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '90 dias'}
              </button>
            ))}
          </div>
          <Button onClick={() => setDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Bloco
          </Button>
        </div>
      </div>

      {widgets.length === 0 ? (
        <button onClick={() => setDialogOpen(true)}
          className="w-full flex flex-col items-center justify-center py-24 border border-dashed border-border rounded-xl hover:border-primary/40 transition-colors">
          <Plus className="w-10 h-10 text-muted-foreground mb-3" />
          <p className="font-semibold text-muted-foreground">Nenhum bloco adicionado</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Clique para montar seu painel</p>
        </button>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {widgets.map((w) => (
            <WidgetCard key={w.id} widget={w} data={data} onRemove={() => removeWidget(w.id)} />
          ))}
        </div>
      )}

      <AddWidgetDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onAdd={addWidget} />
    </div>
  );
}
