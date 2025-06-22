import { t } from 'i18next'
import { isEmpty, isEqual } from 'lodash'
import { useRef, useState } from 'react'
import DButtonGroup from '../../common/buttongroups/DButtonGroup'
import LoadingSpinner from '../../common/loading/LoadingSpinner'
import DTypography from '../../common/typographys/DTypography'
import { styles } from '../PdfStyles'
import {
  convertPdfToImg,
  convertPdfToWord,
  handleDownloadFiles,
} from './ConverterUtils'
import { Button } from '../../ui/button'
import { cn } from '../../../lib/utils'

type ConvertType = 'pdf2word' | 'pdf2jpg' | 'pdf2png'

const ConverterMask = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [convertType, setConvertType] = useState<ConvertType | null>(null)
  const [wordFile, setWordFile] = useState<File>()
  const [jpgFiles, setJpgFiles] = useState<File[]>([])
  const [pngFiles, setPngFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const isDisabled = !wordFile && isEmpty(jpgFiles) && isEmpty(pngFiles)

  const handleButtonClick = (type: ConvertType) => {
    setConvertType(type)
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && convertType) {
      if (isEqual(convertType, 'pdf2word')) {
        convertPdfToWord(file, setWordFile)
      } else if (isEqual(convertType, 'pdf2jpg')) {
        convertPdfToImg(file, 'image/jpeg', setJpgFiles, setPngFiles)
      } else if (isEqual(convertType, 'pdf2png')) {
        convertPdfToImg(file, 'image/png', setJpgFiles, setPngFiles)
      }
    }
    event.target.value = ''
  }

  const handleResetFiles = () => {
    setLoading(false)
    setWordFile(undefined)
    setJpgFiles([])
    setPngFiles([])
    setConvertType(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDownloadClick = async () => {
    setLoading(true)
    await handleDownloadFiles(wordFile ? wordFile : jpgFiles || pngFiles)
    setLoading(false)
  }

  const FileBox = ({ left, right }: { left: string; right: string }) => (
    <div className="flex items-center w-full">
      <div className="w-16 text-left">{left}</div>
      <div className="w-32 text-center">{'\u2192'}</div>
      <div className="w-16 text-right">{right}</div>
    </div>
  )

  return (
    <div className={styles.content}>
      {isDisabled && (
        <div className={cn(styles.columns)}>
          <DTypography>{t('converter.titleConvert')}</DTypography>
          <div className={styles.columns}>
            <Button
              variant="outline"
              className="mb-2 bg-white hover:border-primary hover:border-[1px] border-[0.5px]"
              onClick={() => handleButtonClick('pdf2word')}
            >
              <FileBox left={t('label.pdf')} right={t('label.word')} />
            </Button>
            <Button
              variant="outline"
              className="mb-2 bg-white hover:border-primary hover:border-[1px] border-[0.5px]"
              onClick={() => handleButtonClick('pdf2jpg')}
            >
              <FileBox left={t('label.pdf')} right={t('label.jpg')} />
            </Button>
            <Button
              variant="outline"
              className="mb-2 bg-white hover:border-primary hover:border-[1px] border-[0.5px]"
              onClick={() => handleButtonClick('pdf2png')}
            >
              <FileBox left={t('label.pdf')} right={t('label.png')} />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              max={1}
              accept=".pdf"
            />
          </div>
        </div>
      )}

      <LoadingSpinner condition={loading} />

      {!isDisabled && <DTypography>{t('converter.download')}</DTypography>}

      <DButtonGroup>
        <Button
          variant="default"
          onClick={handleDownloadClick}
          disabled={isDisabled}
        >
          {t('button.download')}
        </Button>
        <Button variant="secondary" disabled={isDisabled} onClick={handleResetFiles}>
          {t('button.reset')}
        </Button>
      </DButtonGroup>
    </div>
  )
}

export default ConverterMask
