"use client";

import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockUsers as initialUsers, mockPermissions as initialPermissions } from '@/lib/mock-data';
import type { User, Permission } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const MODULES: { key: keyof Permission; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'clientes', label: 'Clientes' },
  { key: 'relatorios', label: 'Relatórios' },
  { key: 'configuracoes', label: 'Configurações' },
  { key: 'integracoes', label: 'Integrações' },
];

const ROLES = ['Administrador', 'Usuário', 'Visualizador'];

const emptyForm = { name: '', email: '', role: 'Usuário' };

export default function ConfiguracoesPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [permissions, setPermissions] = useState<Record<string, Permission>>(initialPermissions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function handleCreateUser() {
    if (!form.name.trim() || !form.email.trim()) return;
    const id = String(Date.now());
    const user: User = { id, name: form.name, email: form.email, role: form.role, status: 'Ativo' };
    setUsers((prev) => [...prev, user]);
    setPermissions((prev) => ({
      ...prev,
      [id]: { dashboard: true, clientes: false, relatorios: false, configuracoes: false, integracoes: false },
    }));
    setForm(emptyForm);
    setDialogOpen(false);
  }

  function handleDeleteUser(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setPermissions((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function togglePermission(userId: string, module: keyof Permission) {
    setPermissions((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [module]: !prev[userId]?.[module],
      },
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-heading tracking-wider uppercase">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie usuários e permissões do sistema.</p>
      </div>

      <Tabs defaultValue="usuarios">
        <TabsList>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="permissoes">Permissões</TabsTrigger>
        </TabsList>

        {/* ── USUÁRIOS ── */}
        <TabsContent value="usuarios" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Perfil</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          user.role === 'Administrador'
                            ? 'bg-primary/20 text-primary'
                            : user.role === 'Usuário'
                            ? 'bg-blue-500/20 text-blue-500'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          user.status === 'Ativo'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Editar">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Remover"
                          className="text-destructive/70 hover:text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ── PERMISSÕES ── */}
        <TabsContent value="permissoes" className="mt-6">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Usuário</th>
                  {MODULES.map((m) => (
                    <th key={m.key} className="px-6 py-4 text-center">
                      {m.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.role}</div>
                    </td>
                    {MODULES.map((m) => {
                      const enabled = permissions[user.id]?.[m.key] ?? false;
                      return (
                        <td key={m.key} className="px-6 py-4 text-center">
                          <button
                            onClick={() => togglePermission(user.id, m.key)}
                            aria-label={`${enabled ? 'Desativar' : 'Ativar'} ${m.label} para ${user.name}`}
                            className={cn(
                              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
                              enabled ? 'bg-primary' : 'bg-muted-foreground/30'
                            )}
                          >
                            <span
                              className={cn(
                                'inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200',
                                enabled ? 'translate-x-5' : 'translate-x-0'
                              )}
                            />
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── DIALOG: Novo Usuário ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="user-name">Nome</Label>
              <Input
                id="user-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Perfil</Label>
              <Select value={form.role} onValueChange={(role) => role && setForm({ ...form, role })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateUser}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Criar Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
