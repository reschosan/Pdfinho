// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '../locales/en.json'
import de from '../locales/de.json'

class WorkerMock {
  constructor(_stringUrl: string) {}
  postMessage = () => {}
  terminate = () => {}
  addEventListener = () => {}
  removeEventListener = () => {}
  onmessage = () => {}
}
;(globalThis as any).Worker = WorkerMock

// Mock for URL.createObjectURL
if (!global.URL.createObjectURL) {
  global.URL.createObjectURL = () => 'mock-url'
}
// Mock for DOMMatrix (used by pdfjs-dist)
if (typeof global.DOMMatrix === 'undefined') {
  class DOMMatrixMock {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    m11 = 1; m12 = 0; m13 = 0; m14 = 0;
    m21 = 0; m22 = 1; m23 = 0; m24 = 0;
    m31 = 0; m32 = 0; m33 = 1; m34 = 0;
    m41 = 0; m42 = 0; m43 = 0; m44 = 1;
    
    constructor(_init?: string | number[]) {}
    
    invertSelf() { return this }
    multiplySelf() { return this }
    translateSelf() { return this }
    scaleSelf() { return this }
    rotateSelf() { return this }
    preMultiplySelf() { return this }
    rotateAxisAngleSelf() { return this }
    rotateFromVectorSelf() { return this }
    scale3dSelf() { return this }
    setMatrixValue() { return this }
    toFloat32Array() { return new Float32Array(16) }
    toFloat64Array() { return new Float64Array(16) }
    
    static fromFloat32Array(_array32: Float32Array) {
      return new DOMMatrixMock()
    }
    static fromFloat64Array(_array64: Float64Array) {
      return new DOMMatrixMock()
    }
    static fromMatrix(_other?: any) {
      return new DOMMatrixMock()
    }
  }

  // @ts-ignore
  global.DOMMatrix = DOMMatrixMock
}

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  interpolation: { escapeValue: false },
})

if (!global.Worker) {
  class WorkerMock {
    constructor(_stringUrl: string) {}
    postMessage = () => {}
    terminate = () => {}
    addEventListener = () => {}
    removeEventListener = () => {}
    onmessage = () => {}
  }
  // @ts-ignore
  global.Worker = WorkerMock
}
