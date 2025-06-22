import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { resetPdfState } from '../store/pdfSlice'
import CenterContainer from '../components/common/CenterContainer'
import Header from '../components/common/headers/Header'
import ConverterMask from '../components/pdf-tools/converter/ConverterMask'

const ConverterPage = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(resetPdfState())
  }, [dispatch])

  return (
    <CenterContainer>
      <Header tTitle="converter.title" tSubtitle="converter.description" />
      <ConverterMask />
    </CenterContainer>
  )
}

export default ConverterPage
