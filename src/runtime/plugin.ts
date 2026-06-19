import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import { useAtprotoSession, useAtprotoAgent } from '#imports'
import { startActorDesktopStream } from './utils/utilAtprotoApplicationStates'

export default defineNuxtPlugin({
  name: 'desktop-plugin-atproto-jetstream',
  dependsOn: ['desktop-plugin-atproto'],
  async setup(nuxt) {
    nuxt.hook('app:mounted', () => {
      const runtimeConfig = useRuntimeConfig()
      const { isLogged } = useAtprotoSession()

      if (
        runtimeConfig.public.desktop.atprotoJetstream &&
        runtimeConfig.public.desktop.atprotoJetstream.startOwnerDesktopStreamOnMounted
      ) {
        if (isLogged.value) {
          const agent = useAtprotoAgent('authenticated')

          if (runtimeConfig.public.desktop.atprotoDesktop.owner.did === agent.assertDid) {
            return
          }
        }

        startActorDesktopStream(runtimeConfig.public.desktop.atprotoDesktop.owner.did)
      }
    })
  },
})
