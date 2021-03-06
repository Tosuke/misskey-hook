import dotenv from 'dotenv'

export default {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Misskey hook',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Incoming Webhook for misskey.xyz' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  modules: ['@nuxtjs/vuetify', '@nuxtjs/axios' ],
  plugins: ['~/plugins/clipboard', '~/plugins/clientInit'],
  css: ['material-design-icons-iconfont/dist/material-design-icons.css'],
  env: dotenv.config().parsed,
  /*
  ** Build configuration
  */
  build: {
    // cache: true,
    parallel: true,
    /*
    ** Run ESLint on save
    */
    extend(config) {
      if (process.server && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
