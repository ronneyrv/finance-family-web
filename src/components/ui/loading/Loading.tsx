import { cn } from '../../../lib/utils/cn'

type LoadingProps = {
  message?: string
  className?: string
}

function Loading({ message = 'Carregando...', className }: LoadingProps) {
  return <p className={cn('text-(--color-text-muted)', className)}>{message}</p>
}

export default Loading
