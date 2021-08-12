<template>
  <!-- 面包屑导航区 -->
  <breadcrumb>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </breadcrumb>
  <!--卡片视图区 -->
  <card></card>
</template>
<script setup lang="ts">
import breadcrumb from '../components/users/breadcrumb.vue'
import card from '../components/orders/card.vue'
</script>

<style scoped lang="scss"></style>
