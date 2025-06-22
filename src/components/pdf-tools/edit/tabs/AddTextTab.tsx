import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setEditorOptions } from '../../../../store/pdfSlice'
import ColorPicker from '../../../common/colorpicker/ColorPicker'
import DSelectFonts from '../../../common/selects/DSelectFonts'
import DTextField from '../../../common/textfields/DTextField'
import { FontsText, TextSizes } from '../../../common/utils/Constants'
import { styles } from '../../PdfStyles'
import { EditorType, TextOptions } from '../interfaces/EditorOptions'
import TabDescription from '../shared/TabDescription'

const AddTextTab = () => {
  const dispatch = useDispatch()
  const [textSize, setTextSize] = useState(16)
  const [font, setFont] = useState(FontsText[0].value)
  const [textColor, setTextColor] = useState('#000000')
  const [text, setText] = useState('')

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  useEffect(() => {
    const options: TextOptions = {
      type: EditorType.Text,
      text,
      size: textSize,
      color: textColor,
      font: font,
    }
    dispatch(setEditorOptions(options))
  }, [text, textSize, textColor, font, dispatch])

  return (
    <div className={styles.columnsNoGap}>
      <TabDescription tTitle={'edit.dialog.tabs.addText.description'} />
      {/* Text Input */}
      <div className={styles.columnsNoGap}>
        <DTextField
          id="add-text-input"
          onChange={handleTextChange}
          value={text}
          placeholder={t('edit.dialog.tabs.addText.placeholder')}
          aria-label={t('edit.dialog.tabs.addText.placeholder')}
          textStyle={{ fontSize: textSize, fontFamily: font, color: textColor }}
          autoFocus
        />
      </div>
      {/* Text size*/}
      <div className={styles.tabBoxContent}>
        {/* Font Selector */}
          <DSelectFonts
            value={font}
            label={t('edit.dialog.tabs.addText.font')}
            onChange={setFont}
            children={FontsText}
         />
            
        {/* </FormControl> */}
        <ColorPicker
        label={t('edit.dialog.tabs.addText.color')}
          value={textColor}
          onChange={handleColorChange}
        />
        <DTextField
          type="number"
          label={t('edit.dialog.tabs.addText.size')}
          onChange={(e) => {
            const val = Number(e.target.value)
            if (val >= TextSizes[0] && val <= TextSizes[TextSizes.length - 1])
              setTextSize(val)
          }}
          value={textSize}
          slotProps={{
            htmlInput: {
              min: TextSizes[0],
              max: TextSizes[TextSizes.length - 1],
              step: 2,
              style: { textAlign: 'center', width: 50 },
            },
          }}
        />
      </div>
    </div>
  )
}
export default AddTextTab
