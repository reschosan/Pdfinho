import { t } from 'i18next'
import { gte, isEqual, lte } from 'lodash'
import { MoveLeft, MoveRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { pdfjs } from 'react-pdf'
import { useDispatch, useSelector } from 'react-redux'
import {
  setCoordinates,
  setCurrentOverlayId,
  setEditDialogOpen,
  setOverlayHit,
  setOverlays,
  setPageNumber,
} from '../../../store/pdfSlice'
import { RootState } from '../../../store/store'
import DButtonGroup from '../../common/buttongroups/DButtonGroup'
import DIconButton from '../../common/buttons/DIconButton'
import { styles } from '../PdfStyles'
import {
  isCheckboxOptions,
  isImageOptions,
  isSignatureOptions,
  isTextOptions,
} from './interfaces/EditorOptions'
import { ResizeOpts } from './interfaces/ResizeOpts'
import { Overlay } from './interfaces/TextOverlay'
import OverlayRnd from './rnd/OverlayRnd'

interface Props {
  overlayContainerRef: React.RefObject<HTMLDivElement | null>
}

const PdfViewer = ({ overlayContainerRef }: Props) => {
  const dispatch = useDispatch()
  const pdfBase64 = useSelector((state: RootState) => state.pdf.pdfBases[0])
  const { overlays, pageNumber, currentOverlayId, scale } = useSelector(
    (state: RootState) => state.pdf,
  )

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dragJustFinishedRef = useRef(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pdfDoc, setPdfDoc] = useState<any>()

  const [dragOffset, setDragOffset] = useState<{
    offsetX: number
    offsetY: number
  } | null>(null)
  const [resizingOverlayId, setResizingOverlayId] = useState<string | null>(null)
  const [resizeStart, setResizeStart] = useState<ResizeOpts | null>(null)

  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!pdfBase64) {
      return
    }
    pdfjs.getDocument(pdfBase64).promise.then(setPdfDoc)
  }, [pdfBase64])

  const renderPage = useCallback(
    async (pageNum: number) => {
      const canvas = canvasRef.current
      if (!canvas || !pdfDoc) {
        return
      }

      const page = await pdfDoc.getPage(pageNum)
      const viewport = page.getViewport({ scale })
      const ctx = canvas.getContext('2d')!
      canvas.width = viewport.width
      canvas.height = viewport.height
      await page.render({ canvasContext: ctx, viewport }).promise
    },
    [pdfDoc, scale],
  )

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pageNumber)
    }
  }, [pdfDoc, pageNumber, renderPage])

  const nextPage = () => {
    if (pdfDoc && pageNumber < pdfDoc.numPages) {
      dispatch(setPageNumber(pageNumber + 1))
      resetFocusOverlay()
    }
  }

  const prevPage = () => {
    if (pageNumber > 1) {
      dispatch(setPageNumber(pageNumber - 1))
      resetFocusOverlay()
    }
  }

  const resetFocusOverlay = () => {
    dispatch(setOverlayHit(false))
    dispatch(setCurrentOverlayId(undefined))
  }

  const handleMouseUp = () => {
    setDragging(false)
    setDragOffset(null)
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !currentOverlayId || !dragOffset || !overlayContainerRef) {
      return
    }

    const container = overlayContainerRef.current
    if (!container) {
      return
    }

    const rect = container.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const newX = mouseX - dragOffset.offsetX
    const newY = mouseY - dragOffset.offsetY

    const updatedOverlays = overlays.map((overlay: Overlay) =>
      isEqual(overlay.id, currentOverlayId)
        ? { ...overlay, x: newX, y: newY }
        : overlay,
    )
    dispatch(setOverlays(updatedOverlays))
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (dragJustFinishedRef.current) {
      dragJustFinishedRef.current = false
      return // ignore clicks immediately after dragging
    }

    if (!overlayContainerRef || !overlayContainerRef.current) {
      return
    }
    const container = overlayContainerRef.current

    const rect = container.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Check if the click is on an existing overlay
    const hit = overlays.find((o) => {
      if (!isEqual(o.page, pageNumber)) {
        return false
      }

      // Calculate the width and height based on the overlay type
      let width = 0
      let height = 0

      if (isTextOptions(o.options)) {
        width = o.options.text.length * (o.options.size * scale) * 0.6 // approximate width per character
        height = o.options.size * scale * 1.2
      } else if (isImageOptions(o.options) || isSignatureOptions(o.options)) {
        width = o.options.width * scale
        height = o.options.height * scale
      } else if (isCheckboxOptions(o.options)) {
        width = o.options.size * scale
        height = o.options.size * scale
      }

      return (
        clickX >= o.x * scale &&
        clickX <= o.x * scale + width &&
        clickY >= o.y * scale &&
        clickY <= o.y * scale + height
      )
    })

    if (hit) {
      dispatch(setCurrentOverlayId(hit.id))
      dispatch(setOverlayHit(true))
    } else if (currentOverlayId) {
      dispatch(setCurrentOverlayId(undefined))
      dispatch(setOverlayHit(false))
      return
    } else {
      console.log(`Overlay hit`)
      dispatch(setCoordinates({ x: clickX / scale, y: clickY / scale }))
      dispatch(setEditDialogOpen(true))
    }
  }

  const handleResizeMouseMove = (e: React.MouseEvent) => {
    if (!resizingOverlayId || !resizeStart) {
      return
    }
    const dx = (e.clientX - resizeStart.mouseX) / scale
    const dy = (e.clientY - resizeStart.mouseY) / scale

    const updatedOverlays = overlays.map((o) => {
      if (o.id !== resizingOverlayId) {
        return o
      }
      if (isImageOptions(o.options) || isSignatureOptions(o.options)) {
        return {
          ...o,
          options: {
            ...o.options,
            width: Math.max(10, o.options.width + dx),
            height: Math.max(10, o.options.height + dy),
          },
        }
      }
      if (isTextOptions(o.options) || isCheckboxOptions(o.options)) {
        return {
          ...o,
          options: {
            ...o.options,
            size: Math.max(8, o.options.size + dx * 0.2),
          },
        }
      }
      return o
    })
    dispatch(setOverlays(updatedOverlays))
  }

  const handleResizeMouseUp = () => {
    setResizingOverlayId(null)
    setResizeStart(null)
  }

  return (
    <div className={styles.PdfViewer}>
      <div
        className="relative inline-block cursor-crosshair border border-[#e3e8f0] max-w-[1200px]"
        onMouseMove={(e) => {
          handleMouseMove(e)
          handleResizeMouseMove(e)
        }}
        onMouseUp={() => {
          handleMouseUp()
          handleResizeMouseUp()
        }}
        onTouchEnd={(e) => {
          // Touch-Event conversion to Mouse-Event
          if (e.touches.length === 0 && e.changedTouches.length > 0) {
            const touch = e.changedTouches[0]
            handleCanvasClick({
              clientX: touch.clientX,
              clientY: touch.clientY,
              preventDefault: () => {},
              stopPropagation: () => {},
            } as unknown as React.MouseEvent)
          }
        }}
      >
        <canvas className="w-full" ref={canvasRef} />
        <div
          ref={overlayContainerRef}
          onClick={handleCanvasClick}
          className="absolute top-0 left-0 w-full h-full"
          style={{ pointerEvents: 'auto' }}
        >
          {overlays
            .filter((o) => isEqual(o.page, pageNumber))
            .map((filtered) => (
              <OverlayRnd
                key={filtered.id}
                overlay={filtered}
                dragJustFinishedRef={dragJustFinishedRef}
              />
            ))}
        </div>
      </div>
      <DButtonGroup>
        <DIconButton
          aria-label={t('button.previous')}
          onClick={prevPage}
          disabled={lte(pageNumber, 1)}
        >
          <MoveLeft />
        </DIconButton>
        <DIconButton
          aria-label={t('button.next')}
          onClick={nextPage}
          disabled={!pdfDoc || gte(pageNumber, pdfDoc.numPages)}
        >
          <MoveRight />
        </DIconButton>
      </DButtonGroup>
    </div>
  )
}

export default PdfViewer
