import { isEqual } from 'lodash'
import {
  isCheckboxOptions,
  isImageOptions,
  isSignatureOptions,
  isTextOptions,
} from '../interfaces/EditorOptions'
import { DraggableData, Position, Rnd } from 'react-rnd'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentOverlayId, setOverlays } from '../../../../store/pdfSlice'
import { TextOptionsRndChild } from './children/TextOptionsRndChild'
import { IMGOptionsRndChild } from './children/IMGOptionsRndChild'
import { CheckboxOptionsRndChild } from './children/CheckboxOptionsRndChild'
import { Overlay } from '../interfaces/TextOverlay'
import { RootState } from '../../../../store/store'
import { useRef, useState } from 'react'

interface Props {
  overlay: Overlay
  dragJustFinishedRef: React.RefObject<boolean>
}
const OverlayRnd = ({ overlay, dragJustFinishedRef }: Props) => {
  const dispatch = useDispatch()
  const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue(
    '--secondary',
  )

  const { overlays, pageNumber, overlayHit, currentOverlayId, scale } = useSelector(
    (state: RootState) => state.pdf,
  )

  const [hoveredOverlayId, setHoveredOverlayId] = useState<string | null>(null)

  const dragStartPos = useRef<{ x: number; y: number } | null>(null)

  if (!isEqual(overlay.page, pageNumber)) {
    return null
  }

  const handleOnResizeStop = (
    ref: HTMLElement,
    overlays: Overlay[],
    position: Position,
    scale: number,
    overlayId: string,
  ) => {
    const newWidth = parseFloat(ref.style.width)
    const newHeight = parseFloat(ref.style.height)

    const updatedOverlays = overlays.map((o) => {
      if (!isEqual(o.id, overlayId)) {
        return o
      }
      if (isImageOptions(o.options) || isSignatureOptions(o.options)) {
        return {
          ...o,
          x: position.x / scale,
          y: position.y / scale,
          options: {
            ...o.options,
            width: newWidth / scale,
            height: newHeight / scale,
          },
        }
      }
      if (isTextOptions(o.options) || isCheckboxOptions(o.options)) {
        return {
          ...o,
          x: position.x / scale,
          y: position.y / scale,
          options: {
            ...o.options,
            size: Math.round(Math.max(8, newHeight / scale / 1.2)),
          },
        }
      }
      return o
    })
    dispatch(setOverlays(updatedOverlays))
  }

  let width = 100
  let height = 40
  const { options } = overlay
  if (isTextOptions(options)) {
    width = options.text.length * (options.size * scale) * 0.6
    height = options.size * scale * 1.2
  } else if (isImageOptions(options) || isSignatureOptions(options)) {
    width = options.width * scale
    height = options.height * scale
  } else if (isCheckboxOptions(overlay.options)) {
    width = options.size * scale
    height = options.size * scale
  }

  const handleDragRef = (draggableData: DraggableData) => {
    if (
      dragStartPos.current &&
      (Math.abs(draggableData.x - dragStartPos.current.x) > 2 ||
        Math.abs(draggableData.y - dragStartPos.current.y) > 2)
    ) {
      if (dragJustFinishedRef) {
        dragJustFinishedRef.current = true
      }
    }
    dragStartPos.current = null
  }

  return (
    <Rnd
      key={overlay.id}
      size={{ width, height }}
      position={{ x: overlay.x * scale, y: overlay.y * scale }}
      onDragStart={(_e, d) => {
        dragStartPos.current = { x: d.x, y: d.y }
      }}
      onDragStop={(_e, draggableData) => {
        const updatedOverlays = overlays.map((o) =>
          isEqual(o.id, overlay.id)
            ? { ...o, x: draggableData.x / scale, y: draggableData.y / scale }
            : o,
        )
        dispatch(setOverlays(updatedOverlays))

        handleDragRef(draggableData)
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        handleOnResizeStop(ref, overlays, position, scale, overlay.id)
      }}
      bounds="parent"
      enableResizing={{
        bottomRight: true,
      }}
      style={{
        border:
          isEqual(currentOverlayId, overlay.id) ||
          isEqual(hoveredOverlayId, overlay.id)
            ? `2px dashed ${secondaryColor}`
            : 'transparent',
        borderRadius: 4,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
      disableDragging={false}
      onMouseEnter={() => {
        setHoveredOverlayId(overlay.id)
      }}
      onMouseLeave={() => {
        setHoveredOverlayId(null)
        if (!overlayHit) {
          dispatch(setCurrentOverlayId(undefined))
        }
      }}
    >
      {isTextOptions(options) && (
        <TextOptionsRndChild overlay={overlay} scale={scale} />
      )}
      {(isImageOptions(options) || isSignatureOptions(options)) && (
        <IMGOptionsRndChild overlay={overlay} />
      )}
      {isCheckboxOptions(options) && (
        <CheckboxOptionsRndChild overlay={overlay} scale={scale} />
      )}
    </Rnd>
  )
}
export default OverlayRnd
