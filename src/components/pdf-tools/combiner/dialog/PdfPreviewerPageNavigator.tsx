import { Check, MoveLeft, MoveRight, Trash2, X } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import { useDispatch, useSelector } from 'react-redux'
import { setFileBase, setPageNumber, setPdfBases } from '../../../../store/pdfSlice'
import { RootState } from '../../../../store/store'
import DIconButton from '../../../common/buttons/DIconButton'
import { arrayBufferToBase64 } from '../../../common/utils/PdfUtils'
import { styles } from '../../PdfStyles'

interface Props {
  closeDialog: () => void
}

const PdfPreviewerPageNavigator = ({ closeDialog }: Props) => {
  const dispatch = useDispatch()
  const { pageNumber, numPages, previewPdfBase, pdfBases, currentIndex } =
    useSelector((state: RootState) => state.pdf)

  const deletePageFromFile = async () => {
    try {
      if (!previewPdfBase) {
        throw new Error('No PDF file base provided')
      }
      const existingPdfBytes = await fetch(previewPdfBase).then((res) =>
        res.arrayBuffer(),
      )
      const pdfDoc = await PDFDocument.load(existingPdfBytes)

      pdfDoc.removePage(pageNumber - 1)

      const pdfBytes = await pdfDoc.save()
      const base64String = arrayBufferToBase64(pdfBytes.buffer as ArrayBuffer)
      dispatch(setFileBase(`data:application/pdf;base64,${base64String}`))
      dispatch(setPageNumber(Math.max(pageNumber - 1, 1))) 
    } catch (error) {
      console.error('Error deleting page from PDF:', error)
    }
  }

  const setCurrentFileBase = () => {
    const newPreviewPdfBases: string[] = pdfBases.map((base, index) => {
      if (index === currentIndex) {
        return previewPdfBase
      }
      return base
    }) as string[]
    dispatch(setPdfBases(newPreviewPdfBases))
    closeDialog()
  }

  return (
    <div className={styles.columns}>
      <div className="font-medium sm:mb-1">
        {pageNumber} / {numPages}
      </div>

      <div className={styles.rowNoGapNoWidth}>
        <DIconButton
          onClick={() => dispatch(setPageNumber(Math.max(pageNumber - 1, 1)))}
          disabled={pageNumber === 1}
        >
          <MoveLeft />
        </DIconButton>
        <DIconButton disabled={numPages === 1} onClick={deletePageFromFile}>
          <Trash2 />
        </DIconButton>
        <DIconButton
          onClick={() => dispatch(setPageNumber(Math.min(pageNumber + 1, numPages)))}
          disabled={pageNumber >= numPages}
        >
          <MoveRight />
        </DIconButton>
      </div>

      <div className="flex flex-row gap-2">
        <DIconButton onClick={closeDialog}>
          <X className="text-destructive" />
        </DIconButton>
        <DIconButton onClick={setCurrentFileBase}>
          <Check />
        </DIconButton>
      </div>
    </div>
  )
}

export default PdfPreviewerPageNavigator
