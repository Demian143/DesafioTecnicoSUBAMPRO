import http from "./http";
import { useAuthStore } from "../stores/auth/useAuthStore";
import type {
  LoginResponse,
  ManagementProjectsResponse,
  ProjectFilters,
  PublicOrgansResponse,
  PublicProjectResponse,
  TransparencyResponse,
  TransparencyFilters,
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

  async transparency(filters: TransparencyFilters = {}): Promise<TransparencyResponse> {
    const { data } = await http.get<TransparencyResponse>("/transparencia/projetos", {
      params: filters,
    });
    return data;
  },

  async transparencyProject(codigo: string): Promise<PublicProjectResponse> {
    const { data } = await http.get<PublicProjectResponse>(
      `/transparencia/projetos/${encodeURIComponent(codigo)}`,
    );
    return data;
  },

  async transparencyOrgaos(): Promise<PublicOrgansResponse> {
    const { data } = await http.get<PublicOrgansResponse>("/transparencia/orgaos");
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
