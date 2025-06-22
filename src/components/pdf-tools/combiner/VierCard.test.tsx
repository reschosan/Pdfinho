import { render, screen, fireEvent } from '@testing-library/react'
import ViewCard from './ViewCard'
import { PdfFileMoverEnum } from '../PdfFileMoverEnum'
import { vi } from 'vitest'

describe('ViewCard', () => {
  const pdf = new File(['dummy'], 'test.pdf', { type: 'application/pdf' })
  const pdfs = [pdf, new File(['dummy2'], 'second.pdf', { type: 'application/pdf' })]
  const handlePdfPreview = vi.fn()
  const deletePdf = vi.fn()
  const movePdfFile = vi.fn()

  it('renders the PDF name', () => {
    render(
      <ViewCard
        pdf={pdf}
        pdfs={pdfs}
        index={0}
        handlePdfPreview={handlePdfPreview}
        deletePdf={deletePdf}
        movePdfFile={movePdfFile}
      />
    )
    expect(screen.getByText('test.pdf')).toBeInTheDocument()
  })

  it('calls handlePdfPreview when Eye button is clicked', () => {
    render(
      <ViewCard
        pdf={pdf}
        pdfs={pdfs}
        index={0}
        handlePdfPreview={handlePdfPreview}
        deletePdf={deletePdf}
        movePdfFile={movePdfFile}
      />
    )
    const eyeButton = screen.getAllByRole('button')[0]
    fireEvent.click(eyeButton)
    expect(handlePdfPreview).toHaveBeenCalledWith(0)
  })

  it('calls deletePdf when Trash button is clicked', () => {
    render(
      <ViewCard
        pdf={pdf}
        pdfs={pdfs}
        index={0}
        handlePdfPreview={handlePdfPreview}
        deletePdf={deletePdf}
        movePdfFile={movePdfFile}
      />
    )
    const trashButton = screen.getAllByRole('button')[1]
    fireEvent.click(trashButton)
    expect(deletePdf).toHaveBeenCalledWith(0)
  })

  it('calls movePdfFile with Left when ArrowLeft is clicked', () => {
    render(
      <ViewCard
        pdf={pdf}
        pdfs={pdfs}
        index={1}
        handlePdfPreview={handlePdfPreview}
        deletePdf={deletePdf}
        movePdfFile={movePdfFile}
      />
    )
    const leftButton = screen.getAllByRole('button')[2]
    fireEvent.click(leftButton)
    expect(movePdfFile).toHaveBeenCalledWith(1, PdfFileMoverEnum.Left)
  })

  it('calls movePdfFile with Right when ArrowRight is clicked', () => {
    render(
      <ViewCard
        pdf={pdf}
        pdfs={pdfs}
        index={0}
        handlePdfPreview={handlePdfPreview}
        deletePdf={deletePdf}
        movePdfFile={movePdfFile}
      />
    )
    const rightButton = screen.getAllByRole('button')[3]
    fireEvent.click(rightButton)
    expect(movePdfFile).toHaveBeenCalledWith(0, PdfFileMoverEnum.Right)
  })

  it('disables left button for first item', () => {
    render(
      <ViewCard
        pdf={pdf}
        pdfs={pdfs}
        index={0}
        handlePdfPreview={handlePdfPreview}
        deletePdf={deletePdf}
        movePdfFile={movePdfFile}
      />
    )
    const leftButton = screen.getAllByRole('button')[2]
    expect(leftButton).toBeDisabled()
  })

  it('disables right button for last item', () => {
    render(
      <ViewCard
        pdf={pdf}
        pdfs={pdfs}
        index={pdfs.length - 1}
        handlePdfPreview={handlePdfPreview}
        deletePdf={deletePdf}
        movePdfFile={movePdfFile}
      />
    )
    const rightButton = screen.getAllByRole('button')[3]
    expect(rightButton).toBeDisabled()
  })
})