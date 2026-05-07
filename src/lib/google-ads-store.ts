"use client";

import { useEffect, useMemo, useState } from 'react';
import { assertSupabaseConfigured, supabase } from '@/lib/supabase';

const GOOGLE_ADS_UPDATED_EVENT = 'google-ads-updated';
const GOOGLE_ADS_ACCOUNTS_UPDATED_EVENT = 'google-ads-accounts-updated';
export const GOOGLE_ADS_DEVELOPER_TOKEN = '1vR8GhAk4UMZoPaqo7Qq8Q';
export const GOOGLE_ADS_LOGIN_EMAIL = 'matheus.onmid@gmail.com';
export const GOOGLE_ADS_DEFAULT_MANAGER_ID = 'mcc-8493021188';

export type GoogleAdsMetrics = {
  cost: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpc: number;
};

export type GoogleAdsAccount = {
  id: string;
  name: string;
  managerId: string;
  managerName: string;
  currency: string;
  status: 'Ativa' | 'Pausada';
  balance: number;
  metrics: GoogleAdsMetrics;
};

export type GoogleAdsConnectionStatus = 'connected' | 'disconnected';

export type GoogleAdsIntegration = {
  status: GoogleAdsConnectionStatus;
  email: string;
  managerId: string;
  developerToken: string;
  connectedAt: string | null;
};

export type ClientGoogleAdsConnection = {
  clientId: string;
  managerId: string;
  accountIds: string[];
  status: GoogleAdsConnectionStatus;
  connectedAt: string;
  lastSync: string;
};

export const GOOGLE_ADS_MANAGERS = [
  { id: 'mcc-8493021188', name: 'MCC Onmid' },
  { id: 'mcc-1029384756', name: 'MCC Comercial' },
];

export const GOOGLE_ADS_ACCOUNTS: GoogleAdsAccount[] = [];

const DEFAULT_INTEGRATION: GoogleAdsIntegration = {
  status: 'disconnected',
  email: '',
  managerId: '',
  developerToken: '',
  connectedAt: null,
};

function rowToAccount(row: Record<string, unknown>): GoogleAdsAccount {
  return {
    id: row.id as string,
    name: row.name as string,
    managerId: (row.manager_id as string) ?? '',
    managerName: (row.manager_name as string) ?? '',
    currency: (row.currency as string) ?? 'BRL',
    status: (row.status as 'Ativa' | 'Pausada') ?? 'Ativa',
    balance: Number(row.balance ?? 0),
    metrics: {
      cost: Number(row.cost ?? 0),
      impressions: Number(row.impressions ?? 0),
      clicks: Number(row.clicks ?? 0),
      conversions: Number(row.conversions ?? 0),
      cpc: Number(row.cpc ?? 0),
    },
  };
}

function sumMetrics(accounts: GoogleAdsAccount[]): GoogleAdsMetrics {
  const metrics = accounts.reduce(
    (total, account) => ({
      cost: total.cost + account.metrics.cost,
      impressions: total.impressions + account.metrics.impressions,
      clicks: total.clicks + account.metrics.clicks,
      conversions: total.conversions + account.metrics.conversions,
      cpc: 0,
    }),
    { cost: 0, impressions: 0, clicks: 0, conversions: 0, cpc: 0 },
  );

  return {
    ...metrics,
    cpc: metrics.clicks > 0 ? metrics.cost / metrics.clicks : 0,
  };
}

