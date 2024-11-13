import { describe, it, expect } from "vitest"
import { shallowMount, RouterLinkStub } from "@vue/test-utils"
import NaveBarreComponent from "@/components/NaveBarreComponent.vue"
import routes from "@/router/router-list.js"

describe("NaveBarreComponent", () => {
  it("renders a menu item for each route", () => {
    const wrapper = shallowMount(NaveBarreComponent, {
      global: {
        components: {
          RouterLink: RouterLinkStub
        },
        mocks: {
          $t: (msg) => msg
        }
      }
    })
    const menuItems = wrapper.findAllComponents(RouterLinkStub)
    expect(menuItems.length).toBe(routes.length)
  })

  it("renders the correct route paths", () => {
    const wrapper = shallowMount(NaveBarreComponent, {
      global: {
        components: {
          RouterLink: RouterLinkStub
        },
        mocks: {
          $t: (msg) => msg
        }
      }
    })
    const menuItems = wrapper.findAllComponents(RouterLinkStub)
    if (menuItems.length > 0) {
      menuItems.forEach((item, index) => {
        expect(item.attributes("to")).toBe(routes[index].path)
      })
    }
  })

  it("handles empty routes array", () => {
    const wrapper = shallowMount(NaveBarreComponent, {
      data() {
        return {
          routes: []
        }
      },
      global: {
        components: {
          RouterLink: RouterLinkStub
        },
        mocks: {
          $t: (msg) => msg
        }
      }
    })
    const menuItems = wrapper.findAllComponents(RouterLinkStub)
    expect(menuItems.length).toBe(0)
  })
})
