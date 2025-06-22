/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEqual } from 'lodash'

export const areEqual = (value: any, ...other: any[]): boolean => {
  for (const otherValue of other) {
    if (!isEqual(value, otherValue)) {
      return true
    }
  }
  return false
}
