import { useEffect, useState } from 'react'
import FileUpload from '../../../common/files/FileUpload'
import LoadingSpinner from '../../../common/loading/LoadingSpinner'
import { useDispatch } from 'react-redux'
import { setEditorOptions } from '../../../../store/pdfSlice'
import { EditorType, ImageOptions } from '../interfaces/EditorOptions'
import { iosImageToPng } from '../../../common/utils/PdfUtils'
import { styles } from '../../PdfStyles'
import DTextField from '../../../common/textfields/DTextField'
import TabDescription from '../shared/TabDescription'
import { t } from 'i18next'

const AddImageTab = () => {
  const dispatch = useDispatch()

  const [image, setImage] = useState<string | null>(null)
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null)
  const [naturalHeight, setNaturalHeight] = useState<number | null>(null)
  const [width, setWidth] = useState<number>(100)
  const [height, setHeight] = useState<number>(100)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!image) return
    const img = new window.Image()
    img.onload = () => {
      setNaturalWidth(img.naturalWidth)
      setNaturalHeight(img.naturalHeight)
      setWidth(img.naturalWidth)
      setHeight(img.naturalHeight)
    }
    img.src = image
  }, [image])

  useEffect(() => {
    if (!image) return
    const options: ImageOptions = {
      type: EditorType.Image,
      src: image,
      width: width,
      height: height,
    }
    dispatch(setEditorOptions(options))
  }, [image, width, height, dispatch])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    let file = e.target.files?.[0]
    if (
      file &&
      (file.name.toLowerCase().endsWith('.heic') ||
        file.name.toLowerCase().endsWith('.heif'))
    ) {
      file = await iosImageToPng(file)
    }

    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setImage(ev.target?.result as string)
      reader.readAsDataURL(file)
    }

    setLoading(false)
  }

  return (
    <div className={styles.tab}>
      <LoadingSpinner condition={loading} />

      <TabDescription tTitle="edit.dialog.tabs.addImage.title" />

      {!image && !loading && (
        <FileUpload
          handleImageChange={handleImageChange}
          acceptedFileTypes="image/png, image/jpeg, image/heic, image/heif"
        />
      )}

      {image && (
        <div className={styles.columnsNoGap}>
          <span className="text-sm mb-1">
             ({width} x {height} px)
          </span>
          <img
            src={image}
            alt={t('label.preview')} 
            style={{
              width,
              height,
              maxWidth: 500,
              maxHeight: 300,
              border: '1px solid #ccc',
              borderRadius: '4px',
              objectFit: 'contain',
            }}
          />
          <div className={styles.row}>
            <span className="text-sm">{t('edit.dialog.tabs.addImage.width')}:</span>
            <DTextField
              type="number"
              min={0}
              max={naturalWidth || 2000}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
            <span className="text-sm">{t('edit.dialog.tabs.addImage.height')}:</span>
            <DTextField
              type="number"
              min={0}
              max={naturalHeight || 2000}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>
          {/* TODO: i18n */}
          <span className="text-xs mt-1 text-muted-foreground">
            Original: {naturalWidth} x {naturalHeight} px
          </span>
        </div>
      )}
    </div>
  )
}

export default AddImageTab
