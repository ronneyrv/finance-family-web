import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, WalletCards } from 'lucide-react'

import { useAuth } from '../../features/auth/hooks/useAuth'
import { ApiError } from '../../lib/api/apiError'

type LocationState = {
  from?: {
    pathname: string
  }
}

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const state = location.state as LocationState | null
  const destination = state?.from?.pathname ?? '/dashboard'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await login({
        email,
        password,
      })

      navigate(destination, { replace: true })
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setErrorMessage('E-mail ou senha inválidos.')
      } else {
        setErrorMessage('Não foi possível entrar. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-2">
          <div className="hidden flex-col justify-between bg-emerald-500 p-10 text-slate-950 lg:flex">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-950 p-3 text-emerald-400">
                <WalletCards size={28} />
              </div>

              <span className="text-xl font-bold">Finance Family</span>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                Finanças em família
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight">
                Organize hoje.
                <br />
                Planeje o amanhã.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-900">
                Acompanhe suas finanças, cartões, compras parceladas e metas em um único lugar.
              </p>
            </div>

            <p className="text-sm font-medium">Controle financeiro com visão compartilhada.</p>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="rounded-xl bg-emerald-400 p-2 text-slate-950">
                <WalletCards size={24} />
              </div>

              <span className="font-bold">Finance Family</span>
            </div>

            <div>
              <p className="text-sm font-medium text-emerald-400">Bem-vindo de volta</p>

              <h2 className="mt-2 text-3xl font-bold">Entre na sua conta</h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Use suas credenciais para acessar o painel financeiro.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="email">
                  E-mail
                </label>

                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />

                  <input
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                    id="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seu@email.com"
                    required
                    type="email"
                    value={email}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="password">
                  Senha
                </label>

                <div className="relative">
                  <LockKeyhole
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />

                  <input
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                    id="password"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Sua senha"
                    required
                    type="password"
                    value={password}
                  />
                </div>
              </div>

              {errorMessage && (
                <p
                  className="rounded-xl border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300"
                  role="alert"
                >
                  {errorMessage}
                </p>
              )}

              <button
                className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

export default LoginPage
