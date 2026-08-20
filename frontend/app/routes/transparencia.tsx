import { useEffect, useState } from "react";
import { SummaryCard } from "../components/SummaryCard";
import { useDataStore } from "../stores/data/useDataStore";
import type { TransparencyFilters } from "../stores/data/types";
import { formatCurrency, formatStatus } from "../utils/formatters";

export function meta() {
  return [{ title: "Portal da Transparência | Projeto Aberto" }];
}

export default function Transparencia() {
  const { transparency, loading, error, loadTransparency, loadTransparencyOrgaos } = useDataStore();
  const [situacao, setSituacao] = useState<TransparencyFilters["situacao"]>();
  const [orgao, setOrgao] = useState<number>();

  useEffect(() => {
    void loadTransparencyOrgaos();
    void loadTransparency({ page: 1, per_page: 10 });
  }, [loadTransparencyOrgaos, loadTransparency]);

  function applyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadTransparency({ page: 1, per_page: 10, situacao, orgao });
  }

  function clearFilters() {
    setSituacao(undefined);
    setOrgao(undefined);
    void loadTransparency({ page: 1, per_page: 10 });
  }

  function changePage(page: number) {
    void loadTransparency({ page, per_page: transparency.projects?.per_page ?? 10, situacao, orgao });
  }

  const projects = transparency.projects?.data ?? [];

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <section>
        <h1 className="text-2xl font-semibold text-gov-dark">Portal da Transparência</h1>
        <p className="mt-2 text-slate-600">
          Consulte projetos públicos, seus valores planejados e sua execução.
        </p>
      </section>

      {transparency.summary && (
        <section className="grid gap-4 sm:grid-cols-3" aria-label="Indicadores resumidos">
          <SummaryCard label="Projetos publicados" value={transparency.summary.projetos_publicados.toString()} />
          <SummaryCard label="Valor planejado" value={formatCurrency(transparency.summary.valor_total_planejado)} />
          <SummaryCard label="Valor executado" value={formatCurrency(transparency.summary.valor_total_executado)} />
        </section>
      )}

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-semibold text-gov-dark">Consultar projetos</h2>
        <form onSubmit={applyFilters} className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
          <label className="text-sm text-slate-700">
            Situação
            <select
              value={situacao ?? ""}
              onChange={(event) => setSituacao((event.target.value || undefined) as TransparencyFilters["situacao"])}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2"
            >
              <option value="">Todas</option>
              <option value="planejado">Planejado</option>
              <option value="em_andamento">Em andamento</option>
              <option value="suspenso">Suspenso</option>
              <option value="concluido">Concluído</option>
            </select>
          </label>

          <label className="text-sm text-slate-700">
            Órgão
            <select
              value={orgao ?? ""}
              onChange={(event) => setOrgao(event.target.value ? Number(event.target.value) : undefined)}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2"
            >
              <option value="">Todos</option>
              {transparency.orgaos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="nav-button">Filtrar</button>
          <button type="button" onClick={clearFilters} className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            Limpar
          </button>
        </form>
      </section>

      {loading && <p className="text-slate-600" role="status">Carregando projetos…</p>}

      {!loading && error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700" role="alert">
          Não foi possível carregar os projetos. Tente novamente.
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="rounded-md border border-slate-200 p-6 text-center text-slate-600">
          Nenhum projeto encontrado para os filtros selecionados.
        </p>
      )}

      {!loading && !error && projects.length > 0 && (
        <section className="space-y-4" aria-label="Projetos publicados">
          {projects.map((project) => (
            <article key={project.codigo} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{project.codigo}</p>
                  <h2 className="mt-1 text-lg font-semibold text-gov-dark">{project.titulo}</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  {formatStatus(project.situacao)}
                </span>
              </div>
              <p className="mt-3 text-slate-600">{project.descricao}</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                <span>Órgão: {project.orgao ?? "Não informado"}</span>
                <span>Planejado: {formatCurrency(project.orcamento_previsto)}</span>
                <span>Executado: {formatCurrency(project.valor_executado)}</span>
              </div>
            </article>
          ))}

          {transparency.projects && transparency.projects.last_page > 1 && (
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={transparency.projects.current_page === 1}
                onClick={() => changePage(transparency.projects!.current_page - 1)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm text-slate-600">
                Página {transparency.projects.current_page} de {transparency.projects.last_page}
              </span>
              <button
                type="button"
                disabled={transparency.projects.current_page === transparency.projects.last_page}
                onClick={() => changePage(transparency.projects!.current_page + 1)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
