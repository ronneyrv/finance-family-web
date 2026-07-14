import { useState, type SubmitEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail } from 'lucide-react'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { ApiError } from '../../lib/api/apiError'

type LocationState = {
  from?: {
    pathname: string
  }
  registered?: boolean
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
  const registered = state?.registered === true
  const destination = state?.from?.pathname ?? '/dashboard'

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
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
    <AuthLayout
      badge="Bem-vindo de volta"
      title="Entre na sua conta"
      description="Use suas credenciais para acessar o painel financeiro."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
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
              autoFocus
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Sua senha"
              required
              type="password"
              value={password}
            />
          </div>
        </div>

        {registered && (
          <p
            role="status"
            className="rounded-xl border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300"
          >
            Conta criada com sucesso. Faça login para continuar.
          </p>
        )}

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
        <p className="text-center text-sm text-slate-400">
          Ainda não possui uma conta?{' '}
          <Link to="/register" className="font-medium text-emerald-400 hover:text-emerald-300">
            Criar conta
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
