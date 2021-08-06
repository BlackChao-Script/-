<template>
  <!-- 卡片数据区-->
  <el-card>
    <el-button type="info" plain @click="data.dialogVisible = true"
      >添加角色</el-button
    >
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
                  @click="revealCompileRole(scope.row)"
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
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="deleteRole(scope.row.id)"
                >
                </el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 点击添加角色区 -->
  <el-dialog
    title="添加用户"
    v-model="data.dialogVisible"
    width="50%"
    @close="resetUser"
  >
    <!-- 内容主体区 -->
    <el-form
      ref="ruleForm"
      :model="data.addRoleList"
      :rules="data.addUserRules"
      label-width="90px"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="data.addRoleList.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="data.addRoleList.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alterRole">确 定 </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 点击编辑角色区 -->
  <el-dialog
    title="编辑用户"
    v-model="data.dialogVisiblea"
    width="50%"
    @close="resetUsera"
  >
    <!-- 内容主体区 -->
    <el-form
      ref="revealCompileRuleForm"
      :model="data.revealCompile"
      :rules="data.addUserRules"
      label-width="90px"
    >
      <el-form-item label="角色ID">
        <el-input v-model="data.revealCompile.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="data.revealCompile.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="data.revealCompile.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.dialogVisiblea = false">取 消</el-button>
        <el-button type="primary" @click="revealRole">确 定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, reactive } from '@vue/runtime-core'
//! 注册全局方法
const { proxy } = getCurrentInstance() as any
//! 数据
const data = reactive<any>({
  //* 角色列表数据
  rolesList: [],
  //* 控制添加用户对话框的显示与隐藏
  dialogVisible: false,
  //* 控制编辑用户对话框的显示与隐藏
  dialogVisiblea: false,
  //* 添加角色数据
  addRoleList: {
    roleName: '',
    roleDesc: '',
  },
  //* 编辑用户数据
  revealCompile: [],
  //* 添加表单的验证规则对象
  addUserRules: {
    roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
  },
})
//* 监听添加角色对话框的关闭事件(显示和隐藏)
const ruleForm = ref<any>(null)
const resetUser = () => {
  ruleForm.value.resetFields()
}
//! 请求网络方法
//* 获取角色列表数据
const getRolesLis = () => {
  proxy.$http
    .get('roles')
    .then((res: any) => {
      data.rolesList = res.data
    })
    .catch(() => proxy.$message.error('获取角色列表数据失败'))
}
//* 点击确定添加角色
const alterRole = () => {
  ruleForm.value.validate((valid: any) => {
    if (!valid) return
    proxy.$http
      .post('roles', {
        roleName: data.addRoleList.roleName,
        roleDesc: data.addRoleList.roleDesc,
      })
      .then(() => {
        proxy.$message.success('添加角色成功')
        data.dialogVisible = false
        getRolesLis()
      })
      .catch(() => proxy.$message.warning('添加角色失败'))
  })
}
//* 监听添加角色对话框的关闭事件(显示和隐藏)
const revealCompileRuleForm = ref<any>(null)
const resetUsera = () => {
  revealCompileRuleForm.value.resetFields()
}
//* 根据id点击编辑角色弹出编辑框并查询角色信息
const revealCompileRole = (row: any) => {
  //& 显示编辑角色对话框
  data.dialogVisiblea = true
  proxy.$http.get(`roles/${row.id}`).then((res: any) => {
    data.revealCompile = res.data
  })
}
//* 点击确定完成编辑角色信息
const revealRole = () => {
  revealCompileRuleForm.value.validate((valid: any) => {
    if (!valid) return
    proxy.$http
      .put('roles/' + data.revealCompile.id, {
        roleName: data.revealCompile.roleName,
        roleDesc: data.revealCompile.roleDesc,
      })
      .then(() => {
        proxy.$message.success('编辑角色成功')
        data.dialogVisiblea = false
        getRolesLis()
      })
      .catch(() => proxy.$message.error('编辑角色失败'))
  })
}
//* 根据id点击删除角色删除角色数据
const deleteRole = (id: any) => {
  //? 弹框询问用户是否删除数据
  proxy
    .$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      proxy.$http
        .delete(`/roles/${id}`)
        .then(() => {
          proxy.$message.success('删除成功')
          getRolesLis()
        })
        .catch(() => proxy.$message.error('删除失败'))
    })
    .catch(() => proxy.$message.info('已取消删除'))
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
      proxy.$http
        .delete(`roles/${role.id}/rights/${rightId}`)
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
