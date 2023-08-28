// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionPlanReportResultWithAssociation } from '../../../../entities/_gen/ActionPlanReportResultWithAssociation'
import { checkEntityTypeActionPlanReportResultWithAssociation } from '../withAssociation/checkEntityTypeActionPlanReportResultWithAssociation'

export const checkEntityTypeActionPlanReportResultWithAssociationList = (entity: unknown): entity is ActionPlanReportResultWithAssociation[] => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (!Array.isArray(entity)) {
    return false
  }

  for (const el of entity) {
    if (!checkEntityTypeActionPlanReportResultWithAssociation(el)) {
      return false
    }
  }

  return true
}
