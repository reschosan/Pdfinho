import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ConverterMask from './ConverterMask'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n'
import { vi } from 'vitest'

// Mocks for ConverterUtils
vi.mock('./ConverterUtils', () => ({
  convertPdfToWord: vi.fn((file, setWordFile) => setWordFile(file)),
  convertPdfToImg: vi.fn((file, type, setJpgFiles, setPngFiles) => {
    if (type === 'image/jpeg') setJpgFiles([file])
    if (type === 'image/png') setPngFiles([file])
  }),
  handleDownloadFiles: vi.fn(() => Promise.resolve()),
}))

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>)
}

describe('ConverterMask', () => {
  it('renders all conversion buttons', () => {
    renderWithI18n(<ConverterMask />)
    expect(screen.getByRole('button', { name: /pdf.*word/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pdf.*jpg/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pdf.*png/i })).toBeInTheDocument()
  })

  it('shows download and reset buttons disabled initially', () => {
    renderWithI18n(<ConverterMask />)
    expect(screen.getByRole('button', { name: /download/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /reset/i })).toBeDisabled()
  })

  it('enables download and reset after file upload', async () => {
    renderWithI18n(<ConverterMask />)
    fireEvent.click(screen.getByRole('button', { name: /pdf.*word/i }))
    const input = document.querySelector('input[type="file"]')
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' })
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } })
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download/i })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: /reset/i })).not.toBeDisabled()
    })
  })

  it('calls handleDownloadFiles when download is clicked', async () => {
    const { handleDownloadFiles } = await import('./ConverterUtils')
    renderWithI18n(<ConverterMask />)
    fireEvent.click(screen.getByRole('button', { name: /pdf.*word/i }))
    const input = document.querySelector('input[type="file"]')
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' })
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } })
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download/i })).not.toBeDisabled()
    })
    fireEvent.click(screen.getByRole('button', { name: /download/i }))
    await waitFor(() => {
      expect(handleDownloadFiles).toHaveBeenCalled()
    })
  })

  it('shows loading spinner when downloading', async () => {
    renderWithI18n(<ConverterMask />)
    fireEvent.click(screen.getByRole('button', { name: /pdf.*word/i }))
    const input = document.querySelector('input[type="file"]')
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' })
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } })
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download/i })).not.toBeDisabled()
    })
    fireEvent.click(screen.getByRole('button', { name: /download/i }))
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })
})
