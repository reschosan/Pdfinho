import { CheckboxOptions } from '../../interfaces/EditorOptions'
import { Overlay } from '../../interfaces/TextOverlay'

interface Props {
  overlay: Overlay
  scale: number
}
export const CheckboxOptionsRndChild = ({ overlay, scale }: Props) => {
  const { options } = overlay
  const { size, color } = options as CheckboxOptions
  return (
    <div
      style={{
        fontSize: size * scale,
        color: color,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      {'\u2713'}
    </div>
  )
}
