import { t } from 'i18next'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setEditorOptions } from '../../../../store/pdfSlice'
import ColorPicker from '../../../common/colorpicker/ColorPicker'
import DSelectFonts from '../../../common/selects/DSelectFonts'
import DSlider from '../../../common/sliders/DSlider'
import DTextField from '../../../common/textfields/DTextField'
import { FontsSignature } from '../../../common/utils/Constants'
import { styles } from '../../PdfStyles'
import { EditorType, SignatureOptions } from '../interfaces/EditorOptions'
import TabDescription from '../shared/TabDescription'

const AddSignatureTab = () => {
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [generatedSignature, setGeneratedSignature] = useState<string | null>(null)
  const [font, setFont] = useState(FontsSignature[FontsSignature.length - 1].value)
  const [fontSize, setFontSize] = useState(36)

  const [fontColor, setFontColor] = useState('#000000')

  const [previewWidth, setPreviewWidth] = useState(300)
  const previewHeight = Math.round(previewWidth / 4)

  useEffect(() => {
    const options: SignatureOptions = {
      type: EditorType.Signature,
      width: previewWidth,
      height: previewHeight,
      color: fontColor,
      font: font,
      src: generatedSignature!,
      name,
      fontSize,
    }
    dispatch(setEditorOptions(options))
  }, [
    previewWidth,
    fontColor,
    font,
    generatedSignature,
    previewHeight,
    dispatch,
    name,
    fontSize,
  ])

  const generateSignature = (name: string, font: string, fontSize: number) => {
    const canvas = document.createElement('canvas')
    canvas.width = previewWidth
    canvas.height = previewHeight
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = `${fontSize}px ${font}`
    ctx.fillStyle = fontColor
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(name, canvas.width / 2, canvas.height / 2)
    setGeneratedSignature(canvas.toDataURL('image/png'))
  }

  const handleFontColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontColor(e.target.value)
    generateSignature(name, font, fontSize)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)

    if (isEmpty(e.target.value)) {
      setGeneratedSignature(null)
      return
    }
    generateSignature(e.target.value, font, fontSize)
  }
  const handleFontChange = (value: string) => {
    setFont(value)
    generateSignature(name, value, fontSize)
  }
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = Number(e.target.value)
    setFontSize(size)
    generateSignature(name, font, size)
  }

  return (
    <div className={styles.tab}>
      <TabDescription tTitle="edit.dialog.tabs.addSignature.description" />
      {/* Option 1: Name eingeben und generieren */}
      <div className={styles.columnsNoGap}>
        <p className="text-sm mb-1 text-nowrap">
          {t('edit.dialog.tabs.addSignature.nameOption')}
        </p>
        <DTextField
          autoFocus
          onChange={handleNameChange}
          value={name}
          placeholder={t('label.name')}
        />
        <div className={styles.row}>
          <DSelectFonts
            label={t('edit.dialog.tabs.addText.font')}
            onChange={handleFontChange}
            value={font}
            children={FontsSignature}
          />

          <DTextField
            type="number"
            label={t('edit.dialog.tabs.addText.size')}
            value={fontSize}
            onChange={handleFontSizeChange}
            slotProps={{
              htmlInput: {
                min: 16,
                max: 72,
                step: 2,
                style: { textAlign: 'center', width: 60 },
              },
            }}
          />
        </div>
      </div>
      {generatedSignature && (
        <div>
          <div className={styles.row}>
            <div className="flex-9">
              <DSlider
                label={`${t('edit.dialog.tabs.addSignature.size')} (${previewWidth}px)`}
                min={100}
                max={600}
                step={10}
                value={[previewWidth]}
                onValueChange={(value: number[]) => setPreviewWidth(value[0])}
              />
            </div>
            <div className="flex-1">
              <ColorPicker
                aria-label={t('edit.dialog.tabs.addText.color')}
                value={fontColor}
                onChange={handleFontColorChange}
              />
            </div>
          </div>
          <div className={styles.columns}>
            <span className="text-sm text-center mb-2">{t('label.preview')}</span>
            <img
              src={generatedSignature}
              alt={t('edit.dialog.tabs.addSignature.preview')}
              style={{
                width: previewWidth,
                maxWidth: '100%',
                maxHeight: previewHeight,
                transition: 'width 0.2s',
                border: '1px dotted var(--color-primary)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
export default AddSignatureTab
