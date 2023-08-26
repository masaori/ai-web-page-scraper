// This file is generated by scripts/generateFormatInstructions.ts
export const actionPlanAppendSheetToSpreadsheetFormatInstruction = (parentSpreadsheetTitle: string, title: string, collectedDataName: string): string => {
  return `{
      "type": 'appendSheetToSpreadsheet',
      "parentSpreadsheetTitle": string:${parentSpreadsheetTitle},
      "title": string:${title},
      "collectedDataName": string:${collectedDataName},
    }`
}