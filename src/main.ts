import { createApp } from 'vue'
//! 引入App组件
import App from './App.vue'
//! 引入router路由
import router from './router'
//! 引入Element-plus所需组件
import { ElButton } from 'element-plus'
//! 引入Element-plus样式
import 'element-plus/packages/theme-chalk/src/base.scss'

const app = createApp(App)
app.use(router)
app.component(ElButton.name, ElButton)
app.mount('#app')
