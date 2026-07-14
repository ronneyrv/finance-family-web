import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, User, Users } from 'lucide-react'

import { AuthLayout } from '../../components/auth/AuthLayout'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { ApiError } from '../../lib/api/apiError'

function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [householdName, setHouseholdName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await register({
        name,
        householdName,
        email,
        password,
      })

      navigate('/login', {
        replace: true,
        state: {
          registered: true,
        },
      })
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Não foi possível criar sua conta.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      badge="Bem-vindo"
      title="Crie sua conta"
      description="Comece a organizar as finanças da sua família."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="name">
            Nome
          </label>

          <div className="relative">
            <User
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />

            <input
              autoComplete="name"
              autoFocus
              disabled={isSubmitting}
              id="name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Seu nome"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="householdName">
            Família
          </label>

          <div className="relative">
            <Users
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />

            <input
              autoComplete="organization"
              disabled={isSubmitting}
              id="householdName"
              type="text"
              required
              value={householdName}
              onChange={(event) => setHouseholdName(event.target.value)}
              placeholder="Ex.: Família Vieira"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
        </div>

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
              disabled={isSubmitting}
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
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
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Sua senha"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="rounded-xl border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300"
          >
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </button>

        <p className="text-center text-sm text-slate-400">
          Já possui uma conta?{' '}
          <Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
