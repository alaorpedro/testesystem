"use client";

import { useEffect, useMemo, useState } from 'react';
import { logActivity } from '@/lib/activity-log-store';
import { mockClients, type Client, type ClientStatus } from '@/lib/mock-data';
import { assertSupabaseConfigured, supabase } from '@/lib/supabase';

export const CURRENT_USER_ROLE = 'Administrador';

export type NewClientInput = {
  name: string;
  segment: string;
  status: ClientStatus;
};

export function canManageClients(role = CURRENT_USER_ROLE): boolean {
  return role === 'Administrador';
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const visibleClients = useMemo(() => clients.filter((c) => c.status !== 'Arquivado'), [clients]);
  const archivedClients = useMemo(() => clients.filter((c) => c.status === 'Arquivado'), [clients]);

  useEffect(() => {
    (async () => {
      try {
        assertSupabaseConfigured();
        const { data } = await supabase.from('clients').select('*').order('name');
        if (data && data.length > 0) {
          setClients(data.map((r) => ({ id: r.id, name: r.name, segment: r.segment, status: r.status as ClientStatus })));
        } else {
          setClients(mockClients);
        }
      } catch (error) {
        console.error('Erro ao carregar clientes do Supabase:', error);
        setClients(mockClients);
      }
    })();
  }, []);

  return useMemo(() => ({
    clients: visibleClients,
    allClients: clients,
    archivedClients,
    addClient(input: NewClientInput) {
      const client: Client = {
        id: `client-${Date.now()}`,
        name: input.name.trim(),
        segment: input.segment.trim(),
        status: input.status,
      };
      setClients((prev) => [...prev, client]);
      void (async () => {
        const { error } = await supabase.from('clients').upsert({ id: client.id, name: client.name, segment: client.segment, status: client.status });
        if (error) console.error('Erro ao salvar cliente no Supabase:', error);
      })();
      logActivity('client_created', `Cliente ${client.name} criado no segmento ${client.segment}`);
      return client;
    },
    archiveClient(id: string) {
      setClients((prev) => prev.map((c) => c.id === id ? { ...c, status: 'Arquivado' as ClientStatus } : c));
      void (async () => {
        const { error } = await supabase.from('clients').update({ status: 'Arquivado' }).eq('id', id);
        if (error) console.error('Erro ao arquivar cliente no Supabase:', error);
      })();
    },
    restoreClient(id: string) {
      setClients((prev) => prev.map((c) => c.id === id ? { ...c, status: 'Ativo' as ClientStatus } : c));
      void (async () => {
        const { error } = await supabase.from('clients').update({ status: 'Ativo' }).eq('id', id);
        if (error) console.error('Erro ao restaurar cliente no Supabase:', error);
      })();
    },
    deleteClient(id: string) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      void (async () => {
        const { error } = await supabase.from('clients').delete().eq('id', id);
        if (error) console.error('Erro ao excluir cliente no Supabase:', error);
      })();
    },
  }), [archivedClients, clients, visibleClients]);
}
