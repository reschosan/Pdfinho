import _, { isEqual } from 'lodash'
import React from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  setCurrentIndex,
  setPdfBases,
  setPreviewPdfBase,
} from '../../../store/pdfSlice'
import { RootState } from '../../../store/store'
import DownloadButtonGroup from '../../common/buttongroups/DownloadButtonGroup'
import Dropzone from '../../common/dropzone/Dropzone'
import { PdfFileMoverEnum } from '../PdfFileMoverEnum'
import { styles } from '../PdfStyles'

import { cn } from '../../../lib/utils'
import LoadingSpinner from '../../common/loading/LoadingSpinner'
import DSelect from '../../common/selects/DSelect'
import { DSelectChildren } from '../../common/selects/DSelectChildren'
import { handlePdfDrop } from '../../common/utils/PdfUtils'
import PdfPreviewerDialog from './dialog/PdfPreviewerDialog'
import ViewCard from './ViewCard'

const PdfCombiner = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { pdfBases } = useSelector((state: RootState) => state.pdf)

  const [pdfs, setPdfs] = React.useState<File[]>([])
  const [previewPdf, setPreviewPdf] = React.useState<File | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [flattened, setFlattened] = React.useState(false)
  const [compressLevel, setCompressLevel] = React.useState(0)

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setLoading(true)
      // Handle the dropped files
      handlePdfDrop(acceptedFiles, dispatch, pdfBases, pdfs)
        .then((validPdfs) => setPdfs(validPdfs))
        .finally(() => setLoading(false))
    },
  })

  const deletePdf = (index: number) => {
    const newPdfs = [...pdfs]
    newPdfs.splice(index, 1)
    setPdfs(newPdfs)
    dispatch(
      setPdfBases([...pdfBases.slice(0, index), ...pdfBases.slice(index + 1)]),
    )
  }

  const movePdfFile = (index: number, direction: PdfFileMoverEnum) => {
    const newPdfs = [...pdfs]
    const newPdfBases = [...pdfBases]

    const [pdf] = newPdfs.splice(index, 1)
    const [base] = newPdfBases.splice(index, 1)

    const newIndex = isEqual(direction, PdfFileMoverEnum.Left)
      ? index - 1
      : index + 1

    newPdfs.splice(newIndex, 0, pdf)
    newPdfBases.splice(newIndex, 0, base)

    setPdfs(newPdfs)
    dispatch(setPdfBases(newPdfBases))
    dispatch(setCurrentIndex(newIndex))
  }

  const handlePdfPreview = (index: number) => {
    setPreviewPdf(pdfs[index])
    dispatch(setPreviewPdfBase(pdfBases[index]))
    dispatch(setCurrentIndex(index))
  }

  const handleCheckFlatten = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFlattened(event.target.checked)
  }

  const handleCompressChange = (value: string) => {
    const compressValue = getCompressLevels.find((level) =>
      isEqual(level.value, Number(value)),
    )?.value as number
    if (isEqual(compressValue, undefined)) {
      return
    }
    setCompressLevel(compressValue)
  }

  const getCompressLevels: DSelectChildren[] = [
    { value: 0, label: t('label.none') },
    { value: 0.1, label: t('label.10P') },
    { value: 0.2, label: t('label.20P') },
    { value: 0.3, label: t('label.30P') },
    { value: 0.4, label: t('label.40P') },
    { value: 0.5, label: t('label.50P') },
  ]

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f6f8fb]">
        <LoadingSpinner condition={loading} />
      </div>
    )
  }

  const getCompressValue = getCompressLevels.find((value) =>
    isEqual(value.value, compressLevel),
  )?.value

  return (
    <div className={styles.content}>
      <Dropzone getInputProps={getInputProps} getRootProps={getRootProps} />
      {!_.isEmpty(pdfs) && (
        <div className="flex flex-wrap gap-2 rounded-[4px]">
          {pdfs.map((pdf, index) => (
            <ViewCard
              key={`${pdf.name}-${pdf.lastModified}-${index}`}
              pdf={pdf}
              pdfs={pdfs}
              index={index}
              handlePdfPreview={handlePdfPreview}
              deletePdf={deletePdf}
              movePdfFile={movePdfFile}
            />
          ))}
        </div>
      )}
      {!_.isEmpty(pdfs) && (
        <div className={styles.row}>
          <label className={cn(styles.columns, 'text-nowrap flex-9')}>
            <span className="text-primary">{t('label.flatten')}</span>
            <input
              id="flatten-checkbox"
              type="checkbox"
              checked={flattened}
              onChange={handleCheckFlatten}
              className="accent-primary w-5 h-5 "
            />
          </label>

          <div className="flex-9">
            <DSelect
              label={t('label.compress')}
              value={String(getCompressValue)}
              onChange={handleCompressChange}
              children={getCompressLevels}
            />
          </div>
        </div>
      )}

      <DownloadButtonGroup
        pdfs={pdfs}
        setPdfs={setPdfs}
        flattened={flattened}
        compressLevel={compressLevel}
        setLoading={setLoading}
      />

      <PdfPreviewerDialog previewPdf={previewPdf} setPreviewPdf={setPreviewPdf} />
    </div>
  )
}
export default PdfCombiner
