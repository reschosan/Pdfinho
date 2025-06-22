import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { randomId } from '../utils/Constants'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string
  type?: 'text' | 'number' | 'email' | 'password'
  label?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string | number
  placeholder?: string
  textStyle?: React.CSSProperties
  slotProps?: {
    htmlInput?: React.InputHTMLAttributes<HTMLInputElement>
  }
}

const DTextField = ({
  id = randomId(),
  type = 'text',
  label,
  onChange,
  value,
  placeholder,
  textStyle,
  slotProps,
  ...rest
}: Props) => {
  return (
    <div className="w-full flex flex-col items-center">
      {label && (
        <Label className="mb-1 mt-1" htmlFor={id}>
          {label}
        </Label>
      )}
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        {...(placeholder ? { placeholder } : {})}
        {...(placeholder && !label ? { 'aria-label': placeholder } : {})}
        style={{ textAlign: 'center', ...textStyle }}
        className="border-b border-input bg-transparent px-2 py-1 text-center focus:outline-none focus:border-primary transition-colors w-full"
        {...(slotProps?.htmlInput || {})}
        {...rest}
      />
    </div>
  )
}

export default DTextField
