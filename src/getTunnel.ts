import { Message, MessageGeneralTransformedEvent, MessageType } from './types'
import {
  isAskMessage,
  isResolveMessage,
  isServiceMessage,
  isSyncMessage,
} from './typeGuards'

export async function tunnelHandler(
  this: ServiceWorkerGlobalScope,
  event: MessageGeneralTransformedEvent,
) {
  console.log('swTunnel', event.data, event)
  const data: Message = {
    ...event.data,
    from: (event.source as Client).id,
  }
  if ('payload' in data) {
    if (isServiceMessage(data)) {
      console.log('service message', data.type, JSON.stringify(data))
      switch (data.type) {
        case MessageType.Register:
          break
        case MessageType.Unregister:
          break
      }
    }
    if (isAskMessage(data)) {
      console.log('ask based')
      const allClients = await this.clients.matchAll()
      for (const client of allClients) {
        if (client.id !== data.from && (!data.to || data.to === client.id)) {
          client.postMessage(data)
        }
      }
    }
    if (isResolveMessage(data)) {
      console.log('resolve based')
      const allClients = await this.clients.matchAll()
      for (const client of allClients) {
        if (client.id !== data.from && (!data.to || data.to === client.id)) {
          client.postMessage(data)
        }
      }
    }
    if (isSyncMessage(data)) {
      console.log('sync based')
      const allClients = await this.clients.matchAll()
      for (const client of allClients) {
        if (client.id !== data.from) {
          client.postMessage(data)
        }
      }
    }
  }
}

export const getTunnel = () => {
  console.log('tunnel getter called')
  return function (
    this: ServiceWorkerGlobalScope,
    ev: MessageGeneralTransformedEvent,
  ) {
    return tunnelHandler.bind(this)(ev)
  }
}
