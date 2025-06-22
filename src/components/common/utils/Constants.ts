import { StandardFonts } from 'pdf-lib'

export const FontsSignature = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Verdana', value: 'Verdana' },
  { label: 'Pacifico', value: 'Pacifico' },
  { label: 'Shantell Sans', value: 'Shantell Sans' },
  { label: 'Edu AU VIC WA NT Pre', value: 'Edu AU VIC WA NT Pre' },
  { label: 'Indie Flower', value: 'Indie Flower' },
  { label: 'Dancing Script', value: 'Dancing Script' },
]

export const FontsText = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Courier New', value: 'Courier New' },
]

export interface CssFontMapping {
  fontFamily: string
  fontWeight?: 'normal' | 'bold'
  fontStyle?: 'normal' | 'italic'
}

export const StandardFontToCss: Record<StandardFonts, CssFontMapping> = {
  [StandardFonts.Helvetica]: {
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  [StandardFonts.HelveticaBold]: {
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  [StandardFonts.HelveticaOblique]: {
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  [StandardFonts.HelveticaBoldOblique]: {
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },

  [StandardFonts.TimesRoman]: {
    fontFamily: '"Times New Roman", serif',
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  [StandardFonts.TimesRomanBold]: {
    fontFamily: '"Times New Roman", serif',
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  [StandardFonts.TimesRomanItalic]: {
    fontFamily: '"Times New Roman", serif',
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  [StandardFonts.TimesRomanBoldItalic]: {
    fontFamily: '"Times New Roman", serif',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },

  [StandardFonts.Courier]: {
    fontFamily: '"Courier New", monospace',
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  [StandardFonts.CourierBold]: {
    fontFamily: '"Courier New", monospace',
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  [StandardFonts.CourierOblique]: {
    fontFamily: '"Courier New", monospace',
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  [StandardFonts.CourierBoldOblique]: {
    fontFamily: '"Courier New", monospace',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  [StandardFonts.Symbol]: {
    fontFamily: 'Symbol, serif',
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  [StandardFonts.ZapfDingbats]: {
    fontFamily: 'ZapfDingbats, serif',
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
}

export const TextSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36]

export const randomId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
