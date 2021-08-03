<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="header_title">Administrator</div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_button" @click="toggleCollapse">
          <i class="el-icon-s-fold" v-if="!isCollapse"></i>
          <i class="el-icon-s-unfold" v-else-if="isCollapse"></i>
        </div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#172438"
          text-color="#ccc"
          active-text-color="#fff"
          :unique-opened="true"
          :collapse-transition="false"
          :collapse="isCollapse"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuLists.list"
            :key="item.id"
          >
            <!-- 一级菜单模板区 -->
            <template #title>
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="subItem.id + ''"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template #title>
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, getCurrentInstance, ref } from '@vue/runtime-core'
import { useRouter } from 'vue-router'

//! 引入网络请求方法
import { MenuPermission } from '../api/MenuPermission'
const { proxy } = getCurrentInstance() as any
//! 左侧菜单数据
let menuLists = reactive<any>({
  list: [],
})
//! 一级菜单图标
const iconObj = reactive<any>({
  '125': 'el-icon-s-custom',
  '103': 'el-icon-box',
  '101': 'el-icon-shopping-bag-2',
  '102': 'el-icon-notebook-2',
  '145': 'el-icon-edit',
})
//! 点击折叠菜单栏
//* 是否折叠
const isCollapse = ref<boolean>(false)
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
const getMenuPermission = () => {
  MenuPermission().then((res) => {
    if (res.meta.status !== 200) return proxy.$message.error(res.meta.msg)
    menuLists.list = res.data
    console.log(menuLists.list)
  })
}
onMounted(getMenuPermission)
const $router = useRouter()
const logout = () => {
  window.sessionStorage.clear()
  $router.push('/login')
}
</script>

<style scoped lang="scss">
.el-container {
  height: 100%;
  color: #fff;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0d141f;
  .header_title {
    font-size: 25px;
    flex-wrap: 700;
  }
}
.el-menu {
  border-right: 0 !important;
}
.el-aside {
  background-color: #172438;
}
.el-main {
  background-color: #22374f;
}
.toggle_button {
  font-size: 25px;
  text-align: center;
  padding: 5px;
}
</style>
