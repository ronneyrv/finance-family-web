type UserAvatarProps = {
  name: string
  avatarUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  editable?: boolean
  onClick?: () => void
}

const sizes = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-16 w-16 text-lg',
  lg: 'h-24 w-24 text-2xl',
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function UserAvatar({ name, avatarUrl, size = 'lg', editable = false, onClick }: UserAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        onClick={onClick}
        className={`
                    ${sizes[size]}
                    rounded-full
                    object-cover
                    border
                    border-(--color-border)
                    ${editable ? 'cursor-pointer hover:opacity-80 transition' : ''}
                `}
      />
    )
  }

  return (
    <div
      onClick={onClick}
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-emerald-600 font-semibold text-white ${editable ? 'cursor-pointer hover:opacity-80 transition' : ''}`}
    >
      {getInitials(name)}
    </div>
  )
}

export default UserAvatar
