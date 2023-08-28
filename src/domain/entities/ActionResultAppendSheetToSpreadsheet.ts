import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { ActionResult } from './ActionResult'

export type ActionResultAppendSheetToSpreadsheet = {
  actionResultId: Unique<ActionResult['id']>
  type: 'appendSheetToSpreadsheet'
  spreadsheetId: string
  sheetNumber: number
  collectedDataId: string
}
