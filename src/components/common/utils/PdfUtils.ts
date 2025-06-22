/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from '@reduxjs/toolkit'
import heic2any from 'heic2any'
import _ from 'lodash'
import {
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFImage,
  PDFRadioGroup,
  PDFTextField,
  rgb,
  StandardFonts,
} from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import { getDocument } from 'pdfjs-dist'
import { setPdfBases } from '../../../store/pdfSlice'

export const combinePdfsFromBase64 = async (
  pdfBases: string[],
  flatten?: boolean,
  compressLevel?: number,
) => {
  const mergedPdf = await PDFDocument.create()

  await copyPagesFromBase64ToPdfDoc(pdfBases, mergedPdf)
  let pdfBytes = await mergedPdf.save()
  if (compressLevel && compressLevel > 0) {
    pdfBytes = await compressPdfToImages(pdfBytes, compressLevel)
  }
  const blob: Blob = await handleFlatten(flatten, pdfBytes)
  const url = URL.createObjectURL(blob)
  window.open(url)
}

export const downloadPdfsFromBase64 = async (
  pdfBases: string[],
  flatten?: boolean,
  compressLevel?: number,
) => {
  const mergedPdf = await PDFDocument.create()

  await copyPagesFromBase64ToPdfDoc(pdfBases, mergedPdf)

  let pdfBytes = await mergedPdf.save()

  if (compressLevel && compressLevel > 0) {
    pdfBytes = await compressPdfToImages(pdfBytes, compressLevel)
  }

  const blob: Blob = await handleFlatten(flatten, pdfBytes)

  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'merged.pdf'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const pureBase64 = base64.includes(',') ? base64.split(',')[1] : base64
  const binaryString = window.atob(pureBase64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

export const handlePdfDrop = async (
  acceptedFiles: File[],
  dispatch: Dispatch<any>,
  pdfBases: string[],
  currentPdfFiles: File[],
): Promise<File[]> => {
  const getUniqueFileName = (name: string, existingNames: Set<string>) => {
    if (!existingNames.has(name)) return name
    const ext = name.includes('.') ? '.' + name.split('.').pop() : ''
    const base = ext ? name.slice(0, -ext.length) : name
    let i = 1
    let newName = `${base} (${i})${ext}`
    while (existingNames.has(newName)) {
      i++
      newName = `${base} (${i})${ext}`
    }
    return newName
  }

  const existingNames = new Set(currentPdfFiles.map((f) => f.name))

  const validFiles = acceptedFiles.filter((file) => containsValidFileTypes(file))

  const pdfPromises = validFiles.map(async (file) => {
    let newFile = file
    const uniqueName = getUniqueFileName(file.name, existingNames)
    existingNames.add(uniqueName)

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      const pdfBytes = await imageToPdf(file)
      newFile = new File([pdfBytes], uniqueName.replace(/\.[^/.]+$/, '.pdf'), {
        type: 'application/pdf',
      })
    } else if (uniqueName !== file.name) {
      newFile = new File([await file.arrayBuffer()], uniqueName, {
        type: file.type,
      })
    }
    return newFile
  })

  const uploadedPdfFiles = await Promise.all(pdfPromises)

  const base64Promises = uploadedPdfFiles.map(fileToBase64)
  const base64Files = await Promise.all(base64Promises)

  dispatch(setPdfBases([...pdfBases, ...base64Files]))

  const allPdfFiles = [...currentPdfFiles, ...uploadedPdfFiles]
  return Promise.all(allPdfFiles)
}

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export const base64ToPdfFile = (base64: string): File => {
  const pdfBytes = base64ToArrayBuffer(base64)
  return new File([pdfBytes], 'edited.pdf', { type: 'application/pdf' })
}

export const imageBase64ToPdfBase64 = async (
  imageBase64: string,
): Promise<string> => {
  const pdfDoc = await PDFDocument.create()
  let embeddedImage
  if (imageBase64.startsWith('data:image/png')) {
    embeddedImage = await pdfDoc.embedPng(imageBase64)
  } else if (imageBase64.startsWith('data:image/jpeg')) {
    embeddedImage = await pdfDoc.embedJpg(imageBase64)
  } else {
    throw new Error('Nur PNG oder JPEG unterstützt')
  }
  const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height])
  page.drawImage(embeddedImage, {
    x: 0,
    y: 0,
    width: embeddedImage.width,
    height: embeddedImage.height,
  })
  const pdfBytes = await pdfDoc.save()
  return 'data:application/pdf;base64,' + uint8ToBase64(pdfBytes)
}

