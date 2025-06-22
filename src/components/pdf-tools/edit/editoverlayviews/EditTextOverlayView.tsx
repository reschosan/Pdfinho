import { isEqual } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { setOverlays } from '../../../../store/pdfSlice'
import { RootState } from '../../../../store/store'
import DSlider from '../../../common/sliders/DSlider'
import DTextField from '../../../common/textfields/DTextField'
import { TextOptions } from '../interfaces/EditorOptions'
import { Overlay } from '../interfaces/TextOverlay'
import ColorPicker from '../../../common/colorpicker/ColorPicker'
import DSelectFonts from '../../../common/selects/DSelectFonts'
import { FontsText, TextSizes } from '../../../common/utils/Constants'
import { t } from 'i18next'
import { styles } from '../../PdfStyles'
import TabDescription from '../shared/TabDescription'

const EditTextOverlayView = () => {
  const dispatch = useDispatch()
  const { currentOverlayId, overlays } = useSelector((state: RootState) => state.pdf)

  const overlay = overlays.find((o) => o.id === currentOverlayId)
  if (!overlay) {
    console.error(`Overlay not found`)
    return null
  }
  const overlayOptions = overlay.options as TextOptions
  const { text, size, color, font } = overlayOptions

  const handleOnTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const updatedOverlay: Overlay = {
      ...overlay,
      options: {
        ...overlayOptions,
        text: value,
      },
    }
    const updatedOverlays = overlays.map((overlay) =>
      isEqual(overlay.id, currentOverlayId) ? updatedOverlay : overlay,
    )
    dispatch(setOverlays(updatedOverlays))
  }

  const handleOnSizeChange = (value: number[]) => {
    const newSize = value[0]
    const updatedOverlay: Overlay = {
      ...overlay,
      options: {
        ...overlayOptions,
        size: newSize,
      },
    }
    const updatedOverlays = overlays.map((overlay) =>
      isEqual(overlay.id, currentOverlayId) ? updatedOverlay : overlay,
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
    const updatedOverlays = overlays.map((overlay) =>
      isEqual(overlay.id, currentOverlayId) ? updatedOverlay : overlay,
    )
    dispatch(setOverlays(updatedOverlays))
  }

  const handleFontChange = (newFont: string) => {
    const updatedOverlay: Overlay = {
      ...overlay,
      options: {
        ...overlayOptions,
        font: newFont,
      },
    }
    const updatedOverlays = overlays.map((overlay) =>
      isEqual(overlay.id, currentOverlayId) ? updatedOverlay : overlay,
    )
    dispatch(setOverlays(updatedOverlays))
  }

  return (
    <div className={styles.tab}>
      <TabDescription tTitle="edit.dialog.tabs.addText.description" />

      <div className={styles.columns}>
        <DTextField
          label={t('edit.dialog.tabs.addText.text')}
          value={text}
          onChange={handleOnTextChange}
          autoFocus
          textStyle={{ fontFamily: font, fontSize: size, color: color }}
        />
        <div className="flex flex-row items-center w-full gap-2 mt-2">
          <div className="flex-1">
            <DSlider
              label={`${size}`}
              min={TextSizes[0]}
              max={TextSizes[TextSizes.length - 1]}
              value={[size]}
              onValueChange={handleOnSizeChange}
            />
          </div>
          <div>
            <ColorPicker value={color} onChange={handleColorChange} />
          </div>
        </div>
        <div className="w-full mt-2">
          <DSelectFonts
            label={t('edit.dialog.tabs.addText.font')}
            value={font}
            onChange={handleFontChange}
            children={FontsText}
          />
        </div>
      </div>
    </div>
  )
}

export default EditTextOverlayView
