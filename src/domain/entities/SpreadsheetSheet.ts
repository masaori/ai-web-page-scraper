import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { CollectedData } from './CollectedData'
import { Spreadsheet } from './Spreadsheet'

export type SpreadsheetSheet = {
  id: string
  spreadsheetId: Spreadsheet['id']
  collectedDataId: Unique<CollectedData['id']> | null
  sheetNumber: number
  name: string
  description: string
}
