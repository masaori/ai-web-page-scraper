// This file is generated by scripts/generateEntityTypeWithAssociations.ts
import { CollectedData } from '../CollectedData'
// Import Referred entities
import { SpreadsheetSheetWithAssociation } from './SpreadsheetSheetWithAssociation'
// Import Sub type entities

export type CollectedDataWithAssociation = CollectedData & {
  // Unique Referred entities
  spreadsheetSheet: SpreadsheetSheetWithAssociation | null
  // Non-unique Referred entities
}
