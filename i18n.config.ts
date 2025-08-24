export default {
  strategy: 'prefix_except_default',
  defaultLocale: 'fr',
  locales: [
    { code: 'en', iso: 'en-US', file: 'en.json' },
    { code: 'fr', iso: 'fr-FR', file: 'fr.json' },
    { code: 'es', iso: 'es-ES', file: 'es.json' },
    { code: 'it', iso: 'it-IT', file: 'it.json' }
  ],
  langDir: 'locales'
}