import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import { useAtproto, useAgent } from '#imports'
import { startActorDesktopStreamw } from './utils/utilAtprotoApplicationStates'

export default defineNuxtPlugin({
  name: 'owd-plugin-atproto-jetstream',
  dependsOn: ['owd-plugin-atproto'],
  async setup(nuxt) {
    nuxt.hook('app:mounted', () => {
      const runtimeConfig = useRuntimeConfig()
      const atproto = useAtproto()

      if (
        runtimeConfig.public.desktop.atprotoJetstream &&
        runtimeConfig.public.desktop.atprotoJetstream.startOwnerDesktopStreamOnMounted
      ) {

        if (atproto.isLogged()) {
          const agent = useAgent('private')

          if (runtimeConfig.public.desktop.atprotoDesktop.owner.did === agent.assertDid) {
            return
          }
        }

        startActorDesktopStreamw(runtimeConfig.public.desktop.atprotoDesktop.owner.did)
      }
    })
  },
})
