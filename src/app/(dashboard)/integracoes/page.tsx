"use client";

import { useState } from 'react';
import { CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Integration = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'conectado' | 'desconectado';
  logo: React.ReactNode;
};

const LogoMeta = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#0668E1">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const LogoGoogle = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const LogoInstagram = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7">
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const LogoWhatsApp = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const LogoTikTok = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.39-2.2 1.85-5.36 2.4-8.08 1.47-2.73-.93-4.94-3.11-5.74-5.82-.8-2.72-.11-5.84 1.76-8 1.86-2.16 4.88-3.03 7.6-2.2v4.06c-1.31-.38-2.81-.13-3.86.81-1.04.94-1.38 2.49-1.03 3.86.35 1.36 1.48 2.5 2.87 2.84 1.4.35 2.96.06 4.09-.85 1.14-.91 1.74-2.39 1.72-3.89-.04-5.46-.02-10.92-.02-16.38z" />
  </svg>
);

const LogoGoogleMyBusiness = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7">
    <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const LogoWebsite = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const initialIntegrations: Integration[] = [
  {
    id: 'meta-ads',
    name: 'Meta Ads',
    description: 'Facebook e Instagram Ads — sincronize campanhas, leads e métricas.',
    category: 'Anúncios',
    status: 'conectado',
    logo: <LogoMeta />,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Acesse dados orgânicos, stories, reels e engajamento.',
    category: 'Social',
    status: 'conectado',
    logo: <LogoInstagram />,
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    description: 'Importe campanhas, palavras-chave e conversões do Google Ads.',
    category: 'Anúncios',
    status: 'desconectado',
    logo: <LogoGoogle />,
  },
  {
    id: 'google-my-business',
    name: 'Google Meu Negócio',
    description: 'Avaliações, buscas e desempenho do perfil do Google.',
    category: 'Presença Digital',
    status: 'desconectado',
    logo: <LogoGoogleMyBusiness />,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    description: 'Integre disparos, atendimento e métricas de conversas.',
    category: 'Comunicação',
    status: 'conectado',
    logo: <LogoWhatsApp />,
  },
  {
    id: 'tiktok-ads',
    name: 'TikTok Ads',
    description: 'Campanhas, alcance e performance de vídeos no TikTok.',
    category: 'Anúncios',
    status: 'desconectado',
    logo: <LogoTikTok />,
  },
  {
    id: 'website',
    name: 'Website / Analytics',
    description: 'Conecte o Google Analytics ou GTM para rastrear visitas e conversões.',
    category: 'Presença Digital',
    status: 'desconectado',
    logo: <LogoWebsite />,
  },
];

const CATEGORIES = ['Todos', 'Anúncios', 'Social', 'Presença Digital', 'Comunicação'];

export default function IntegracoesPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [activeCategory, setActiveCategory] = useState('Todos');

  function toggleConnection(id: string) {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === 'conectado' ? 'desconectado' : 'conectado' }
          : i
      )
    );
  }

  const filtered =
    activeCategory === 'Todos'
      ? integrations
      : integrations.filter((i) => i.category === activeCategory);

  const connected = integrations.filter((i) => i.status === 'conectado').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading tracking-wider uppercase">Integrações</h1>
          <p className="text-muted-foreground mt-1">
            Conecte suas plataformas para sincronizar dados automaticamente.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">
            {connected} de {integrations.length} conectadas
          </span>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
              activeCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-card hover:text-foreground'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Integration cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((integration) => {
          const isConnected = integration.status === 'conectado';
          return (
            <div
              key={integration.id}
              className={cn(
                'bg-card border rounded-xl p-5 flex flex-col gap-4 transition-colors',
                isConnected ? 'border-primary/30' : 'border-border'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm">
                  {integration.logo}
                </div>
                <div className="flex items-center gap-1.5">
                  {isConnected ? (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  ) : (
                    <XCircle className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span
                    className={cn(
                      'text-[10px] font-bold uppercase tracking-wider',
                      isConnected ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {isConnected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{integration.name}</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                    {integration.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {integration.description}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => toggleConnection(integration.id)}
                  variant={isConnected ? 'outline' : 'default'}
                  className={cn(
                    'flex-1 text-xs font-bold uppercase h-9',
                    !isConnected && 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  {isConnected ? 'Desconectar' : 'Conectar'}
                </Button>
                {isConnected && (
                  <Button variant="ghost" size="icon" title="Configurações da integração">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
