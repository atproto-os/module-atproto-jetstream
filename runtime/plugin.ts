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
        runtimeConfig.public.atprotoJetstream &&
        runtimeConfig.public.atprotoJetstream.startOwnerDesktopStreamOnMounted
      ) {

        if (atproto.isLogged()) {
          const agent = useAgent('private')

          if (runtimeConfig.public.atprotoDesktop.owner.did === agent.assertDid) {
            return
          }
        }

        startActorDesktopStreamw(runtimeConfig.public.atprotoDesktop.owner.did)
      }
    })
  },
})
