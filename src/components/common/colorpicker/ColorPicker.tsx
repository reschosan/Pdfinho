import { cn } from '../../../lib/utils'
import { styles } from '../../pdf-tools/PdfStyles'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'

type variant = 'column' | 'row'

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  label?: string
  value: string
  variant?: variant
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const ColorPicker = ({
  label,
  value,
  variant = 'column',
  onChange,
  ...rest
}: Props) => {
  const id = `color-picker-${Math.random().toString(36).substring(2, 15)}`
  return (
    <div
      className={cn(variant === 'column' ? styles.columnsNoGap : styles.rowNoGap)}
    >
      {label && (
        <Label className="mb-1 mt-1" htmlFor={id}>
          {label}
        </Label>
      )}
      <Input
        id={id}
        type="color"
        value={value}
        onChange={onChange}
        style={{
          border: 'none',
          background: value,

          cursor: 'pointer',
        }}
        {...rest}
      />
    </div>
  )
}
export default ColorPicker
