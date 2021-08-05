<template>
  <!-- 面包屑导航区 -->
  <breadcrumb>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </breadcrumb>
  <!-- 卡片视图区 -->
  <card></card>
</template>

<script setup lang="ts">
//! 引入组件
import breadcrumb from '../../components/users/breadcrumb.vue'
import card from '../../components/power/roles/card.vue'
</script>

<style scoped lang="scss"></style>
