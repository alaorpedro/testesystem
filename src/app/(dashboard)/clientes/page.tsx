import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { mockClients } from '@/lib/mock-data';
import { Plus } from 'lucide-react';

export default function ClientesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading tracking-wider uppercase">Meus Clientes</h1>
          <p className="text-muted-foreground mt-1">Gerencie a base de clientes e acesse os dashboards individuais.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid gap-4">
        {mockClients.map((cliente) => (
          <Link key={cliente.id} href={`/clientes/${cliente.id}`}>
            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors">
              <div>
                <h3 className="font-semibold">{cliente.name}</h3>
                <p className="text-sm text-muted-foreground">{cliente.segment}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${cliente.status === 'Ativo' ? 'bg-primary/20 text-primary' : 'bg-orange-500/20 text-orange-500'}`}>
                  {cliente.status}
                </span>
                <span className="text-sm text-muted-foreground">Ver dashboard &rarr;</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
