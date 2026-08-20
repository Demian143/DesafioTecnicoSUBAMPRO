export type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type User = {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  orgao_id: number;
  ativo: boolean;
};

export type Pagination<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  per_page: number;
  to: number | null;
  total: number;
};

export type PublicProject = {
  codigo: string;
  titulo: string;
  descricao: string | null;
  orgao: string | null;
  municipio: string | null;
  situacao: string;
  inicio_previsto: string | null;
  termino_previsto: string | null;
  orcamento_previsto: number;
  valor_executado: number;
  percentual_concluido: number;
};

export type PublicOrgan = {
  id: number;
  sigla: string;
  nome: string;
};

export type Project = PublicProject & {
  id: number;
  resumo: string | null;
  orgao_id: number;
  status: string;
  publicado: boolean;
  responsavel_id: number | null;
};

export type ProjectFilters = {
  page?: number;
  per_page?: number;
  orgao_id?: number;
  status?: string;
};

export type TransparencyFilters = {
  page?: number;
  per_page?: number;
  situacao?: "planejado" | "em_andamento" | "suspenso" | "concluido";
  orgao?: number;
};

export type TransparencySummary = {
  projetos_publicados: number;
  valor_total_planejado: number;
  valor_total_executado: number;
};

export type TransparencyResponse = {
  ultima_atualizacao: string | null;
  resumo: TransparencySummary;
  filtros_aplicados?: Pick<TransparencyFilters, "situacao" | "orgao">;
  dados: Pagination<PublicProject>;
};

export type PublicProjectResponse = {
  dados: PublicProject;
};

export type PublicOrgansResponse = {
  dados: PublicOrgan[];
};

export type ManagementProjectsResponse = {
  filtros_aplicados: ProjectFilters;
  data: Pagination<Project>;
};
