import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import CenterContainer from '../components/common/CenterContainer'
import Header from '../components/common/headers/Header'
import PdfEditor from '../components/pdf-tools/edit/PdfEditor'
import { resetPdfState } from '../store/pdfSlice'

const PdfEditPage = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(resetPdfState())
  }, [dispatch])
  return (
    <CenterContainer>
      <Header tTitle={'edit.title'} tDescription={'edit.subtitle'} />
      <PdfEditor />
    </CenterContainer>
  )
}

export default PdfEditPage
