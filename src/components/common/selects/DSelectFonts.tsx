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

const DSelectFonts = ({
  label,
  value,
  onChange,
  variant = 'column',
  children,
}: Props) => {
  const selected = children.find((child) => child.value === value)

  return (
    <div
      className={cn(variant === 'column' ? styles.columnsNoGap : styles.rowNoGap)}
    >
      {label && <Label className="mb-1 mt-1">{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="w-32"
          style={selected ? { fontFamily: String(selected.value) } : undefined}
        >
          <SelectValue
            placeholder={label}
            style={selected ? { fontFamily: String(selected.value) } : undefined}
          />
        </SelectTrigger>
        <SelectContent style={{ zIndex: 1000 }}>
          {children.map((child, index) => (
            <SelectItem 
              key={index}
              value={String(child.value)}
              style={{ fontFamily: String(child.value) }}
            >
              {child.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default DSelectFonts
