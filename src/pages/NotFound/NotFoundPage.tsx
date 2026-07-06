import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <section className="text-center">
        <p className="text-sm font-medium text-emerald-400">404</p>

        <h1 className="mt-2 text-3xl font-semibold">Página não encontrada</h1>

        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-950"
        >
          Voltar ao dashboard
        </Link>
      </section>
    </main>
  )
}

export default NotFoundPage
