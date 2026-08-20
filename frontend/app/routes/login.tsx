import { Link } from "react-router";

export default function Login() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gov-dark">Login</h1>
      <p className="mt-2 text-slate-600">The login page will be implemented next.</p>
      <Link to="/" className="mt-6 inline-block nav-button">
        Back
      </Link>
    </main>
  );
}
