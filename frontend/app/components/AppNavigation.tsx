import { Link, NavLink, useNavigate } from "react-router";
import { useAuthStore } from "../stores/auth/useAuthStore";

export function AppNavigation() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);

  function logout() {
    clearToken();
    navigate("/");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="font-semibold text-gov-dark">
          Projeto Aberto
        </Link>

        <div className="flex items-center gap-2">
          {token ? (
            <>
              <button type="button" disabled className="nav-placeholder">
                Transparência
              </button>
              <button type="button" disabled className="nav-placeholder">
                Gestão
              </button>
              <button type="button" onClick={logout} className="nav-button">
                Sair
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-button">
              Entrar
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
