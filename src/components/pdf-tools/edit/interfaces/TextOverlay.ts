import { TextOptions, SignatureOptions, ImageOptions, CheckboxOptions } from "./EditorOptions"

export interface Overlay {
  id: string
  page: number
  x: number
  y: number
  options: TextOptions | SignatureOptions | ImageOptions | CheckboxOptions
}