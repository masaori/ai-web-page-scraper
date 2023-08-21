import { UserRequest } from './UserRequest'

export type ActionPlan = {
  id: string
  userRequestId: UserRequest['id']
  type: 'click'
}
