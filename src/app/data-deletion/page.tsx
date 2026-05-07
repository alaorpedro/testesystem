import Link from 'next/link';

export const metadata = {
  title: 'Exclusão de Dados — Onmid',
  description: 'Solicite a exclusão dos seus dados no sistema ON_REPORT da Onmid.',
};

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">Onmid</p>
          <h1 className="text-4xl font-bold text-gray-900">Exclusão de Dados da Conta</h1>
          <p className="text-gray-500 mt-3">Última atualização: maio de 2026</p>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          <section>
            <p>
              Em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong> e com as políticas da plataforma Meta, você tem o direito de solicitar a exclusão de todos os seus dados armazenados no sistema <strong>ON_REPORT</strong> da Onmid.
            </p>
          </section>

          {/* What gets deleted */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">O que será excluído</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Sua conta de acesso ao sistema (nome, e-mail, senha)</li>
              <li>Token de acesso ao Meta / Facebook vinculado à sua conta</li>
              <li>Histórico de atividades (logs) associados ao seu usuário</li>
              <li>Quaisquer preferências e configurações salvas</li>
            </ul>
            <p className="mt-3 text-sm text-gray-500">
              Dados de clientes e campanhas gerenciados pela agência poderão ser mantidos conforme contrato de prestação de serviços, salvo solicitação específica.
            </p>
          </section>

          {/* How to request */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Como solicitar a exclusão</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
                <div>
                  <p className="font-semibold text-gray-900">Envie um e-mail</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Envie um e-mail para{' '}
                    <a href="mailto:contato@onmid.com.br?subject=Exclusão de dados - ON_REPORT" className="text-blue-600 underline">
                      contato@onmid.com.br
                    </a>{' '}
                    com o assunto <strong>"Exclusão de dados - ON_REPORT"</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
                <div>
                  <p className="font-semibold text-gray-900">Confirme sua identidade</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Informe o e-mail cadastrado no sistema para que possamos localizar e excluir sua conta com segurança.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
                <div>
                  <p className="font-semibold text-gray-900">Confirmação em até 5 dias úteis</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Processaremos sua solicitação e enviaremos uma confirmação por e-mail quando os dados forem excluídos.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Revoke Meta access */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Revogar acesso ao Facebook / Meta</h2>
            <p>
              Para remover o acesso do ON_REPORT à sua conta do Facebook imediatamente, siga os passos:
            </p>
            <ol className="list-decimal pl-6 mt-3 space-y-1 text-sm">
              <li>Acesse{' '}
                <a href="https://www.facebook.com/settings?tab=applications" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  facebook.com/settings → Aplicativos e sites
                </a>
              </li>
              <li>Encontre <strong>ON_REPORT</strong> na lista</li>
              <li>Clique em <strong>Remover</strong></li>
            </ol>
            <p className="mt-3 text-sm text-gray-500">
              Isso revoga o token de acesso imediatamente. O sistema não conseguirá mais acessar seus dados do Meta.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Contato</h2>
            <p>Para dúvidas ou solicitações, entre em contato:</p>
            <ul className="list-none mt-2 space-y-1">
              <li><strong>Empresa:</strong> Onmid</li>
              <li><strong>E-mail:</strong>{' '}
                <a href="mailto:contato@onmid.com.br" className="text-blue-600 underline">
                  contato@onmid.com.br
                </a>
              </li>
            </ul>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between text-sm text-gray-400">
          <p>© 2026 Onmid. Todos os direitos reservados.</p>
          <Link href="/privacy" className="text-blue-600 hover:underline">
            ← Política de Privacidade
          </Link>
        </div>
      </div>
    </div>
  );
}