const handleFlatten = async (
  flatten: boolean | undefined,
  pdfBytes: Uint8Array<ArrayBufferLike>,
): Promise<Blob> => {
  let blob: Blob
  if (flatten) {
    const flattenPDF = await flattenPdfForm(pdfBytes)
    const flattenAnnotationsPDF = await flattenAnnotations(flattenPDF)
    blob = new Blob([flattenAnnotationsPDF], { type: 'application/pdf' })
  } else {
    blob = new Blob([pdfBytes], { type: 'application/pdf' })
  }
  return blob
}

const copyPagesFromBase64ToPdfDoc = async (
  pdfBases: string[],
  mergedPdf: PDFDocument,
) => {
  for (const base64 of pdfBases) {
    const pdfBytes = base64ToArrayBuffer(base64)
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page)
    })
  }
}

export function containsValidFileTypes(file: File): boolean {
  return (
    file.name.toLowerCase().endsWith('.pdf') ||
    file.name.toLowerCase().endsWith('.png') ||
    file.name.toLowerCase().endsWith('.jpg') ||
    file.name.toLowerCase().endsWith('.jpeg') ||
    file.name.toLowerCase().endsWith('.heif') ||
    file.name.toLowerCase().endsWith('.heic')
  )
}

export async function flattenPdfForm(pdfBytes: Uint8Array): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const form = pdfDoc.getForm()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fields = form.getFields()

  for (const field of fields) {
    const widgets = (field as any).acroField?.getWidgets?.() ?? []

    let value = ''
    if (field instanceof PDFTextField) {
      value = field.getText() || ''
    } else if (field instanceof PDFDropdown) {
      const selected = field.getSelected()
      value = Array.isArray(selected) ? selected.join(', ') : selected || ''
    } else if (field instanceof PDFCheckBox) {
      value = field.isChecked() ? '\u2611' : '\u2610' 
    } else if (field instanceof PDFRadioGroup) {
      value = field.getSelected() || ''
    }

    widgets.forEach((widget: { getPage: () => any; getRectangle: () => any }) => {
      const page = widget.getPage()
      const rect = widget.getRectangle()
      const { x, y, height } = rect

      page.drawText(value, {
        x: x + 2,
        y: y + height / 4,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      })
    })

    form.removeField(field)
  }

  return await pdfDoc.save()
}

export async function flattenAnnotations(pdfBytes: Uint8Array): Promise<Uint8Array> {
  const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise
  const pdfDoc = await PDFDocument.create()

  const scale = 2 // oder 3 für noch höhere Qualität

  for (let i = 1; i < pdf.numPages + 1; i++) {
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale })

    // Create a canvas to render the page
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const context = canvas.getContext('2d')!
    await page.render({ canvasContext: context, viewport }).promise

    // To PNG
    const imgData = canvas.toDataURL('image/png')
    const pngImage = await pdfDoc.embedPng(imgData)

    // Add a new page to the PDF document with the same dimensions
    const origViewport = page.getViewport({ scale: 1 })
    const pageDims = pdfDoc.addPage([origViewport.width, origViewport.height])
    pageDims.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: origViewport.width,
      height: origViewport.height,
    })
  }

  return await pdfDoc.save()
}

export const iosImageToPng = async (file: File): Promise<File> => {
  let convertedFile
  try {
    const convertedBlob = (await heic2any({
      blob: file,
      toType: 'image/png',
    })) as Blob

    //to file
    convertedFile = new File(
      [convertedBlob],
      file.name.replace(/\.[^/.]+$/, '.png'),
      {
        type: 'image/png',
      },
    )
  } catch (error) {
    console.error('HEIC-Konvertierung fehlgeschlagen:', error)
    throw new Error('HEIC-Konvertierung fehlgeschlagen')
  }

  return convertedFile
}

