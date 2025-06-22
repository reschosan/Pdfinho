import { isEmpty } from 'lodash'

export enum EditorType {
  Text = 'text',
  Signature = 'signature',
  Image = 'image',
  Checkbox = 'checkbox',
}

export interface TextOptions {
  type: EditorType.Text
  text: string
  size: number
  color: string
  font: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

export interface SignatureOptions {
  type: EditorType.Signature
  width: number
  height: number
  color: string
  font: string
  src: string
  name: string
  fontSize: number
}

export interface ImageOptions {
  type: EditorType.Image
  width: number
  height: number
  src: string
}

export interface CheckboxOptions {
  type: EditorType.Checkbox
  size: number
  color: string
}

export function isTextOptions(
  options: TextOptions | SignatureOptions | ImageOptions | CheckboxOptions,
): options is TextOptions {
  return options?.type === EditorType.Text
}

export function isSignatureOptions(
  options: TextOptions | SignatureOptions | ImageOptions | CheckboxOptions,
): options is SignatureOptions {
  return options?.type === EditorType.Signature
}

export function isImageOptions(
  options: TextOptions | SignatureOptions | ImageOptions | CheckboxOptions,
): options is ImageOptions {
  return options?.type === EditorType.Image
}

export function isCheckboxOptions(
  options: TextOptions | SignatureOptions | ImageOptions | CheckboxOptions,
): options is CheckboxOptions {
  return options?.type === EditorType.Checkbox
}

export function isTextOptionsValid(
  options: TextOptions | SignatureOptions | ImageOptions | CheckboxOptions,
): options is TextOptions {
  return isTextOptions(options) && !!options.text
}

export function isSignatureOptionsValid(
  options: TextOptions | SignatureOptions | ImageOptions | CheckboxOptions,
): options is SignatureOptions {
  return isSignatureOptions(options) && !isEmpty(options.src)
}

export function isImageOptionsValid(
  options: TextOptions | SignatureOptions | ImageOptions | CheckboxOptions,
): options is ImageOptions {
  return isImageOptions(options) && !isEmpty(options.src)
}

export function isCheckboxOptionsValid(
  options: TextOptions | SignatureOptions | ImageOptions | CheckboxOptions,
): options is CheckboxOptions {
  return isCheckboxOptions(options) && options.size !== undefined && options.size > 0
}
