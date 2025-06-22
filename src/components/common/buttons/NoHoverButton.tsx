import * as React from 'react'
import { cn } from '../../../lib/utils'
import { Button } from '../../ui/button'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: 'primary' | 'secondary'
  className?: string
  children?: React.ReactNode
}

const NoHoverButton = ({
  mode = 'primary',
  className,
  children,
  ...rest
}: Props) => {
  const isPrimary = mode === 'primary'
  return (
    <Button
      className={cn(
        'min-w-[100px] shadow-none border-none text-base transition-colors',
        isPrimary
          ? 'text-primary hover:text-secondary'
          : 'text-secondary hover:text-primary',
        'hover:bg-transparent active:bg-background focus:bg-background',
        'disabled:cursor-not-allowed disabled:bg-transparent disabled:border-transparent',
        className,
      )}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default NoHoverButton
