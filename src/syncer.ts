import { dispatchMessage } from './dispatch'
import { Message, MessageType, PayloadSync } from './types'

export const sync = <T = any>(
  key: Message<PayloadSync>['payload']['key'],
  data: T,
) => {
  dispatchMessage<PayloadSync>({
    type: MessageType.Sync,
    payload: {
      key: key,
      data: data,
    },
  })
}
