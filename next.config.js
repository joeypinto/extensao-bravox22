const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  pwa: {
    dest: 'public',
    disable: !isProd
  },
  images: {
    domains: ['i.imgur.com']
  },
  env: {
    TRAY_TOKEN: 'bravo-2bdc09e0-cc53-4187-880d-03a5eeb82804',
    KEY_SECRET_JWT_EXTBRAVOX: 'g3Pb0zpOiqTG9dbB7xZIKLhJYENi82mCAUHS'
  }
}
