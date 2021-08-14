import { createApp } from 'vue'
//! 引入App组件
import App from './App.vue'
//! 引入router路由
import router from './router'
//! 引入axios网络请求
import request from './api/requests'
//! 引入Element-plus所需组件
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElMenu,
  ElSubmenu,
  ElMenuItem,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElCard,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElTooltip,
  ElPagination,
  ElDialog,
  ElButtonGroup,
  ElMessageBox,
  ElTag,
  ElTree,
  ElSelect,
  ElOption,
  ElResult,
  ElAlert,
  ElCascader,
  ElTabs,
  ElTabPane,
  ElSteps,
  ElStep,
  ElUpload,
  ElTimeline,
  ElTimelineItem,
  ElProgress,
} from 'element-plus'
//! 引入Element-plus样式
import 'element-plus/packages/theme-chalk/src/base.scss'
//! 导入全局样式表
import './assets/css/global.css'

const app = createApp(App)
app.use(router)
//! 注册使用Element-plus组件
app.component(ElButton.name, ElButton)
app.component(ElForm.name, ElForm)
app.component(ElFormItem.name, ElFormItem)
app.component(ElInput.name, ElInput)
app.component(ElContainer.name, ElContainer)
app.component(ElHeader.name, ElHeader)
app.component(ElAside.name, ElAside)
app.component(ElMain.name, ElMain)
app.component(ElMenu.name, ElMenu)
app.component(ElSubmenu.name, ElSubmenu)
app.component(ElMenuItem.name, ElMenuItem)
app.component(ElBreadcrumb.name, ElBreadcrumb)
app.component(ElBreadcrumbItem.name, ElBreadcrumbItem)
app.component(ElCard.name, ElCard)
app.component(ElRow.name, ElRow)
app.component(ElCol.name, ElCol)
app.component(ElTable.name, ElTable)
app.component(ElTableColumn.name, ElTableColumn)
app.component(ElSwitch.name, ElSwitch)
app.component(ElTooltip.name, ElTooltip)
app.component(ElPagination.name, ElPagination)
app.component(ElDialog.name, ElDialog)
app.component(ElButtonGroup.name, ElButtonGroup)
app.component(ElMessageBox.name, ElMessageBox)
app.component(ElTag.name, ElTag)
app.component(ElTree.name, ElTree)
app.component(ElOption.name, ElOption)
app.component(ElSelect.name, ElSelect)
app.component(ElResult.name, ElResult)
app.component(ElAlert.name, ElAlert)
app.component(ElCascader.name, ElCascader)
app.component(ElTabs.name, ElTabs)
app.component(ElTabPane.name, ElTabPane)
app.component(ElSteps.name, ElSteps)
app.component(ElStep.name, ElStep)
app.component(ElUpload.name, ElUpload)
app.component(ElTimeline.name, ElTimeline)
app.component(ElTimelineItem.name, ElTimelineItem)
app.component(ElProgress.name, ElProgress)

//! 注册全局方法
app.config.globalProperties.$message = ElMessage
app.config.globalProperties.$confirm = ElMessageBox.confirm
app.config.globalProperties.$http = request
app.mount('#app')
