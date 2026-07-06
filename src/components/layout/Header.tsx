function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 sm:px-6">
      <div>
        <p className="text-sm text-slate-400">Finance Family</p>
      </div>

      <div
        className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 font-semibold text-slate-950"
        aria-label="Usuário"
      >
        U
      </div>
    </header>
  )
}

export default Header
