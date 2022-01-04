import {
  DataPromiseBusState,
  Message,
  MessageType,
  PayloadAsk,
  PayloadResolve,
  RequestProps,
} from './types'
import { RequestTimeoutError } from './errorList'
import { dispatchMessage } from './dispatch'
import { nanoid } from 'nanoid'

const state: DataPromiseBusState[] = []

export const request = <ExpectedDataType = any>({
  to,
  timeout,
  key,
}: RequestProps) => {
  let resolve: DataPromiseBusState<ExpectedDataType>['resolve'],
    reject: DataPromiseBusState['reject'],
    timeoutId: DataPromiseBusState['timeoutId']

  const hashKeySignature = nanoid(16)

  const promise = new Promise<ExpectedDataType>((_resolve, _reject) => {
    ;[resolve, reject] = [_resolve, _reject]
    timeoutId = setTimeout(
      () => reject(new RequestTimeoutError()),
      timeout || 3000,
    )
  })

  dispatchMessage<PayloadAsk>({
    type: MessageType.Ask,
    to: to,
    payload: { hashKey: hashKeySignature, key: key },
  })

  state.push({
    hashKey: hashKeySignature,
    resolve: resolve!,
    reject: reject!,
    timeoutId: timeoutId,
  })

  return promise
}

export const replyOnDataRequest = (
  to: Message['to'],
  hashKey: Message<PayloadAsk>['payload']['hashKey'],
  key: Message<PayloadAsk>['payload']['key'],
  data: Message<PayloadResolve>['payload']['data'],
) => {
  dispatchMessage<PayloadResolve>({
    to: to,
    type: MessageType.Resolve,
    payload: { key: key, hashKey: hashKey, data: data },
  })
}

export const resolveDataRequest = (
  currentHashKey: Message<PayloadResolve>['payload']['hashKey'],
  currentData: Message<PayloadResolve>['payload']['data'],
) => {
  console.log('DX-rdr', currentHashKey, currentData, state)
  const promise = state.find((v) => v.hashKey === currentHashKey)
  if (promise) {
    console.log('resolved', promise.hashKey, currentData)
    if (promise.timeoutId) clearTimeout(promise.timeoutId)
    promise.resolve(currentData)
  }
}
