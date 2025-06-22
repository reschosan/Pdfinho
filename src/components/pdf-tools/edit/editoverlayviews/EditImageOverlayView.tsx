import { isEqual } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { setOverlays } from '../../../../store/pdfSlice'
import { RootState } from '../../../../store/store'
import DTextField from '../../../common/textfields/DTextField'
import { styles } from '../../PdfStyles'
import { ImageOptions } from '../interfaces/EditorOptions'
import { Overlay } from '../interfaces/TextOverlay'
import TabDescription from '../shared/TabDescription'
import { t } from 'i18next'

const EditImageOverlayView = () => {
  const dispatch = useDispatch()
  const { currentOverlayId, overlays } = useSelector((state: RootState) => state.pdf)

  const overlay = overlays.find((o) => o.id === currentOverlayId)
  if (!overlay) {
    console.error('Overlay not found')
    return null
  }
  const overlayOptions = overlay.options as ImageOptions
  const { width, height } = overlayOptions

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Math.max(0, Number(e.target.value))
    const updatedOverlay: Overlay = {
      ...overlay,
      options: {
        ...overlayOptions,
        width: newWidth,
      },
    }
    const updatedOverlays = overlays.map((o) =>
      isEqual(o.id, currentOverlayId) ? updatedOverlay : o,
    )
    dispatch(setOverlays(updatedOverlays))
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Math.max(0, Number(e.target.value))
    const updatedOverlay: Overlay = {
      ...overlay,
      options: {
        ...overlayOptions,
        height: newHeight,
      },
    }
    const updatedOverlays = overlays.map((o) =>
      isEqual(o.id, currentOverlayId) ? updatedOverlay : o,
    )
    dispatch(setOverlays(updatedOverlays))
  }

  return (
    <div className={styles.tab}>
      <TabDescription tTitle="edit.dialog.tabs.addImage.description" />
      <div className={styles.columns}>
        <div className={styles.row}>
          <DTextField
            type="number"
            label={t('edit.dialog.tabs.addImage.width')} 
            value={width}
            onChange={handleWidthChange}
            slotProps={{
              htmlInput: {
                min: 0,
                step: 1,
                style: { textAlign: 'center', width: 60 },
              },
            }}
          />
          <DTextField
            type="number"
            label={t('edit.dialog.tabs.addImage.height')} 
            value={height}
            onChange={handleHeightChange}
            slotProps={{
              htmlInput: {
                min: 0,
                step: 1,
                style: { textAlign: 'center', width: 60 },
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default EditImageOverlayView
