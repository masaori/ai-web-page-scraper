import { EntityPropertyDefinition } from 'ast-to-entity-definitions/bin/domain/entities/EntityPropertyDefinition'

export const getTypeName = (property: EntityPropertyDefinition): string => {
  if (property.isReference) {
    return property.isNullable ? `string | null` : `string`
  } else {
    if (property.acceptableValues && property.acceptableValues.length > 0) {
      const acceptableValuesString = property.acceptableValues.map((value) => `'${value}'`).join(' | ')

      return property.isNullable ? `${acceptableValuesString} | null` : acceptableValuesString
    } else {
      return property.isNullable ? `${property.propertyType} | null` : property.propertyType
    }
  }
}
