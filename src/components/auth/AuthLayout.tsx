import type { ReactNode } from 'react'
import { WalletCards } from 'lucide-react'

type AuthLayoutProps = {
  badge: string
  title: string
  description: string
  children: ReactNode
}

export function AuthLayout({ badge, title, description, children }: AuthLayoutProps) {
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
              <p className="text-sm font-medium text-emerald-400">{badge}</p>

              <h2 className="mt-2 text-3xl font-bold">{title}</h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
            </div>

            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
    </main>
  )
}
