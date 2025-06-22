import { cn } from '../../../lib/utils'
import { styles } from '../../pdf-tools/PdfStyles'
import { Label } from '../../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'

interface DSelectChildren {
  value: string | number
  label: string
}

interface Props {
  label?: string
  value: string
  onChange: (value: string) => void
  children: DSelectChildren[]
  variant?: 'column' | 'row'
}

const DSelect = ({
  label,
  value,
  onChange,
  variant = 'column',
  children,
}: Props) => {
  return (
    <div
      className={cn(variant === 'column' ? styles.columnsNoGap : styles.rowNoGap)}
    >
      {label && <Label className="mb-1 mt-1 text-primary">{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {children.map((child, index) => (
            <SelectItem key={index} value={String(child.value)}>
              {child.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default DSelect
