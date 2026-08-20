import { create } from "zustand";
import { api } from "../../services/api";
import { toApiError } from "../../services/errors";
import type {
  ManagementProjectsResponse,
  Pagination,
  Project,
  ProjectFilters,
  PublicProject,
  PublicOrgan,
  TransparencySummary,
  TransparencyFilters,
  User,
} from "./types";

type DataState = {
  user: User | null;
  transparency: {
    projects: Pagination<PublicProject> | null;
    project: PublicProject | null;
    orgaos: PublicOrgan[];
    summary: TransparencySummary | null;
    lastUpdated: string | null;
  };
  managementProjects: Pagination<Project> | null;
  filters: ProjectFilters;
  loading: boolean;
  error: string | null;
  loadUser: () => Promise<void>;
  loadTransparency: (filters?: TransparencyFilters) => Promise<void>;
  loadTransparencyProject: (codigo: string) => Promise<void>;
  loadTransparencyOrgaos: () => Promise<void>;
  loadManagementProjects: (filters?: ProjectFilters) => Promise<void>;
  clearData: () => void;
};

export const useDataStore = create<DataState>((set, get) => ({
  user: null,
  transparency: { projects: null, project: null, orgaos: [], summary: null, lastUpdated: null },
  managementProjects: null,
  filters: { page: 1, per_page: 10 },
  loading: false,
  error: null,

  async loadUser() {
    await run(set, () => api.me(), (user) => set({ user }));
  },

  async loadTransparency(filters = {}) {
    await run(set, () => api.transparency(filters), (result) =>
      set({
        transparency: {
          projects: result.dados,
          project: get().transparency.project,
          orgaos: get().transparency.orgaos,
          summary: result.resumo,
          lastUpdated: result.ultima_atualizacao,
        },
      }),
    );
  },

  async loadTransparencyProject(codigo) {
    set({ transparency: { ...get().transparency, project: null } });
    await run(set, () => api.transparencyProject(codigo), (result) =>
      set({ transparency: { ...get().transparency, project: result.dados } }),
    );
  },

  async loadTransparencyOrgaos() {
    await run(set, () => api.transparencyOrgaos(), (result) =>
      set({ transparency: { ...get().transparency, orgaos: result.dados } }),
    );
  },

  async loadManagementProjects(filters) {
    const nextFilters = { ...get().filters, ...filters };
    await run(set, () => api.managementProjects(nextFilters), (result: ManagementProjectsResponse) =>
      set({ filters: nextFilters, managementProjects: result.data }),
    );
  },

  clearData() {
    set({
      user: null,
      transparency: { projects: null, project: null, orgaos: [], summary: null, lastUpdated: null },
      managementProjects: null,
      error: null,
    });
  },
}));

async function run<T>(
  set: (state: Partial<DataState>) => void,
  request: () => Promise<T>,
  onSuccess: (result: T) => void,
): Promise<void> {
  set({ loading: true, error: null });
  try {
    onSuccess(await request());
    set({ loading: false });
  } catch (error) {
    const apiError = toApiError(error);
    set({ loading: false, error: apiError.message });
    throw apiError;
  }
}
