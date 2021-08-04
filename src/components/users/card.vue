<template>
  <el-card>
    <!-- 搜索与添加区 -->
    <el-row :gutter="20">
      <el-col :span="13">
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          :clearable="true"
          @clear="getuserDataLists"
        >
          <template #append>
            <el-button
              icon="el-icon-search"
              @click="getuserDataLists"
            ></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="info" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 用户列表区 -->
    <el-table :data="userlists.userlist" :border="true" :stripe="true">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态" prop="mg_state">
        <template #default="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeSwitch(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-row :gutter="30">
            <el-col :span="7">
              <el-tooltip content="编辑" placement="top" effect="light">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="handleEdit(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="7">
              <el-tooltip content="分配角色" placement="top" effect="light">
                <el-button
                  type="warning"
                  icon="el-icon-bank-card"
                  circle
                ></el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="7">
              <el-tooltip content="删除" placement="top" effect="light">
                <el-button type="danger" icon="el-icon-delete" circle>
                </el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 3, 5, 9]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, getCurrentInstance, ref } from '@vue/runtime-core'
//! 引入网络请求方法
import { getuserDataList } from '../../api/userDataList'
import { setMgState } from '../../api/changeMgState'

//! 搜索与添加区

//! 用户列表区
//* 传入请求方式的参数
const queryInfo = reactive<any>({
  //& 搜索关键字
  query: '',
  //& 当前的页数
  pagenum: 1,
  //& 当前每页显示多少条数据
  pagesize: 2,
})
//* 用户信息列表数据
const userlists = reactive<any>({
  userlist: [],
})
const total = ref<number>(0)
//* 获取用户信息列表
const { proxy } = getCurrentInstance() as any
const getuserDataLists = () => {
  getuserDataList(queryInfo.query, queryInfo.pagenum, queryInfo.pagesize).then(
    (res) => {
      if (res.meta.status !== 200)
        return proxy.$message.error('获取用户列表失败')
      userlists.userlist = res.data.users
      total.value = res.data.total
      // console.log(res)
    }
  )
}
onMounted(getuserDataLists)
//* 监听 switch 改变事件
const changeSwitch = (switchInfo: any) => {
  setMgState(switchInfo.id, switchInfo.mg_state).then((res) => {
    if (res.meta.status !== 200) {
      switchInfo.mg_state = !switchInfo.mg_state
      return proxy.$message.error('更新用户状态失败')
    }
    proxy.$message.success('更新用户状态成功')
  })
}
//* 用户数据编辑
const handleEdit = (index: any, row: any) => {
  console.log(index)
}

//! 分页区
//* 监听 pagesize 改变事件
const handleSizeChange = (newSize: any) => {
  queryInfo.pagesize = newSize
  getuserDataLists()
}
//* 监听页码值改变的事件
const handleCurrentChange = (newPage: any) => {
  queryInfo.pagenum = newPage
  getuserDataLists()
}
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
}
.el-pagination {
  margin-top: 10px;
}
</style>
