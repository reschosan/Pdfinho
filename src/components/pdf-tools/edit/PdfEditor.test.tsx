import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PdfEditor from './PdfEditor'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n'
import { vi } from 'vitest'
import { TextOptions } from './interfaces/EditorOptions'
import { Overlay } from './interfaces/TextOverlay'
import { EditCoordinates } from './interfaces/Coordinates'

vi.mock('../../common/utils/PdfUtils', () => ({
  containsValidFileTypes: vi.fn(() => true),
  fileToBase64: vi.fn(() => Promise.resolve('data:application/pdf;base64,ZmFrZQ==')),
}))

const mockStore = configureStore([])

const initialState = {
  pdf: {
    pdfBases: [] as string[],
    overlayHit: false,
    overlays: [] as Overlay[],
    coordinates: { x: 0, y: 0 } as EditCoordinates,
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

describe('PdfEditor', () => {
  const defaultOverlays = [
    {
      id: '0',
      page: 1,
      x: 1,
      y: 1,
      options: {} as TextOptions,
    },
  ] as Overlay[]

  const defaultCoordinates = { x: 0, y: 0 } as EditCoordinates

  it('renders Dropzone when no PDF is loaded', () => {
    renderWithProviders(<PdfEditor />)
    waitFor(() => {
      expect(screen.getByText('drag & drop')).toBeInTheDocument()
    })
  })

  it('renders PdfViewer when PDF is loaded', () => {
    renderWithProviders(<PdfEditor />, {
      pdf: {
        pdfBases: ['data:application/pdf;base64,ZmFrZQ=='],
        overlayHit: false,
        overlays: [],
        coordinates: defaultCoordinates,
      },
    })
    waitFor(() => {
      expect(screen.getByText('.pdf')).toBeInTheDocument()
    })
  })

  it('renders EditOverlayView when overlayHit is true', () => {
    renderWithProviders(<PdfEditor />, {
      pdf: {
        pdfBases: ['data:application/pdf;base64,ZmFrZQ=='],
        overlayHit: true,
        overlays: defaultOverlays,
        coordinates: defaultCoordinates,
      },
    })
    waitFor(() => {
      expect(screen.getByText('Text Options')).toBeInTheDocument()
    })
  })

  it('dispatches setPdfBases when file is dropped', async () => {
    const store = mockStore(initialState)
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <PdfEditor />
        </I18nextProvider>
      </Provider>,
    )
    const input = document.querySelector('input[type="file"]')
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' })
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } })
    await waitFor(() => {
      const actions = store.getActions()
      expect(actions.some((a) => a.type === 'pdf/setPdfBases')).toBe(true)
    })
  })

  it('renders DownloadButtonGroup always', () => {
    renderWithProviders(<PdfEditor />)
    waitFor(() => {
      expect(screen.getByText('Combine')).toBeInTheDocument()
    })
    expect(screen.getByText('Download')).toBeInTheDocument()
    expect(screen.getByText('Reset')).toBeInTheDocument()
  })

  it('renders PdfEditTextDialog when file is uploaded', () => {
    renderWithProviders(<PdfEditor />, {
      pdf: {
        pdfBases: ['data:application/pdf;base64,ZmFrZQ=='],
        overlayHit: false,
        overlays: [],
        coordinates: defaultCoordinates,
      },
    })
    waitFor(() => {
      expect(screen.getByText('Edit Text')).toBeInTheDocument()
    })
  })
})
