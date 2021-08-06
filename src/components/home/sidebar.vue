<template>
  <el-aside :width="isCollapse ? '64px' : '170px'">
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
      :router="true"
      :default-active="Path"
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
          :index="'/home/' + subItem.path"
          v-for="subItem in item.children"
          :key="subItem.id"
          @click="saveNavState('/home/' + subItem.path)"
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
</template>

<script setup lang="ts">
import { onMounted, reactive, getCurrentInstance, ref } from '@vue/runtime-core'
//! 注册全局方法
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
  proxy.$http
    .get('menus')
    .then((res: any) => {
      menuLists.list = res.data
    })
    .catch(() => proxy.$message.error('获取失败'))
}
onMounted(getMenuPermission)
//! 保存链接的激活状态
//* 被激活的链接地址
const Path = ref<any>('')
const saveNavState = (Path: any) => {
  window.sessionStorage.setItem('Path', Path)
}
Path.value = window.sessionStorage.getItem('Path')
</script>

<style scoped lang="scss">
.el-menu {
  border-right: 0 !important;
}
.el-aside {
  background-color: #172438;
}
.toggle_button {
  font-size: 25px;
  text-align: center;
  padding: 5px;
}
</style>
