import { createApp } from 'vue'
//! 引入App组件
import App from './App.vue'
//! 引入router路由
import router from './router'
//! 引入Element-plus所需组件
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus'
//! 引入Element-plus样式
import 'element-plus/packages/theme-chalk/src/base.scss'
//! 导入全局样式表
import './assets/css/global.css'

const app = createApp(App)
app.use(router)
app.component(ElButton.name, ElButton)
app.component(ElForm.name, ElForm)
app.component(ElFormItem.name, ElFormItem)
app.component(ElInput.name, ElInput)
app.config.globalProperties.$message = ElMessage
app.mount('#app')
