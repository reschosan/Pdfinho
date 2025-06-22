import { Label } from '../../ui/label'
import { Slider } from '../../ui/slider'

interface Props extends React.ComponentProps<typeof Slider> {
  label?: string | number
  value: number[]
  min?: number
  max?: number
  className?: string
  onValueChange?: (value: number[]) => void
}

const DSlider = ({
  onValueChange,
  label,
  value,
  min = 8,
  max = 72,
  className,
  ...rest
}: Props) => {
  return (
    <div className={`w-full mt-1 ${className || ''}`}>
      {label && <Label className="mb-1 block">{label}</Label>}
      <Slider
        min={min}
        max={max}
        value={value}
        onValueChange={onValueChange}
        {...rest}
      />
    </div>
  )
}

export default DSlider
