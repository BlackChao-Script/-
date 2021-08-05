<template>
  <el-card>
    <el-button type="info" plain>添加角色</el-button>
    <el-table :data="data.rolesList" border stripe>
      <el-table-column type="expand">
        <template #default="scope">
          <el-row
            :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            v-for="(item1, i1) in scope.row.children"
            :key="item1.id"
          >
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="closeroles(scope.row, item1.id)">{{
                item1.authName
              }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级和三级权限 -->
            <el-col :span="19">
              <!-- 渲染二级权限 -->
              <el-row
                :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                v-for="(item2, i2) in item1.children"
                :key="item2.id"
              >
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="closeroles(scope.row, item2.id)"
                    >{{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染三级权限 -->
                <el-col :span="18">
                  <el-tag
                    type="warning"
                    v-for="(item3, i3) in item2.children"
                    :key="item3.id"
                    closable
                    @close="closeroles(scope.row, item3.id)"
                  >
                    {{ item2.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-row type="flex" justify="center">
            <el-col :span="5">
              <el-tooltip content="编辑" placement="top" effect="light">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                ></el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="5">
              <el-tooltip content="分配角色" placement="top" effect="light">
                <el-button
                  type="warning"
                  icon="el-icon-bank-card"
                  circle
                ></el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="5">
              <el-tooltip content="删除" placement="top" effect="light">
                <el-button type="danger" icon="el-icon-delete" circle>
                </el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { reactive } from '@vue/reactivity'
import { getCurrentInstance, onMounted } from '@vue/runtime-core'
//! 引入网络请求方法
import { getRoles } from '../../../api/power/rolesLists'
import { deleteUserRoles } from '../../../api/power/deleteroles'

//! 数据
const data = reactive({
  //* 角色列表数据
  rolesList: [],
})
//! 请求网络
//* 获取角色列表数据
const { proxy } = getCurrentInstance() as any
const getRolesLis = () => {
  getRoles()
    .then((res: any) => {
      data.rolesList = res.data
    })
    .catch((err: any) => {
      proxy.$message.error('获取角色列表数据失败')
    })
}
//* 在生命周期函数中调用请求方法
onMounted(getRolesLis)
//! 方法
//* 根据id删除用户权限
const closeroles = (role: any, rightId: any) => {
  //? 弹框询问用户是否删除数据
  proxy
    .$confirm('此操作将永久删除该用户权限, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      deleteUserRoles(role.id, rightId)
        .then((res: any) => {
          role.children = res.data
          proxy.$message.success('权限删除成功')
        })
        .catch(() => proxy.$message.error('权限删除失败'))
    })
    .catch(() => proxy.$message.info('已取消删除'))
}
</script>

<style scoped lang="scss">
.el-button {
  margin-bottom: 10px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
