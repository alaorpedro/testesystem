import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidade — Onmid',
  description: 'Política de privacidade do sistema ON_REPORT da Onmid.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">Onmid</p>
          <h1 className="text-4xl font-bold text-gray-900">Política de Privacidade</h1>
          <p className="text-gray-500 mt-3">Última atualização: maio de 2026</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <p>
              A <strong>Onmid</strong> ("nós", "nosso") opera o sistema <strong>ON_REPORT</strong>, uma plataforma de gestão e relatórios para agências de marketing digital. Esta política descreve como coletamos, usamos e protegemos as informações dos usuários.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Informações que Coletamos</h2>
            <p>Podemos coletar as seguintes informações:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Nome, e-mail e dados de acesso para autenticação no sistema</li>
              <li>Dados de campanhas e métricas de desempenho de anúncios (via integração com Meta Ads)</li>
              <li>Informações de clientes cadastrados pela agência</li>
              <li>Registros de atividade (logs) de ações realizadas no sistema</li>
              <li>Dados de programação de pagamentos de investimento em mídia</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Integração com o Facebook / Meta</h2>
            <p>
              O ON_REPORT utiliza a <strong>API do Meta (Facebook)</strong> para importar dados de campanhas publicitárias. Ao conectar sua conta, você autoriza o sistema a acessar:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Contas de anúncio vinculadas ao seu perfil</li>
              <li>Páginas do Facebook administradas por você</li>
              <li>Perfis do Instagram Business vinculados</li>
              <li>Métricas de desempenho de campanhas (investimento, leads, impressões, cliques)</li>
            </ul>
            <p className="mt-3">
              Não armazenamos seus dados do Facebook em servidores externos — o token de acesso é salvo localmente no seu navegador (localStorage) e usado exclusivamente para consultar a API do Meta em tempo real.
            </p>
            <p className="mt-3">
              Você pode revogar o acesso a qualquer momento em{' '}
              <a href="https://www.facebook.com/settings?tab=applications" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                facebook.com/settings → Aplicativos
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. Como Usamos as Informações</h2>
            <p>Utilizamos os dados coletados para:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Exibir relatórios e dashboards de desempenho para a equipe da agência</li>
              <li>Registrar o histórico de atividades para auditoria interna</li>
              <li>Gerenciar programações de pagamento de investimento em mídia</li>
              <li>Controlar o acesso de usuários ao sistema</li>
            </ul>
            <p className="mt-3">
              Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins comerciais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Armazenamento de Dados</h2>
            <p>
              Os dados operacionais do sistema (pagamentos, clientes, logs) são armazenados localmente no navegador via <code className="bg-gray-100 px-1 rounded text-sm">localStorage</code>. Não utilizamos banco de dados externo nesta versão do sistema.
            </p>
            <p className="mt-3">
              Tokens de acesso ao Meta são armazenados apenas no navegador do usuário e não trafegam por servidores da Onmid.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">5. Cookies</h2>
            <p>
              O sistema pode utilizar cookies de sessão necessários para autenticação e funcionamento do SDK do Facebook. Não utilizamos cookies de rastreamento ou publicidade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">6. Segurança</h2>
            <p>
              Adotamos medidas técnicas para proteger as informações dentro do sistema, incluindo controle de acesso por usuário e registro de atividades. No entanto, nenhum sistema é 100% seguro — recomendamos que os usuários utilizem senhas fortes e não compartilhem credenciais de acesso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">7. Seus Direitos</h2>
            <p>Você tem o direito de:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Acessar os dados que temos sobre você</li>
              <li>Solicitar a correção de dados incorretos</li>
              <li>Solicitar a exclusão dos seus dados</li>
              <li>Revogar o acesso do sistema à sua conta do Meta a qualquer momento</li>
            </ul>
            <p className="mt-3">
              Para solicitações relacionadas aos seus dados, entre em contato pelo e-mail:{' '}
              <a href="mailto:contato@onmid.com.br" className="text-blue-600 underline">
                contato@onmid.com.br
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">8. Exclusão de Dados</h2>
            <p>
              Para solicitar a exclusão dos seus dados do sistema, acesse nossa{' '}
              <Link href="/data-deletion" className="text-blue-600 underline">
                página de exclusão de dados
              </Link>{' '}
              ou envie um e-mail para{' '}
              <a href="mailto:contato@onmid.com.br" className="text-blue-600 underline">
                contato@onmid.com.br
              </a>{' '}
              com o assunto "Exclusão de dados".
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">9. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Notificaremos os usuários sobre mudanças significativas. O uso continuado do sistema após as alterações implica na aceitação da nova política.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">10. Contato</h2>
            <p>
              Em caso de dúvidas sobre esta política, entre em contato:
            </p>
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
          <Link href="/data-deletion" className="text-blue-600 hover:underline">
            Exclusão de dados →
          </Link>
        </div>
      </div>
    </div>
  );
}
