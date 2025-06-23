import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'owd-module-atproto-jetstream',
    configKey: 'atprotoJetstream',
  },
  defaults: {
    startOwnerDesktopStreamOnMounted: false,
    host: 'jetstream1.us-east.bsky.network',
  },
  setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // set runtime config
    _nuxt.options.runtimeConfig.public.desktop.atprotoJetstream = _options

    addPlugin({
      src: resolve('./runtime/plugin'),
      mode: 'client',
    })
  },
})
