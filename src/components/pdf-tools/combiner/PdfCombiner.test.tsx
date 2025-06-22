import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PdfCombiner from './PdfCombiner'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n'
import { vi } from 'vitest'

// Mock for handlePdfDrop
vi.mock('../../common/utils/PdfUtils', () => ({
  handlePdfDrop: vi.fn(() =>
    new Promise(resolve => setTimeout(() => {
      resolve([new File(['dummy'], 'test.pdf', { type: 'application/pdf' })])
    }, 50)),
  ),
}))

const mockStore = configureStore([])
const initialState = {
  pdf: {
    pdfBases: [],
    previewPdfBase: null,
    currentIndex: 0,
  },
}

function renderWithProviders(ui: React.ReactElement, state = initialState) {
  const store = mockStore(state)
  return render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </Provider>,
  )
}

describe('PdfCombiner', () => {
  it('renders Dropzone', () => {
    renderWithProviders(<PdfCombiner />)
    waitFor(() => {
    expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  it('shows loading spinner when loading', async () => {
    renderWithProviders(<PdfCombiner />)
    const input = document.querySelector('input[type="file"]')
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' })
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } })
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })

  it('renders ViewCard after file drop', async () => {
    renderWithProviders(<PdfCombiner />)
    const input = document.querySelector('input[type="file"]')
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' })
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } })
    // Warte auf die VewCard
    await waitFor(() => {
      expect(screen.getByText(/test\.pdf/i)).toBeInTheDocument()
    })
  })

  it('can check flatten checkbox', async () => {
    renderWithProviders(<PdfCombiner />)
    const input = document.querySelector('input[type="file"]')
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' })
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } })
    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
      fireEvent.click(checkbox)
      expect(checkbox).toBeChecked()
    })
  })

  it('renders DownloadButtonGroup', async () => {
    renderWithProviders(<PdfCombiner />)
    const input = document.querySelector('input[type="file"]')
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' })
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } })
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument()
    })
  })
})
