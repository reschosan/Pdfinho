import { Paragraph, Packer, Document as DocxDocument } from 'docx'
import JSZip from 'jszip'
import { getDocument } from 'pdfjs-dist'
import { pdfjs } from 'react-pdf'

export const handleDownloadFiles = async (files: File | File[]) => {
  if (Array.isArray(files) && files.length > 1) {
    const zip = new JSZip()
    files.forEach((file) => {
      zip.file(file.name, file)
    })
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted.zip'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } else {
    const file = Array.isArray(files) ? files[0] : files
    const url = window.URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name || 'download'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }
}

export const convertPdfToWord = async (
  file: File,
  setWordFile: (file: File) => void,
) => {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
  const paragraphs: Paragraph[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    let lastY: number | null = null
    let lastX: number | null = null
    let line = ''
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const item of textContent.items as any[]) {
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 20) {
        if (line.trim()) {
          paragraphs.push(new Paragraph(line.trim()))
        }
        paragraphs.push(new Paragraph('')) // Absatz/Break
        line = ''
        lastX = null
      }
      // new line at the start of a line
      else if (lastY !== null && Math.abs(item.transform[5] - lastY) > 10) {
        if (line.trim()) {
          paragraphs.push(new Paragraph(line.trim()))
        }
        line = ''
        lastX = null
      }
      // Tabulator because of large gaps
      if (
        lastX !== null &&
        Math.abs(item.transform[4] - lastX) > 20 &&
        line.length > 0 &&
        !line.endsWith('\t') &&
        !/\s$/.test(line)
      ) {
        line = line.replace(/\s+$/, '') + '\t'
      } else if (line && !line.endsWith('\t') && !line.endsWith(' ')) {
        line += ''
      }
      line += item.str
      lastY = item.transform[5]
      lastX = item.transform[4]
    }
    if (line.trim())
      paragraphs.push(new Paragraph(line.replace(/^\t+|\t+$/g, '').trim()))
    if (i < pdf.numPages)
      paragraphs.push(new Paragraph({ children: [], pageBreakBefore: true }))
  }

  const doc = new DocxDocument({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const wordFile = new File([blob], file.name.replace(/\.pdf$/i, '.docx'), {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })
  setWordFile(wordFile)
}

export const convertPdfToImg = async (
  file: File,
  format: 'image/jpeg' | 'image/png',
  setJpgFiles: (files: File[]) => void,
  setPngFiles: (files: File[]) => void,
) => {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: arrayBuffer }).promise
  const imgFiles: File[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale: 1 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const context = canvas.getContext('2d')
    if (context) {
      await page.render({ canvasContext: context, viewport }).promise
      await new Promise<void>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const imgFile = new File(
              [blob],
              file.name.replace(
                /\.pdf$/i,
                `_${pageNum}.${format === 'image/jpeg' ? 'jpg' : 'png'}`,
              ),
              { type: format },
            )
            imgFiles.push(imgFile)
          }
          resolve()
        }, format)
      })
    }
  }

  if (format === 'image/jpeg') {
    setJpgFiles(imgFiles)
  } else if (format === 'image/png') {
    setPngFiles(imgFiles)
  }
}
