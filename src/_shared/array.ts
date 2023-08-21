export const excludeNull = <T>(array: (T | null | undefined)[]): T[] => {
  return array.filter((e: T | null | undefined): e is T => !!e)
}
