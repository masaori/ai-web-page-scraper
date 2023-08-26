export const excludeNull = <T>(array: (T | null | undefined)[]): T[] => {
  return array.filter((e: T | null | undefined): e is T => !!e)
}

// get elements at random by specific number
export const getRandomElements = <T>(array: T[], number: number): T[] => {
  const shuffled = array.sort(() => 0.5 - Math.random())

  return shuffled.slice(0, number)
}
