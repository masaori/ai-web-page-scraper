// This file is generated by scripts/generateFormatInstructions.ts
export const actionResultCreateSpreadsheetFormatInstruction = (spreadsheetId: string): string => {
  return `{
      "type": 'createSpreadsheet',
      "spreadsheetId": string:${spreadsheetId}
    }`
}