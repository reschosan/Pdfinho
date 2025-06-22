import { useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux'
import { setEditDialogOpen, setPdfBases } from '../../../store/pdfSlice'
import DownloadButtonGroup from '../../common/buttongroups/DownloadButtonGroup'
import Dropzone from '../../common/dropzone/Dropzone'
import { styles } from '../PdfStyles'
import PdfViewer from './PdfViewer'
import { RootState } from '../../../store/store'
import PdfEditPdfDialog from './dialog/PdfEditPdfDialog.tsx'
import { containsValidFileTypes, fileToBase64 } from '../../common/utils/PdfUtils'
import EditOverlayView from './editoverlayviews/EditOverlayView'

const PdfEditor = () => {
  const dispatch = useDispatch()
  const overlayContainerRef = useRef<HTMLDivElement | null>(null)

  const pdfBase64 = useSelector((state: RootState) => state.pdf.pdfBases[0])
  const { overlayHit } = useSelector((state: RootState) => state.pdf)

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]

      if (!containsValidFileTypes(file)) {
        console.error('Invalid file type. Please upload a PDF.')
      } else {
        fileToBase64(file).then((base64) => {
          dispatch(setPdfBases([base64]))
        })
      }
    },
    maxFiles: 1,
  })

  const handleDialogOk = () => {
    dispatch(setEditDialogOpen(false))
  }

  return (
    <div className={pdfBase64 ? styles.contentNoFull : styles.content}>
      {!pdfBase64 && (
        <Dropzone getInputProps={getInputProps} getRootProps={getRootProps} />
      )}
      {overlayHit && <EditOverlayView />}
      {pdfBase64 && <PdfViewer overlayContainerRef={overlayContainerRef || null} />}
      <DownloadButtonGroup overlayContainerRef={overlayContainerRef} />
      <PdfEditPdfDialog handleDialogOk={handleDialogOk} />
    </div>
  )
}

export default PdfEditor
