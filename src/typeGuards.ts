import {
  Message,
  MessageType,
  PayloadAsk,
  PayloadRegister,
  PayloadResolve,
  PayloadSync,
  PayloadUnregister,
} from './types'

export const isServiceMessage = (
  message: Message,
): message is Message<PayloadRegister | PayloadUnregister> => {
  return (
    Object.prototype.hasOwnProperty.call(message, 'type') &&
    (message.type === MessageType.Register ||
      message.type === MessageType.Unregister)
  )
}

export const isAskMessage = (
  message: Message,
): message is Message<PayloadAsk> => {
  return (
    Object.prototype.hasOwnProperty.call(message, 'type') &&
    message.type === MessageType.Ask
  )
}

export const isResolveMessage = (
  message: Message,
): message is Message<PayloadResolve> => {
  return (
    Object.prototype.hasOwnProperty.call(message, 'type') &&
    message.type === MessageType.Resolve
  )
}

export const isSyncMessage = (
  message: Message,
): message is Message<PayloadSync> => {
  return (
    Object.prototype.hasOwnProperty.call(message, 'type') &&
    message.type === MessageType.Sync
  )
}
