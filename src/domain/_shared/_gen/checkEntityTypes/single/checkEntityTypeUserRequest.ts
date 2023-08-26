// This file is generated by scripts/generateCheckEntityTypes.ts
import { UserRequest } from '../../../../entities/UserRequest'

export const checkEntityTypeUserRequest = (entity: unknown): entity is UserRequest => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (
    !('id' in entity) ||
    typeof entity.id !== 'string' ||
    !('url' in entity) ||
    typeof entity.url !== 'string' ||
    !('prompt' in entity) ||
    typeof entity.prompt !== 'string'
  ) {
    // console.log(`[checkEntityTypeUserRequest] entity is not UserRequest: ${JSON.stringify(entity)}`)
    return false
  }

  return true
}
