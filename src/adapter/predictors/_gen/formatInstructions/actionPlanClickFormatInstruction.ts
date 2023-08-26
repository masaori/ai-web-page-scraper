// This file is generated by scripts/generateFormatInstructions.ts
export const actionPlanClickFormatInstruction = (label: string, x: string, y: string): string => {
  return `{
      "type": 'click',
      "label": string:${label},
      "x": number:${x},
      "y": number:${y},
    }`
}
