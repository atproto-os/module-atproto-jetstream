import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import { startActorDesktopStreamw } from './utils/utilAtprotoApplicationStates'

export default defineNuxtPlugin({
  name: 'owd-plugin-atproto-jetstream',
  dependsOn: ['owd-plugin-atproto'],
  async setup(nuxt) {
    nuxt.hook('app:mounted', () => {
      const runtimeConfig = useRuntimeConfig()

      if (
        runtimeConfig.public.atprotoJetstream &&
        runtimeConfig.public.atprotoJetstream.startOwnerDesktopStreamOnMounted
      ) {
        startActorDesktopStreamw(runtimeConfig.public.atprotoDesktop.owner.did)
      }
    })
  },
})
