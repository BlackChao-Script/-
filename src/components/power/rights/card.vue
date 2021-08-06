<template>
  <el-card>
    <el-table :data="data.rightsList" :stripe="true" :border="true">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="权限名称"
        prop="authName"
        align="center"
      ></el-table-column>
      <el-table-column
        label="路径"
        prop="path"
        align="center"
      ></el-table-column>
      <el-table-column label="权限等级" prop="level" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.level === '1'"
            >二级</el-tag
          >
          <el-tag type="warning" v-else-if="scope.row.level === '2'"
            >三级</el-tag
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { reactive } from '@vue/reactivity'
import { getCurrentInstance, onMounted } from '@vue/runtime-core'
//! 注册全局方法
const { proxy } = getCurrentInstance() as any
//! 数据
const data = reactive<any>({
  //* 权限列表
  rightsList: [],
})
//! 请求网络
//* 获取权限列表数据
const getRightLists = () => {
  proxy.$http.get('rights/list').then((res: any) => {
    data.rightsList = res.data
    console.log(data.rightsList)
  })
}
//* 在生命周期函数中调用请求方法
onMounted(getRightLists)
</script>

<style scoped lang="scss"></style>
