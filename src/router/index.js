import { createRouter, createWebHistory } from "vue-router"
import i18n from "@/i18n.js"
import routesList from "@/router/router-list.js"

function checkPath(path) {
  for (let i = 0; i < routesList.length; i++) {
    if (routesList[i].path === path) {
      return true
    }
  }
  return false
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:lang",
      children: routesList
    }
  ]
})

// Middleware pour rediriger si la langue est absente dans l'URL
router.beforeEach((to, from, next) => {
  const lang = to.params.lang
  const availableLanguages = i18n.global.availableLocales
  const defaultLanguage = i18n.global.locale
  if (availableLanguages.includes(lang)) {
    i18n.global.locale = lang
    return next()
  } else if (lang === undefined && to.path === "/") {
    return next(`/${defaultLanguage}/home`)
  } else if (checkPath(to.path.slice(1))) {
    i18n.global.locale = lang
    next(`/${defaultLanguage}${to.path}`)
  }
})

const t = i18n.global.t
router.afterEach((to) => {
  document.title = `${t(`${to.name}.title`)} | ${t("title")}`
})

export default router
