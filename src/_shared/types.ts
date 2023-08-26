export const check2dArrayOfStringOrNumbers = (array: unknown): array is (string | number)[][] => {
  if (!Array.isArray(array)) {
    return false
  }

  for (const el of array) {
    if (!Array.isArray(el)) {
      return false
    }

    for (const el2 of el) {
      if (typeof el2 !== 'string' && typeof el2 !== 'number') {
        return false
      }
    }
  }

  return true
}
