import {
  Message,
  MessageType,
  PayloadRegister,
  PayloadUnregister,
} from './types'
import { NoWorkerAvailableError } from './errorList'

export const dispatchMessage = <T = any>(data: Message<T>) => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(data)
  } else {
    throw new NoWorkerAvailableError()
  }
}

export const registerClient = (data: Message<PayloadRegister>) => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(data)
  } else {
    throw new NoWorkerAvailableError()
  }
}

export const unregisterClient = () => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: MessageType.Unregister,
    } as Message<PayloadUnregister>)
  } else {
    throw new NoWorkerAvailableError()
  }
}

export const addClientToSubscribers = (signature: string) => {
  registerClient({
    type: MessageType.Register,
    payload: { signature: signature },
  } as Message<PayloadRegister>)
}

export const cancelSubscriptionOnLeave = () => {
  window.addEventListener('beforeunload', (event) => {
    unregisterClient()
  })
}

export const automateSubscriptionLifecycle = (signature: string) => {
  addClientToSubscribers(signature)
  cancelSubscriptionOnLeave()
}
