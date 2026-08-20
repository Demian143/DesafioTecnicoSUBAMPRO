import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../services/api";
import { ApiError } from "../services/errors";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await api.login(email, password);
      navigate("/", { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) {
        setError(error.message || "Confira seu e-mail e sua senha.");
      } else if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Não foi possível entrar. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gov-dark">Entrar</h1>
        <p className="mt-2 text-sm text-slate-600">Acesse a área de gestão.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-gov-primary focus:ring-2 focus:ring-gov-primary/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-gov-primary focus:ring-2 focus:ring-gov-primary/20"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className="w-full nav-button disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <Link to="/" className="mt-4 inline-block text-sm text-gov-primary hover:underline">
          Voltar
        </Link>
      </div>
    </main>
  );
}
