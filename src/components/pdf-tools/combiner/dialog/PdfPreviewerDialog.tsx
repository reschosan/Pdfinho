import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useDispatch, useSelector } from 'react-redux'
import PdfPreviewerPageNavigator from './PdfPreviewerPageNavigator'
import { cn } from '../../../../lib/utils'
import {
  setNumPages,
  setPageNumber,
  setPreviewPdfBase,
} from '../../../../store/pdfSlice'
import { RootState } from '../../../../store/store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog'
import { styles } from '../../PdfStyles'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Props {
  previewPdf: File | null
  setPreviewPdf: React.Dispatch<React.SetStateAction<File | null>>
}

const PdfPreviewerDialog = ({ previewPdf, setPreviewPdf }: Props) => {
  const dispatch = useDispatch()
  const { previewPdfBase, pageNumber } = useSelector((state: RootState) => state.pdf)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    dispatch(setNumPages(numPages))
  }

  const closeDialog = () => {
    setPreviewPdf(null)
    dispatch(setPageNumber(1))
    dispatch(setPreviewPdfBase(''))
  }

  const isMobile = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 640px)').matches
  }

  return (
    <Dialog
      open={!!previewPdf}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog()
        }
      }}
    >
      <DialogContent
        className={cn(
          styles.columns,
          'sm:min-w-[700px] max-h-[95vh] overflow-y-auto bg-accent',
        )}
      >
        <DialogHeader>
          <DialogTitle>{previewPdf?.name}</DialogTitle>
        </DialogHeader>
        {previewPdf && (
          <div className="">
            <Document
              file={previewPdfBase}
              onContextMenu={(e) => e.preventDefault()}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page
                renderMode="canvas"
                width={isMobile() ? 360 : 650}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                pageNumber={pageNumber}
              />
            </Document>
          </div>
        )}
        <PdfPreviewerPageNavigator closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  )
}

export default PdfPreviewerDialog
