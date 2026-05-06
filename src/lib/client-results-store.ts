export type ClientFunnel = {
  contatos: number;
  qualificados: number;
  agendamentos: number;
  comparecimentos: number;
  fechamentos: number;
};

export type ClientResult = {
  clientId: string;
  gestor: string;
  // Revenue
  meta: number;
  resultado: number;
  // Leads (higher is better)
  metaLeads: number;
  leads: number;
  // CPL and CAC (lower is better)
  metaCpl: number;
  cpl: number;
  metaCac: number;
  cac: number;
  // Funnel (higher is better per stage)
  metaFunil: ClientFunnel;
  funil: ClientFunnel;
};

export const clientResults: ClientResult[] = [
  {
    clientId: '1',
    gestor: 'Ana Paula',
    meta: 150000,
    resultado: 112500,
    metaLeads: 280,
    leads: 245,
    metaCpl: 20,
    cpl: 18,
    metaCac: 900,
    cac: 850,
    metaFunil: { contatos: 280, qualificados: 180, agendamentos: 120, comparecimentos: 60, fechamentos: 28 },
    funil:     { contatos: 245, qualificados: 142, agendamentos: 98,  comparecimentos: 45, fechamentos: 22 },
  },
  {
    clientId: '2',
    gestor: 'Carlos Mendes',
    meta: 80000,
    resultado: 22400,
    metaLeads: 200,
    leads: 89,
    metaCpl: 25,
    cpl: 28,
    metaCac: 1000,
    cac: 1200,
    metaFunil: { contatos: 200, qualificados: 130, agendamentos: 80, comparecimentos: 40, fechamentos: 18 },
    funil:     { contatos: 89,  qualificados: 54,  agendamentos: 31, comparecimentos: 18, fechamentos: 7  },
  },
  {
    clientId: '3',
    gestor: 'Paula Ramos',
    meta: 200000,
    resultado: 78000,
    metaLeads: 300,
    leads: 156,
    metaCpl: 40,
    cpl: 45,
    metaCac: 1800,
    cac: 2100,
    metaFunil: { contatos: 300, qualificados: 200, agendamentos: 100, comparecimentos: 50, fechamentos: 22 },
    funil:     { contatos: 156, qualificados: 98,  agendamentos: 52,  comparecimentos: 28, fechamentos: 11 },
  },
];
