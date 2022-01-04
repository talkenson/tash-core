import { getTunnel } from './getTunnel'

export const createHandler = (self: ServiceWorkerGlobalScope) => {
  const tunnelEventHandler = getTunnel()
  self.addEventListener('message', tunnelEventHandler)
}
