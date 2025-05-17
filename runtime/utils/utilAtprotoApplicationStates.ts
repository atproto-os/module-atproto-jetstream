import { useDesktopStore } from '@owdproject/core/runtime/stores/storeDesktop'
import { useApplicationWindowsStore } from '@owdproject/core/runtime/stores/storeApplicationWindows'
import { useApplicationMetaStore } from '@owdproject/core/runtime/stores/storeApplicationMeta'
import { useRuntimeConfig } from 'nuxt/app'

function getJetstreamUrl(host: string, actorDid: string) {
  const url = new URL('subscribe', `wss://${host}`)
  url.searchParams.append('wantedDids', actorDid)
  url.searchParams.append(
    'wantedCollections',
    'org.owdproject.application.desktop',
  )
  url.searchParams.append(
    'wantedCollections',
    'org.owdproject.application.windows',
  )
  url.searchParams.append(
    'wantedCollections',
    'org.owdproject.application.meta',
  )
  return url.toString()
}

/**
 * Load actor desktop
 *
 * @param actorDid
 */
export async function startActorDesktopStreamw(actorDid: string) {
  const runtimeConfig = useRuntimeConfig()

  let ws: WebSocket | null = null

  const handleMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)

      let atprotoApplicationId
      let applicationWindowsStore
      let applicationMetaStore

      switch (data.commit.collection) {
        case 'org.owdproject.desktop':
          useDesktopStore().$patch(data.commit.record.state)
          break
        case 'org.owdproject.application.windows':
          atprotoApplicationId = data.commit.rkey.split('/').pop()
          applicationWindowsStore =
            useApplicationWindowsStore(atprotoApplicationId)

          applicationWindowsStore.$patch({
            windows: data.commit.record.windows,
          })
          break
        case 'org.owdproject.application.meta':
          atprotoApplicationId = data.commit.rkey.split('/').pop()
          applicationMetaStore = useApplicationMetaStore(atprotoApplicationId)

          applicationMetaStore.$patch({
            ...data.commit.record,
          })
          break
      }
    } catch (e) {
      console.warn('Invalid jetstream message', e)
    }
  }

  ws = new WebSocket(
    getJetstreamUrl(runtimeConfig.public.atprotoJetstream.host, actorDid),
  )
  ws.addEventListener('message', handleMessage)
}
