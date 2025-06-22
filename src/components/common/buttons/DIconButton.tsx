import * as React from 'react'
import { Button } from '../../ui/button'
import { cn } from '../../../lib/utils'

type Mode = 'primary' | 'secondary' | 'error'

interface Props extends React.ComponentPropsWithoutRef<'button'> {
  mode?: Mode
  children: React.ReactNode
}

const modeClasses: Record<Mode, string> = {
  primary: 'text-primary hover:text-secondary',
  secondary: 'text-secondary hover:text-primary',
  error: 'text-destructive hover:text-primary',
}

const DIconButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, mode = 'primary', children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        'border-none shadow-none bg-transparent transition-colors sm:p-2',
        modeClasses[mode],
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  ),
)
DIconButton.displayName = 'DIconButton'

export default DIconButton
