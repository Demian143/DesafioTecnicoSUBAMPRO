import { create } from "zustand";
import { api } from "../../services/api";
import type {
  ManagementProjectsResponse,
  Pagination,
  Project,
  ProjectFilters,
  PublicProject,
  TransparencySummary,
  User,
} from "./types";

type DataState = {
  user: User | null;
  transparency: {
    projects: Pagination<PublicProject> | null;
    summary: TransparencySummary | null;
    lastUpdated: string | null;
  };
  managementProjects: Pagination<Project> | null;
  filters: ProjectFilters;
  loading: boolean;
  error: string | null;
  loadUser: () => Promise<void>;
  loadTransparency: (page?: number, perPage?: number) => Promise<void>;
  loadManagementProjects: (filters?: ProjectFilters) => Promise<void>;
  clearData: () => void;
};

export const useDataStore = create<DataState>((set, get) => ({
  user: null,
  transparency: { projects: null, summary: null, lastUpdated: null },
  managementProjects: null,
  filters: { page: 1, per_page: 10 },
  loading: false,
  error: null,

  async loadUser() {
    await run(set, () => api.me(), (user) => set({ user }));
  },

  async loadTransparency(page = 1, perPage = 10) {
    await run(set, () => api.transparency(page, perPage), (result) =>
      set({
        transparency: {
          projects: result.dados,
          summary: result.resumo,
          lastUpdated: result.ultima_atualizacao,
        },
      }),
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
      transparency: { projects: null, summary: null, lastUpdated: null },
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
    set({ loading: false, error: error instanceof Error ? error.message : "Request failed" });
    throw error;
  }
}
