import { isEqual } from 'lodash'
import { PdfFileMoverEnum } from '../PdfFileMoverEnum'
import { Eye, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { cn } from '../../../lib/utils'
import { styles } from '../PdfStyles'

interface Props {
  pdf: File
  pdfs: File[]
  index: number
  handlePdfPreview: (index: number) => void
  deletePdf: (index: number) => void
  movePdfFile: (index: number, moverEnum: PdfFileMoverEnum) => void
}

const ViewCard = ({
  pdf,
  pdfs,
  index,
  handlePdfPreview,
  deletePdf,
  movePdfFile,
}: Props) => {
  return (
    <Card
      className={cn(
        'w-48 shadow-lg border-0 rounded-[4px] ',
        styles.columnsNoGapNoWidth,
      )}
    >
      <CardTitle className="max-w-[10rem] truncate wrap-anywhere text-ellipsis">
        {pdf.name}
      </CardTitle>
      <CardContent className={styles.row}>
        <Button variant="ghost" size="icon" onClick={() => handlePdfPreview(index)}>
          <Eye className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => deletePdf(index)}>
          <Trash2 className="w-5 h-5 text-destructive" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={isEqual(index, 0)}
          onClick={() => movePdfFile(index, PdfFileMoverEnum.Left)}
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={isEqual(index, pdfs.length - 1)}
          onClick={() => movePdfFile(index, PdfFileMoverEnum.Right)}
        >
          <ArrowRight className="w-5 h-5 text-primary" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default ViewCard
