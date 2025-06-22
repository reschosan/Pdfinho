import { t } from 'i18next'
import { isEqual, isNil } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { setEditorOptions, setOverlays } from '../../../../store/pdfSlice'
import { RootState } from '../../../../store/store'
import ColorPicker from '../../../common/colorpicker/ColorPicker'
import DSelectFonts from '../../../common/selects/DSelectFonts'
import DSlider from '../../../common/sliders/DSlider'
import DTextField from '../../../common/textfields/DTextField'
import { FontsSignature } from '../../../common/utils/Constants'
import { SignatureOptions } from '../interfaces/EditorOptions'
import { Overlay } from '../interfaces/TextOverlay'
import { styles } from '../../PdfStyles'
import TabDescription from '../shared/TabDescription'

const EditSignatureOverlayView = () => {
  const dispatch = useDispatch()
  const { currentOverlayId, overlays } = useSelector((state: RootState) => state.pdf)

  const currentOverlay = overlays.find((o) => o.id === currentOverlayId)
  if (!currentOverlay) {
    console.error(`Overlay not found`)
    return null
  }
  const overlayOptions = currentOverlay.options as SignatureOptions
  const { width, height, color, font, name, fontSize } = overlayOptions

  const generateSignature = (
    name: string,
    font: string,
    fontSize: number,
    colorOverride?: string,
  ): string => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = `${fontSize}px ${font}`
    ctx.fillStyle = colorOverride || color
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(name, canvas.width / 2, canvas.height / 2)
    return canvas.toDataURL('image/png')
  }

  // Handlers
  const handleOnTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newOptions: SignatureOptions = {
      ...overlayOptions,
      name: e.target.value,
    }
    if (fontSize) {
      const generatedSignature = generateSignature(e.target.value, font, fontSize)
      newOptions = { ...newOptions, src: generatedSignature }
    }
    updateOverlay(newOptions)
  }

  const handleOnSizeChange = (value: number[]) => {
    const newFontSize = value[0]
    let newOptions: SignatureOptions = {
      ...overlayOptions,
      fontSize: newFontSize,
    }
    if (name) {
      const generatedSignature = generateSignature(name, font, newFontSize)
      newOptions = { ...newOptions, src: generatedSignature }
    }
    updateOverlay(newOptions)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    let newOptions: SignatureOptions = {
      ...overlayOptions,
      color: newColor,
    }
    if (name && fontSize) {
      const generatedSignature = generateSignature(name, font, fontSize, newColor)
      newOptions = { ...newOptions, src: generatedSignature }
    }
    updateOverlay(newOptions)
  }

  const handleFontChange = (newFont: string) => {
    let newOptions: SignatureOptions = {
      ...overlayOptions,
      font: newFont,
    }
    if (name && fontSize) {
      const generatedSignature = generateSignature(name, newFont, fontSize, color)
      newOptions = { ...newOptions, src: generatedSignature }
    }
    updateOverlay(newOptions)
  }

  // Overlay-Update-Logik
  const updateOverlay = (newOptions: SignatureOptions) => {
    const updatedOverlay: Overlay = {
      ...currentOverlay,
      options: newOptions,
    }
    const updatedOverlays = overlays.map((overlay) =>
      isEqual(overlay.id, currentOverlayId) ? updatedOverlay : overlay,
    )
    dispatch(setOverlays(updatedOverlays))
    dispatch(setEditorOptions(newOptions))
  }

  return (
    <div className={styles.tab}>

      <TabDescription tTitle="edit.dialog.tabs.addSignature.description" />

      {!isNil(name) && (
        <DTextField value={name} onChange={handleOnTextChange} autoFocus />
      )}

      <div className="flex flex-row items-center w-full gap-2 mt-2">
        <div className="flex-1">
          {fontSize && (
            <DSlider
              label={fontSize}
              min={16}
              max={72}
              value={[fontSize]}
              onValueChange={handleOnSizeChange}
            />
          )}
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
          children={FontsSignature}
        />
      </div>
    </div>
  )
}

export default EditSignatureOverlayView
