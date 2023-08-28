// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionResultReportResult } from '../../../../entities/ActionResultReportResult'

export const checkEntityTypeActionResultReportResult = (entity: unknown): entity is ActionResultReportResult => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (
    !('actionResultId' in entity) ||
    typeof entity.actionResultId !== 'string' ||
    !('type' in entity) ||
    !(entity.type === 'reportResult') ||
    !('message' in entity) ||
    typeof entity.message !== 'string'
  ) {
    // console.log(`[checkEntityTypeActionResultReportResult] entity is not ActionResultReportResult: ${JSON.stringify(entity)}`)
    return false
  }

  return true
}