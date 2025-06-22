import { isEqual } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { cn } from '../../../../lib/utils'
import { setOverlays } from '../../../../store/pdfSlice'
import { RootState } from '../../../../store/store'
import ColorPicker from '../../../common/colorpicker/ColorPicker'
import DSlider from '../../../common/sliders/DSlider'
import { styles } from '../../PdfStyles'
import { CheckboxOptions } from '../interfaces/EditorOptions'
import { Overlay } from '../interfaces/TextOverlay'
import TabDescription from '../shared/TabDescription'

const EditCheckboxOverlayView = () => {
  const dispatch = useDispatch()
  const { currentOverlayId, overlays } = useSelector((state: RootState) => state.pdf)

  const overlay = overlays.find((o) => o.id === currentOverlayId)
  if (!overlay) {
    console.error('Overlay not found')
    return null
  }
  const overlayOptions = overlay.options as CheckboxOptions
  const { size, color } = overlayOptions

  const handleSizeChange = (value: number[]) => {
    const newSize = value[0]
    const updatedOverlay: Overlay = {
      ...overlay,
      options: {
        ...overlayOptions,
        size: newSize,
      },
    }
    const updatedOverlays = overlays.map((o) =>
      isEqual(o.id, currentOverlayId) ? updatedOverlay : o,
    )
    dispatch(setOverlays(updatedOverlays))
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    const updatedOverlay: Overlay = {
      ...overlay,
      options: {
        ...overlayOptions,
        color: newColor,
      },
    }
    const updatedOverlays = overlays.map((o) =>
      isEqual(o.id, currentOverlayId) ? updatedOverlay : o,
    )
    dispatch(setOverlays(updatedOverlays))
  }

  return (
    <div className={styles.tab}>
      <div>
        <TabDescription tTitle="edit.dialog.tabs.addCheckbox.description" />
      </div>
      <div className={styles.columns}>
        <span
          style={{
            fontSize: size,
            color: color,
            userSelect: 'none',
            lineHeight: 1,
            fontFamily: 'ZapfDingbats',
          }}
        >
          {'\u2713'}
        </span>
        <div className={styles.row}>
          <div className={cn(styles.columns, 'flex-9')}>
            <DSlider
              label={`${size}`}
              min={8}
              max={72}
              value={[size]}
              onValueChange={handleSizeChange}
            />
          </div>
          <div className="flex-1">
            <ColorPicker value={color} onChange={handleColorChange} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditCheckboxOverlayView
