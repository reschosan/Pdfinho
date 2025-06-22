import { t } from 'i18next'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { resetPdfState } from '../../../store/pdfSlice'
import { RootState } from '../../../store/store'

import { PDFDocument, StandardFonts } from 'pdf-lib'
import {
  CheckboxOptions,
  SignatureOptions,
  TextOptions,
} from '../../pdf-tools/edit/interfaces/EditorOptions'
import { CssFontMapping, StandardFontToCss } from '../utils/Constants'
import {
  combinePdfsFromBase64,
  downloadPdfsFromBase64,
  embedImage,
  hexToRgbColor,
  uint8ToBase64,
} from '../utils/PdfUtils'
import { Button } from '../../ui/button'

interface Props {
  pdfs?: File[]
  setPdfs?: (pdfs: File[]) => void
  flattened?: boolean
  compressLevel?: number
  setLoading?: (loading: boolean) => void
  overlayContainerRef?: React.RefObject<HTMLDivElement | null>
}
const DownloadButtonGroup = ({
  pdfs,
  setPdfs,
  flattened,
  compressLevel,
  setLoading,
  overlayContainerRef,
}: Props) => {
  const dispatch = useDispatch()
  const { pdfBases, overlays } = useSelector((state: RootState) => state.pdf)

  const handleDownloadClick = async () => {
    if (setLoading) {
      setLoading(true)
    }

    let pdfBaseWithOverlays
    if (hasOverlays()) {
      pdfBaseWithOverlays = await savePdfWithOverlays()
    }

    downloadPdfsFromBase64(
      hasOverlays() ? pdfBaseWithOverlays! : pdfBases,
      flattened,
      compressLevel,
    ).finally(() => setLoading && setLoading(false))
  }

  const hasOverlays = () => overlayContainerRef && overlayContainerRef.current

  const handleCombineClick = async () => {
    if (setLoading) {
      setLoading(true)
    }

    let pdfBaseWithOverlays
    if (hasOverlays()) {
      pdfBaseWithOverlays = await savePdfWithOverlays()
    }

    combinePdfsFromBase64(
      hasOverlays() ? pdfBaseWithOverlays! : pdfBases,
      flattened,
      compressLevel,
    ).finally(() => setLoading && setLoading(false))
  }

  const handleResetPdfs = () => {
    if (setPdfs) {
      setPdfs([])
    }
    dispatch(resetPdfState())
  }

  const savePdfWithOverlays = async (): Promise<string[] | undefined> => {
    if (!pdfBases || pdfBases.length === 0) return

    const result: string[] = []

    const base64 = pdfBases[0]
    const pdfBytes = Uint8Array.from(atob(base64.split(',')[1]), (c) =>
      c.charCodeAt(0),
    )
    const pdfDoc = await PDFDocument.load(pdfBytes)

    overlays.forEach(async (overlay) => {
      if (_.isEqual(overlay.options.type, 'text')) {
        const options = overlay.options as TextOptions
        const { text, size, font, bold, italic } = options

        const boldSetting = 'bold'
        const italicSetting = 'italic'
        const normalSetting = 'normal'

        const fontSettings = {
          fontFamily: font,
          fontWeight: bold ? boldSetting : normalSetting,
          fontStyle: italic ? italicSetting : normalSetting,
        } as CssFontMapping

        let fontChoice = Object.entries(StandardFontToCss).find(([, value]) => {
          return (
            value.fontFamily
              .toLowerCase()
              .includes(fontSettings.fontFamily.toLowerCase()) &&
            value.fontWeight === fontSettings.fontWeight &&
            value.fontStyle === fontSettings.fontStyle
          )
        })
        if (_.isNil(fontChoice)) {
          console.error('Font not found:', fontSettings)
          return
        }
        const pdfFont = await pdfDoc.embedFont(fontChoice[0] as StandardFonts)

        const page = pdfDoc.getPage(overlay.page - 1)

        const { height } = page.getSize()
        page.drawText(text, {
          x: overlay.x,
          y: height - overlay.y - size + 4,
          size,
          font: pdfFont,
          color: hexToRgbColor(options.color),
        })
      } else if (_.isEqual(overlay.options.type, 'signature')) {
        const options = overlay.options as SignatureOptions

        const page = pdfDoc.getPage(overlay.page - 1)
        const { height } = page.getSize()
        const { src } = options

        const embeddedImage = await embedImage(src, pdfDoc)
        if (!embeddedImage) {
          console.error('Format not supported for signature image:')
          return
        }
        page.drawImage(embeddedImage, {
          x: overlay.x,
          y: height - overlay.y - options.height,
          width: options.width,
          height: options.height,
        })
      } else if (_.isEqual(overlay.options.type, 'image')) {
        const options = overlay.options as SignatureOptions

        const page = pdfDoc.getPage(overlay.page - 1)
        const { height } = page.getSize()
        const { src } = options

        const embeddedImage = await embedImage(src, pdfDoc)
        if (!embeddedImage) {
          console.error('Format not supported for image:')
          return
        }
        page.drawImage(embeddedImage, {
          x: overlay.x,
          y: height - overlay.y - options.height,
          width: options.width,
          height: options.height,
        })
      } else if (_.isEqual(overlay.options.type, 'checkbox')) {
        const options = overlay.options as CheckboxOptions
        const { size, color } = options

        const page = pdfDoc.getPage(overlay.page - 1)
        const { height } = page.getSize()

        const font = await pdfDoc.embedFont(StandardFonts.ZapfDingbats)
        const checkMark = String.fromCharCode(0x2713)
        page.drawText(checkMark, {
          x: overlay.x,
          y: height - overlay.y - size + 4,
          size,
          font,
          color: hexToRgbColor(color),
        })
      }
    })

    const pdfBytesWithOverlay = await pdfDoc.save()
    const pdfBase64WithOverlay = uint8ToBase64(pdfBytesWithOverlay)

    result.push(pdfBase64WithOverlay)

    return result
  }

  const isDisabled = () => {
    if (_.isEmpty(pdfs) && _.isEmpty(pdfBases)) {
      return true
    }

    return false
  }

  return (
    <div className="flex flex-row gap-2 mt-4">
      <Button disabled={isDisabled()} onClick={handleCombineClick}>
        {t('button.combine')}
      </Button>
      <Button disabled={isDisabled()} onClick={handleDownloadClick}>
        {t('button.download')}
      </Button>
      <Button
        variant={'secondary'}
        onClick={handleResetPdfs}
        disabled={isDisabled()}
        color="error"
      >
        {t('button.reset')}
      </Button>
    </div>
  )
}
export default DownloadButtonGroup
