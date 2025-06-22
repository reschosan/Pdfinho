import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  TextOptions,
  SignatureOptions,
  ImageOptions,
  CheckboxOptions,
} from '../components/pdf-tools/edit/interfaces/EditorOptions'
import { Overlay } from '../components/pdf-tools/edit/interfaces/TextOverlay'
import { EditCoordinates } from '../components/pdf-tools/edit/interfaces/Coordinates'

interface PdfState {
  pdfBases: string[]
  previewPdfBase: string | undefined
  currentIndex: number
  pageNumber: number
  numPages: number

  //edit
  editorOptions:
    | TextOptions
    | SignatureOptions
    | ImageOptions
    | CheckboxOptions
    | undefined
  overlays: Overlay[]
  coordinates: EditCoordinates
  editDialogOpen: boolean
  overlayHit: boolean
  currentOverlayId: string | undefined

  //general
  scale: number
}

const initialState: PdfState = {
  pdfBases: [],
  previewPdfBase: undefined,
  currentIndex: 0,
  pageNumber: 1,
  numPages: 0,

  //edit
  editorOptions: undefined,
  overlays: [],
  coordinates: { x: 0, y: 0 },
  editDialogOpen: false,
  overlayHit: false,
  currentOverlayId: undefined,

  //general
  scale: 1,
}

const pdfSlice = createSlice({
  name: 'pdf',
  initialState,
  reducers: {
    setPdfBases: (state, action: PayloadAction<string[]>) => {
      state.pdfBases = action.payload
    },
    setPreviewPdfBase: (state, action: PayloadAction<string | undefined>) => {
      state.previewPdfBase = action.payload
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload
    },
    setNumPages: (state, action: PayloadAction<number>) => {
      state.numPages = action.payload
    },
    setFileBase: (state, action: PayloadAction<string | undefined>) => {
      state.previewPdfBase = action.payload
    },

    //edit
    setEditorOptions: (
      state,
      action: PayloadAction<
        TextOptions | SignatureOptions | ImageOptions | CheckboxOptions | undefined
      >,
    ) => {
      state.editorOptions = action.payload
    },
    setOverlays: (state, action: PayloadAction<Overlay[]>) => {
      state.overlays = action.payload
    },
    setCoordinates: (state, action: PayloadAction<EditCoordinates>) => {
      state.coordinates = action.payload
    },
    setEditDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.editDialogOpen = action.payload
    },
    setOverlayHit: (state, action: PayloadAction<boolean>) => {
      state.overlayHit = action.payload
    },
    setCurrentOverlayId: (state, action: PayloadAction<string | undefined>) => {
      state.currentOverlayId = action.payload
    },

    //general
    setScale: (state, action: PayloadAction<number>) => {
      state.scale = action.payload
    },

    // Reset the PDF state
    resetPdfState: (state) => {
      Object.assign(state, initialState)
    },
  },
})

export const {
  setPdfBases,
  setPreviewPdfBase,
  setCurrentIndex,
  setPageNumber,
  setNumPages,
  setFileBase,
  setEditorOptions,
  setOverlays,
  setCoordinates,
  setEditDialogOpen,
  resetPdfState,
  setOverlayHit,
  setCurrentOverlayId,
  setScale,
} = pdfSlice.actions

export default pdfSlice.reducer
