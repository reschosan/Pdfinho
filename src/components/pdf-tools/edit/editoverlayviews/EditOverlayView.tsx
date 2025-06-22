import { t } from 'i18next'
import { isEqual } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { Rnd } from 'react-rnd'
import {
  setCurrentOverlayId,
  setOverlayHit,
  setOverlays,
} from '../../../../store/pdfSlice'
import { RootState } from '../../../../store/store'
import DButtonGroup from '../../../common/buttongroups/DButtonGroup'
import DIconButton from '../../../common/buttons/DIconButton'
import {
  isCheckboxOptions,
  isImageOptions,
  isSignatureOptions,
  isTextOptions,
} from '../interfaces/EditorOptions'
import EditCheckboxOverlayView from './EditCheckboxOverlayView'
import EditImageOverlayView from './EditImageOverlayView'
import EditSignatureOverlayView from './EditSignatureOverlayView'
import EditTextOverlayView from './EditTextOverlayView'
import { X, Trash2, Move } from 'lucide-react'
import { Card } from '../../../ui/card'
import { Button } from '../../../ui/button'

const EditOverlayView = () => {
  const dispatch = useDispatch()

  const { currentOverlayId, overlays, scale } = useSelector(
    (state: RootState) => state.pdf,
  )

  const overlay = overlays.find((o) => o.id === currentOverlayId)

  if (!overlay) {
    console.error(`Overlay not found`)
    return null
  }

  const handleOnDelete = () => {
    const updatedOverlays = overlays.filter(
      (overlay) => !isEqual(overlay.id, currentOverlayId),
    )
    dispatch(setOverlays(updatedOverlays))
    dispatch(setOverlayHit(false))
    dispatch(setCurrentOverlayId(undefined))
  }

  const handleOnClose = () => {
    dispatch(setOverlayHit(false))
  }

  const left = overlay.x * scale
  const top = overlay.y * scale

  return (
    <Rnd
      default={{
        x: left,
        y: top,
        width: 320,
        height: 'auto',
      }}
      enableResizing={false}
      style={{
        zIndex: 1000,
        position: 'absolute',
      }}
    >
      <Card className="p-2 shadow-lg max-w-fit bg-accent relative">
        {/* Kopfzeile mit Drag-Handle und Schließen */}
        <div className="flex items-center gap-1 mb-2 sm:drag-only cursor-move">
          <DIconButton className="cursor-move hover:bg-transparent" tabIndex={-1}>
            <Move size={16} />
          </DIconButton>
          <div className="flex-1" />
          <DIconButton onClick={handleOnClose}>
            <X size={16} />
          </DIconButton>
        </div>

        {isTextOptions(overlay.options) && <EditTextOverlayView />}
        {isSignatureOptions(overlay.options) && <EditSignatureOverlayView />}
        {isImageOptions(overlay.options) && <EditImageOverlayView />}
        {isCheckboxOptions(overlay.options) && <EditCheckboxOverlayView />}

        <DButtonGroup>
          <DIconButton onClick={handleOnDelete} mode="secondary">
            <Trash2 />
          </DIconButton>
          <Button
            variant={'ghost'}
            className="justify-end hover:bg-primary/10 hover:text-secondary"
            onClick={handleOnClose}
          >
            {t('button.ok')}
          </Button>
        </DButtonGroup>
      </Card>
    </Rnd>
  )
}

export default EditOverlayView
