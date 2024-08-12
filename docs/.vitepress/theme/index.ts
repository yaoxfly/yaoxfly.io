import DefaultTheme from 'vitepress/theme'
import { App, onMounted } from 'vue'
import { dispatchEventStorage } from '@/utils/tools'
import './custom.css'
import './icon-font/iconfont.css'
const modules = import.meta.glob('../component/global/*.vue')
export default {
  ...DefaultTheme,
  enhanceApp ({ app }: { app: App }) {
    for (const path in modules) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      modules[path]().then((value: any) => {
        app.component(value.default.name, value.default)
      })
    }
  },

  setup () {
    // const jump = () => {
    //   const time = String(new Date())
    //   if (time.includes('GMT+0800') && time.includes('中国') && window.location.href.includes('github')) {
    //     window.location.href = `https://yaoxfly.gitee.io${window.location.pathname}`
    //   }
    // }
    onMounted(() => {
      // jump()
      dispatchEventStorage()
    })
  }
}
