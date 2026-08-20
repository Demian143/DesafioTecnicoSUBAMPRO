import http from "./http";
import { useAuthStore } from "../stores/auth/useAuthStore";
import type {
  LoginResponse,
  ManagementProjectsResponse,
  ProjectFilters,
  TransparencyResponse,
  User,
} from "../stores/data/types";

export const api = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>("/login", { email, password });
    useAuthStore.getState().setToken(data.access_token);
    return data;
  },

  async me(): Promise<User> {
    const { data } = await http.get<User>("/me", { requiresAuth: true });
    return data;
  },

  async transparency(page = 1, perPage = 10): Promise<TransparencyResponse> {
    const { data } = await http.get<TransparencyResponse>("/transparencia/projetos", {
      params: { page, per_page: perPage },
    });
    return data;
  },

  async managementProjects(filters: ProjectFilters = {}): Promise<ManagementProjectsResponse> {
    const { data } = await http.get<ManagementProjectsResponse>("/gestao/projetos", {
      requiresAuth: true,
      params: filters,
    });
    return data;
  },
};