export function useGoogleAds() {
  const [integration, setIntegration] = useState<GoogleAdsIntegration>(DEFAULT_INTEGRATION);
  const [connections, setConnections] = useState<ClientGoogleAdsConnection[]>([]);
  const [accounts, setAccounts] = useState<GoogleAdsAccount[]>([]);

  useEffect(() => {
    async function load() {
      try {
        assertSupabaseConfigured();
        const [{ data: integrationData }, { data: connectionData }, { data: accountData }] = await Promise.all([
          supabase.from('google_ads_integration').select('*').eq('id', 'global').single(),
          supabase.from('google_ads_connections').select('*'),
          supabase.from('google_ads_accounts').select('*').order('name'),
        ]);

        if (integrationData) {
          setIntegration({
            status: integrationData.status as GoogleAdsConnectionStatus,
            email: integrationData.email ?? '',
            managerId: integrationData.manager_id ?? '',
            developerToken: integrationData.developer_token ?? '',
            connectedAt: integrationData.connected_at ?? null,
          });
        }

        if (connectionData) {
          setConnections(connectionData.map((row) => ({
            clientId: row.client_id,
            managerId: row.manager_id ?? '',
            accountIds: row.account_ids ?? [],
            status: row.status as GoogleAdsConnectionStatus,
            connectedAt: row.connected_at ?? new Date().toISOString(),
            lastSync: row.last_sync ?? new Date().toISOString(),
          })));
        }

        setAccounts(accountData ? accountData.map(rowToAccount) : []);
      } catch (error) {
        console.error('Erro ao carregar Google Ads do Supabase:', error);
      }
    }

    void load();

    function handleUpdate() { void load(); }
    window.addEventListener(GOOGLE_ADS_UPDATED_EVENT, handleUpdate);
    window.addEventListener(GOOGLE_ADS_ACCOUNTS_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(GOOGLE_ADS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener(GOOGLE_ADS_ACCOUNTS_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  return useMemo(() => {
    async function connect(input: { email: string; managerId: string; developerToken: string }) {
      const next: GoogleAdsIntegration = {
        status: 'connected',
        email: input.email.trim(),
        managerId: input.managerId,
        developerToken: input.developerToken.trim(),
        connectedAt: new Date().toISOString(),
      };

      setIntegration(next);
      const { error } = await supabase.from('google_ads_integration').upsert({
        id: 'global',
        status: next.status,
        email: next.email,
        manager_id: next.managerId,
        developer_token: next.developerToken,
        connected_at: next.connectedAt,
      });
      if (error) throw error;
      window.dispatchEvent(new Event(GOOGLE_ADS_UPDATED_EVENT));
      return next;
    }

    async function disconnect() {
      setIntegration(DEFAULT_INTEGRATION);
      const { error } = await supabase.from('google_ads_integration').upsert({
        id: 'global',
        status: 'disconnected',
        email: '',
        manager_id: '',
        developer_token: '',
        connected_at: null,
      });
      if (error) throw error;
      window.dispatchEvent(new Event(GOOGLE_ADS_UPDATED_EVENT));
    }

    async function saveAccount(input: { id: string; name: string; managerId: string; managerName: string; currency: string; status: 'Ativa' | 'Pausada'; balance: number }) {
      const { error } = await supabase.from('google_ads_accounts').upsert({
        id: input.id.trim(),
        name: input.name.trim(),
        manager_id: input.managerId,
        manager_name: input.managerName,
        currency: input.currency,
        status: input.status,
        balance: input.balance,
        cost: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cpc: 0,
      });
      if (error) throw error;
      window.dispatchEvent(new Event(GOOGLE_ADS_ACCOUNTS_UPDATED_EVENT));
    }

    async function deleteAccount(id: string) {
      const { error } = await supabase.from('google_ads_accounts').delete().eq('id', id);
      if (error) throw error;
      window.dispatchEvent(new Event(GOOGLE_ADS_ACCOUNTS_UPDATED_EVENT));
    }

    function getConnection(clientId: string) {
      return connections.find((c) => c.clientId === clientId && c.status === 'connected') ?? null;
    }

    function getClientAccounts(clientId: string) {
      const connection = getConnection(clientId);
      if (!connection) return [];
      return accounts.filter((a) => connection.accountIds.includes(a.id));
    }

    function getClientMetrics(clientId: string) {
      return sumMetrics(getClientAccounts(clientId));
    }

    function saveClientConnection(clientId: string, managerId: string, accountIds: string[]) {
      const now = new Date().toISOString();
      const next: ClientGoogleAdsConnection = {
        clientId,
        managerId,
        accountIds,
        status: 'connected',
        connectedAt: connections.find((c) => c.clientId === clientId)?.connectedAt ?? now,
        lastSync: now,
      };

      setConnections((prev) => [...prev.filter((c) => c.clientId !== clientId), next]);
      void (async () => {
        const { error } = await supabase.from('google_ads_connections').upsert({
          client_id: next.clientId,
          manager_id: next.managerId,
          account_ids: next.accountIds,
          status: next.status,
          connected_at: next.connectedAt,
          last_sync: next.lastSync,
        });
        if (error) console.error('Erro ao salvar vínculo Google Ads:', error);
        else window.dispatchEvent(new Event(GOOGLE_ADS_UPDATED_EVENT));
      })();
    }

    function disconnectClient(clientId: string) {
      setConnections((prev) => prev.filter((c) => c.clientId !== clientId));
      void (async () => {
        const { error } = await supabase.from('google_ads_connections').delete().eq('client_id', clientId);
        if (error) console.error('Erro ao remover vínculo Google Ads:', error);
        else window.dispatchEvent(new Event(GOOGLE_ADS_UPDATED_EVENT));
      })();
    }

    return {
      integration,
      connections,
      accounts,
      connect,
      disconnect,
      saveAccount,
      deleteAccount,
      getConnection,
      getClientAccounts,
      getClientMetrics,
      saveClientConnection,
      disconnectClient,
    };
  }, [connections, integration, accounts]);
}
