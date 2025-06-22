import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import CenterContainer from '../components/common/CenterContainer'
import Header from '../components/common/headers/Header'
import PdfCombiner from '../components/pdf-tools/combiner/PdfCombiner'
import { resetPdfState } from '../store/pdfSlice'

const PdfToolsLandingPage = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(resetPdfState())
  }, [dispatch])
  return (
    <CenterContainer>
      <Header
        tTitle={'combine.title'}
        tDescription="combine.description"
      />
      <PdfCombiner />
    </CenterContainer>
  )
}

export default PdfToolsLandingPage
