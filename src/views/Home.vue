<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="header_title">Administrator</div>
      <el-button type="info" @click="logout" :round="true">退出登录</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <sidebar></sidebar>
      <!-- 右边主体 -->
      <right-main></right-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
//! 引入组件
import sidebar from '../components/home/sidebar.vue'
import rightMain from '../components/home/rightMain.vue'

//! 退出功能
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
.el-button{
  background-color: #172438;
}
</style>
