import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projeto Aberto" },
    { name: "description", content: "Portal de acompanhamento de projetos públicos." },
  ];
}

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gov-dark">Bem-vindo</h1>
    </main>
  );
}
