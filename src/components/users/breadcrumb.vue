<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <slot></slot>
  </el-breadcrumb>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
