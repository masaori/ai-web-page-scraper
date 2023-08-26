// This file is generated by scripts/generateFormatInstructions.ts
export const collectedDataFormatInstruction = (name: string, webPageUrl: string, description: string): string => {
  return `{
      
      "name": string:${name},
      "webPageUrl": string:${webPageUrl},
      "description": string:${description},
    }`
}
