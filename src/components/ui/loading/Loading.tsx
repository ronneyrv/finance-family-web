type LoadingProps = {
  message?: string
  className?: string
}

function Loading({ message = 'Carregando...', className = '' }: LoadingProps) {
  return <p className={['text-(--color-text-muted)', className].join(' ')}>{message}</p>
}

export default Loading
