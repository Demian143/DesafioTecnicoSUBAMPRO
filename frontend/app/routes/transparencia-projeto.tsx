import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { useDataStore } from "../stores/data/useDataStore";
import { formatCurrency, formatStatus } from "../utils/formatters";

export function meta() {
  return [{ title: "Detalhes do projeto | Projeto Aberto" }];
}

export default function TransparenciaProjeto() {
  const { codigo } = useParams();
  const { transparency, loading, error, loadTransparencyProject } = useDataStore();

  useEffect(() => {
    if (codigo) void loadTransparencyProject(codigo);
  }, [codigo, loadTransparencyProject]);

  const project = transparency.project;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/transparencia" className="text-sm text-gov-primary hover:underline">
        ← Voltar para projetos
      </Link>

      {loading && <p className="mt-8 text-slate-600" role="status">Carregando projeto…</p>}

      {!loading && error && (
        <div className="mt-8 rounded-md bg-red-50 p-4 text-red-700" role="alert">
          Não foi possível carregar este projeto.
        </div>
      )}

      {!loading && !error && !project && (
        <p className="mt-8 rounded-md border border-slate-200 p-6 text-slate-600">
          Projeto não encontrado.
        </p>
      )}

      {!loading && !error && project && (
        <article className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">{project.codigo}</p>
              <h1 className="mt-1 text-2xl font-semibold text-gov-dark">{project.titulo}</h1>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {formatStatus(project.situacao)}
            </span>
          </div>

          <p className="mt-6 text-slate-700">{project.descricao}</p>

          <dl className="mt-6 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
            <Detail label="Órgão" value={project.orgao ?? "Não informado"} />
            <Detail label="Município" value={project.municipio ?? "Não informado"} />
            <Detail label="Início previsto" value={project.inicio_previsto ?? "Não informado"} />
            <Detail label="Término previsto" value={project.termino_previsto ?? "Não informado"} />
            <Detail label="Orçamento previsto" value={formatCurrency(project.orcamento_previsto)} />
            <Detail label="Valor executado" value={formatCurrency(project.valor_executado)} />
            <Detail label="Percentual concluído" value={`${project.percentual_concluido}%`} />
          </dl>
        </article>
      )}
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-800">{value}</dd>
    </div>
  );
}
