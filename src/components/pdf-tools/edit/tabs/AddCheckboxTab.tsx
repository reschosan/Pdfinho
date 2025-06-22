import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setEditorOptions } from '../../../../store/pdfSlice'
import { CheckboxOptions, EditorType } from '../interfaces/EditorOptions'
import DSlider from '../../../common/sliders/DSlider'
import ColorPicker from '../../../common/colorpicker/ColorPicker'
import { styles } from '../../PdfStyles'
import TabDescription from '../shared/TabDescription'
import { cn } from '../../../../lib/utils'

const AddCheckboxTab = () => {
  const DEFAULT_SIZE = 24
  const DEFAULT_COLOR = '#222222'

  const dispatch = useDispatch()

  const [size, setSize] = useState(DEFAULT_SIZE)
  const [color, setColor] = useState(DEFAULT_COLOR)

  useEffect(() => {
    const options: CheckboxOptions = {
      type: EditorType.Checkbox,
      size: size,
      color: color,
    }
    dispatch(setEditorOptions(options))
  }, [size, color, dispatch])

  return (
    <div className={styles.tab}>
      <TabDescription tTitle="edit.dialog.tabs.addCheckbox.description" />
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
          <span className="text-sm">{size}px</span>

          <DSlider
            min={8}
            max={72}
            step={2}
            value={[size]}
            onValueChange={(val) => setSize(val[0])}
          />
        </div>
        <div className="flex-1">
          <ColorPicker
            label={t('edit.dialog.tabs.addCheckbox.color')}
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default AddCheckboxTab