export const imageToPdf = async (file: File): Promise<Uint8Array> => {
  const MM_TO_PT = 2.83465
  const A4_WIDTH_PT = 210 * MM_TO_PT // 595.28 pt
  const A4_HEIGHT_PT = 297 * MM_TO_PT // 841.89 pt
  const A4_LANDSCAPE_WIDTH_PT = 297 * MM_TO_PT // 841.89 pt
  const A4_LANDSCAPE_HEIGHT_PT = 210 * MM_TO_PT // 595.28 pt

  const pdfDoc = await PDFDocument.create()

  let imageBytes: ArrayBuffer
  let extension = file.type

  // HEIC/HEIF to JPEG 
  if (_.isEqual(extension, 'image/heic') || _.isEqual(extension, 'image/heif')) {
    try {
      const convertedBlob = (await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      })) as Blob
      imageBytes = await convertedBlob.arrayBuffer()
      extension = 'image/jpeg' // nach Konvertierung
    } catch (error) {
      console.error('HEIC-Konvertierung fehlgeschlagen:', error)
      return new Uint8Array()
    }
  } else {
    imageBytes = await file.arrayBuffer()
  }

  let image
  if (_.isEqual(extension, 'image/jpeg') || _.isEqual(extension, 'image/jpg')) {
    image = await pdfDoc.embedJpg(imageBytes)
  } else if (_.isEqual(extension, 'image/png')) {
    image = await pdfDoc.embedPng(imageBytes)
  } else {
    console.warn(`Unsupported image format: ${extension}`)
    return new Uint8Array()
  }

  let imgWidth = image.width
  let imgHeight = image.height
  let pageWidth = imgWidth
  let pageHeight = imgHeight

  
  if (imgWidth > imgHeight) {
    if (imgWidth > A4_LANDSCAPE_WIDTH_PT || imgHeight > A4_LANDSCAPE_HEIGHT_PT) {
      const scale = Math.min(
        A4_LANDSCAPE_WIDTH_PT / imgWidth,
        A4_LANDSCAPE_HEIGHT_PT / imgHeight,
      )
      pageWidth = imgWidth * scale
      pageHeight = imgHeight * scale
      imgWidth = pageWidth
      imgHeight = pageHeight
    }
  } else {
    if (imgWidth > A4_WIDTH_PT || imgHeight > A4_HEIGHT_PT) {
      const scale = Math.min(A4_WIDTH_PT / imgWidth, A4_HEIGHT_PT / imgHeight)
      pageWidth = imgWidth * scale
      pageHeight = imgHeight * scale
      imgWidth = pageWidth
      imgHeight = pageHeight
    }
  }

  const page = pdfDoc.addPage([pageWidth, pageHeight])
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: imgWidth,
    height: imgHeight,
  })

  return await pdfDoc.save()
}

async function renderPageToImage(
  page: any,
  scale = 1.0,
): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  canvas.width = viewport.width
  canvas.height = viewport.height
  await page.render({ canvasContext: context, viewport }).promise
  return canvas
}

export async function compressPdfToImages(
  pdfBytes: Uint8Array,
  scale = 0.5,
): Promise<Uint8Array> {
  const loadingTask = getDocument({ data: pdfBytes })
  const pdf = await loadingTask.promise

  const compressedPdf = await PDFDocument.create()

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const canvas = await renderPageToImage(page, 1 - scale)

    const imgDataUrl = canvas.toDataURL('image/jpeg')
    const imgBytes = await fetch(imgDataUrl).then((res) => res.arrayBuffer())

    const embeddedImage = await compressedPdf.embedJpg(imgBytes)
    const pageDims: [number, number] = [canvas.width, canvas.height]
    const pdfPage = compressedPdf.addPage(pageDims)

    pdfPage.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    })
  }
  return await compressedPdf.save()
}

export async function addTextToPdf(
  base64: string,
  x: number,
  y: number,
  text: string,
): Promise<string> {
  const pdfDoc = await PDFDocument.load(base64ToUint8Array(base64))
  const pages = pdfDoc.getPages()
  const page = pages[0]
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  page.drawText(text, {
    x,
    y,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  })

  const pdfBytes = await pdfDoc.save()
  return uint8ToBase64(pdfBytes)
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function uint8ToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export function hexToRgbColor(hex: string) {
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((x) => x + x)
      .join('')
  }
  const num = parseInt(hex, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return rgb(r / 255, g / 255, b / 255)
}

export const embedImage = async (
  src: string,
  pdfDoc: PDFDocument,
): Promise<PDFImage | undefined> => {
  let embeddedImage
  if (src.startsWith('data:image/png')) {
    embeddedImage = await pdfDoc.embedPng(src)
  } else if (src.startsWith('data:image/jpeg') || src.startsWith('data:image/jpg')) {
    embeddedImage = await pdfDoc.embedJpg(src)
  } else if (
    src.startsWith('data:image/heic') ||
    src.startsWith('data:image/heif')
  ) {
    const convertedBlob = (await heic2any({
      blob: await fetch(src).then((res) => res.blob()),
      toType: 'image/png',
    })) as Blob
    embeddedImage = await pdfDoc.embedPng(await convertedBlob.arrayBuffer())
  }

  return embeddedImage
}
