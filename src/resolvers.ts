import { AskHandlerFn, Message, PayloadAsk, SyncHandlerFn } from './types'
import { replyOnDataRequest, resolveDataRequest } from './dataExchange'
import { isAskMessage, isResolveMessage, isSyncMessage } from './typeGuards'

const getReplyFn =
  (
    to: Message['to'],
    hashKey: Message<PayloadAsk>['payload']['hashKey'],
    key: Message<PayloadAsk>['payload']['key'],
  ) =>
  (data: any) =>
    replyOnDataRequest(to, hashKey, key, data)

export const registerHandler = (
  requestFn?: AskHandlerFn,
  syncFn?: SyncHandlerFn,
) => {
  const builtFn = (event: MessageEvent<Message>) => {
    console.log('builtFn called', event.data)
    if (isAskMessage(event.data)) {
      console.log('builtFn called for ask')
      if (requestFn) {
        requestFn(
          event.data,
          getReplyFn(
            event.data.from,
            event.data.payload.hashKey,
            event.data.payload.key,
          ),
          () => {},
        )
      }
    }

    if (isResolveMessage(event.data)) {
      console.log('builtFn called for resolve')
      resolveDataRequest(event.data.payload.hashKey, event.data.payload.data)
    }
    if (isSyncMessage(event.data)) {
      console.log('We will try to sync')
      if (syncFn) {
        syncFn(event.data.payload)
      }
    }
  }
  navigator.serviceWorker.addEventListener('message', builtFn)
  window.addEventListener('beforeunload', (event) => {
    navigator.serviceWorker.removeEventListener('message', builtFn)
  })
  console.log('handler registered')
  return builtFn
}

export const unregisterHandler = (builtFn: (event: MessageEvent) => void) => {
  navigator.serviceWorker.removeEventListener('message', builtFn)
  console.log('handler unregistered')
}
