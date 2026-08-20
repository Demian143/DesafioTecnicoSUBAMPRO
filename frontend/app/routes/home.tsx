import type { Route } from "./+types/home";
import { Navigate } from "react-router";
import { useAuthStore } from "../stores/auth/useAuthStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projeto Aberto" },
    { name: "description", content: "Portal de acompanhamento de projetos públicos." },
  ];
}

export default function Home() {
  const token = useAuthStore((state) => state.token);

  return <Navigate to={token ? "/gestao" : "/transparencia"} replace />;
}
