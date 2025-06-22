import { TextOptions } from '../../interfaces/EditorOptions'
import { Overlay } from '../../interfaces/TextOverlay'

interface Props {
  overlay: Overlay
  scale: number
}
export const TextOptionsRndChild = ({ overlay, scale }: Props) => {
  const { options } = overlay
  const { size, font, color, text } = options as TextOptions
  return (
    <div
      style={{
        fontSize: size * scale,
        fontFamily: font,
        color: color,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      {text}
    </div>
  )
}
