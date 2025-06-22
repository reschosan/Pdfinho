import { SignatureOptions, ImageOptions } from '../../interfaces/EditorOptions'
import { Overlay } from '../../interfaces/TextOverlay'

interface Props {
  overlay: Overlay
}

export const IMGOptionsRndChild = ({ overlay }: Props) => {
  const { options } = overlay
  const { src } = options as SignatureOptions | ImageOptions
  return (
    <img
      src={src}
      alt=""
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
    />
  )
}
