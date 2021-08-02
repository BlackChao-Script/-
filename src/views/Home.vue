<template>
  <el-button type="info" @click="logout">退出登录</el-button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const $router = useRouter()
const logout = () => {
  window.sessionStorage.clear()
  $router.push('/login')
}
</script>

<style scoped lang="scss"></style>
