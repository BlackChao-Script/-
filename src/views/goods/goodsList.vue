<template>
  <!-- 面包屑导航区 -->
  <breadcrumb>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </breadcrumb>
  <!-- 卡片视图区 -->
  <card></card>
</template>

<script setup lang="ts">
//! 引入组件
import breadcrumb from '../../components/users/breadcrumb.vue'
import card from '../../components/goods/goodsList/card.vue'
</script>

<style scoped lang="scss"></style>
