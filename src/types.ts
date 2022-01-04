export enum MessageStatus {
  Pending = 'pending',
  Fulfilled = 'fulfilled',
  Rejected = 'rejected',
}

export enum MessageType {
  Register = 'register',
  Unregister = 'unregister',
  Ask = 'ask',
  Resolve = 'resolve',
  Sync = 'sync',
}

export interface PayloadRegister {
  signature: string
}

export interface PayloadUnregister extends PayloadRegister {}

export interface PayloadAsk {
  key: string
  hashKey: string
}

export interface PayloadResolve {
  key: string
  hashKey: string
  data: any
}

export interface PayloadSync {
  key: string
  hashKey?: string
  data: any
}

export type MessagePayloadGeneralType =
  | PayloadRegister
  | PayloadUnregister
  | PayloadAsk
  | PayloadResolve
  | PayloadSync

export interface Message<T = MessagePayloadGeneralType> {
  type: MessageType
  payload: T
  to?: string
  from?: string
}

export interface MessageGeneralTransformedEvent
  extends Omit<ExtendableMessageEvent, 'data'> {
  data: Message
}

export interface DataPromiseBusState<T = any> {
  hashKey: string
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
  timeoutId?: ReturnType<typeof setTimeout>
}

export interface RequestProps {
  to?: Message['to']
  key: string
  timeout?: number
}

export type AskHandlerFn = (
  data: Message<PayloadAsk>,
  reply: (payload: Message<PayloadResolve>['payload']['data']) => void,
  reject: () => void,
) => void

export type SyncHandlerFn = (payload: PayloadSync) => void
