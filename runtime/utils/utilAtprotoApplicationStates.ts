import { useApplicationManager } from "@owdproject/core/runtime/composables/useApplicationManager"
import { useDesktopStore } from '@owdproject/core/runtime/stores/storeDesktop'
import { useRuntimeConfig } from 'nuxt/app'

function getJetstreamUrl(host: string, actorDid: string) {
  const url = new URL('subscribe', `wss://${host}`)
  url.searchParams.append('wantedDids', actorDid)
  url.searchParams.append(
    'wantedCollections',
    'org.owdproject.application.desktop'
  )
  url.searchParams.append(
    'wantedCollections',
    'org.owdproject.application.windows'
  )
  url.searchParams.append(
    'wantedCollections',
    'org.owdproject.application.meta'
  )
  return url.toString()
}

/**
 * Load actor desktop
 *
 * @param actorDid
 */
export async function startActorDesktopStreamw(actorDid: string) {
  const applicationManager = useApplicationManager()
  const runtimeConfig = useRuntimeConfig()

  let ws: WebSocket | null = null

  const handleMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)

      let applicationController
      let atprotoApplicationId

      switch (data.commit.collection) {
        case 'org.owdproject.desktop':
          useDesktopStore().$patch(data.commit.record.state)
          break
        case 'org.owdproject.application.windows':
          atprotoApplicationId = data.commit.rkey.split('/').pop()

          // get the application controller by its id
          applicationController = applicationManager.getAppById(atprotoApplicationId)

          // if the application doesn't exist, exit early
          if (!applicationController) {
            return
          }

          const isApplicationNowRunning = Object.keys(data.commit.record.windows).length > 0

          applicationController.setRunning(isApplicationNowRunning)

          let windowController

          // iterate through all windows in the received remote state
          for (const windowId in data.commit.record.windows) {
            // try to find an existing local window controller
            windowController = applicationController.getWindowById(windowId)

            if (!windowController) {
              // if the window doesn't exist locally, create it
              return applicationController.openWindow(
                data.commit.record.windows[windowId].model,
                data.commit.record.windows[windowId],
                {
                  isRestoring: true
                }
              )
            } else {
              // if the window exists, update its state with the remote one
              windowController.setState(
                data.commit.record.windows[windowId].state
              )
            }
          }

          // second loop: close any local windows that are not in the remote state anymore
          for (const windowId of applicationController.windows.keys()) {
            if (!data.commit.record.windows[windowId]) {
              // the window is no longer present remotely, so close it locally
              applicationController.closeWindow(windowId)
            }
          }

          break
        case 'org.owdproject.application.meta':
          atprotoApplicationId = data.commit.rkey.split('/').pop()

          applicationController.storeMeta.$patch({
            ...data.commit.record
          })
          break
      }
    } catch (e) {
      console.warn('Invalid jetstream message', e)
    }
  }

  ws = new WebSocket(
    getJetstreamUrl(runtimeConfig.public.desktop.atprotoJetstream.host, actorDid)
  )
  ws.addEventListener('message', handleMessage)
}
