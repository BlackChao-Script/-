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
        <el-button type="info" plain @click="dialogVisible = true"
          >添加用户</el-button
        >
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
          <el-row type="flex" justify="space-around">
            <el-col :span="5">
              <el-tooltip content="编辑" placement="top" effect="light">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="handleEdit(scope.$index, scope.row)"
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
                  @click="removerUserbyId(scope.row.id)"
                >
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
  <!-- 添加用户的对话框 -->
  <el-dialog
    title="添加用户"
    v-model="dialogVisible"
    width="50%"
    @close="resetAddForm"
  >
    <!-- 内容主体区 -->
    <el-form
      ref="addForm"
      :model="Froms.addFrom"
      :rules="Froms.addFormRules"
      label-width="70px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="Froms.addFrom.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="Froms.addFrom.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="Froms.addFrom.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="Froms.addFrom.phonenumber"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定 </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 编辑用户对话框 -->
  <el-dialog
    title="修改用户信息"
    v-model="dialogVisiblea"
    width="50%"
    @close="resetAddForma"
  >
    <!-- 内容主体区 -->
    <el-form
      ref="alterForm"
      :model="Fromsa.alterFroms"
      :rules="Fromsa.alterRules"
      label-width="70px"
    >
      <el-form-item label="用户名">
        <el-input
          v-model="Fromsa.alterFroms.username"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="Fromsa.alterFroms.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="Fromsa.alterFroms.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisiblea = false">取 消</el-button>
        <el-button type="primary" @click="alterUser">确 定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { onMounted, reactive, getCurrentInstance, ref } from '@vue/runtime-core'
//! 注册全局方法
const { proxy } = getCurrentInstance() as any
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

const getuserDataLists = () => {
  proxy.$http
    .get(
      `users?query=${queryInfo.query}&pagenum=${queryInfo.pagenum}&pagesize=${queryInfo.pagesize}`
    )
    .then((res: any) => {
      userlists.userlist = res.data.users
      total.value = res.data.total
    })
    .catch(() => proxy.$message.error('获取用户列表失败'))
}
onMounted(getuserDataLists)
//* 监听 switch 改变事件
const changeSwitch = (switchInfo: any) => {
  proxy.$http
    .put(`users/${switchInfo.id}/state/${switchInfo.mg_state}`)
    .then((res: any) => {
      if (res.meta.status !== 200) {
        switchInfo.mg_state = !switchInfo.mg_state
        return proxy.$message.error('更新用户状态失败')
      }
      proxy.$message.success('更新用户状态成功')
    })
}
//* 根据id删除用户数据
const removerUserbyId = (id: number) => {
  //? 弹框询问用户是否删除数据
  proxy
    .$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      proxy.$http.delete(`/users/${id}`).then((res: any) => {
        if (res.meta.status !== 200) {
          return proxy.$message.error('删除失败')
        }
        proxy.$message.success('删除成功')
        getuserDataLists()
      })
    })
    .catch(() => proxy.$message.info('已取消删除'))
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

//! 添加用户对话框
//* 控制添加用户对话框的显示与隐藏
const dialogVisible = ref<boolean>(false)
//* 监听添加用户对话框的关闭事件(重置添加表单)
const addForm = ref<any>(null)
const resetAddForm = () => {
  addForm.value.resetFields()
}
//* 点击按钮,添加新用户
const addUser = () => {
  addForm.value.validate((valid: any) => {
    //& 执行失败
    if (!valid) return
    //& 发起网络请求添加新用户
    proxy.$http
      .post('users', {
        username: Froms.addFrom.username,
        password: Froms.addFrom.password,
        email: Froms.addFrom.email,
        mobile: Froms.addFrom.mobile,
      })
      .then((res: any) => {
        proxy.$message.success({
          message: '添加成功',
          type: 'success',
        })
        //& 隐藏添加用户的对话框
        dialogVisible.value = false
        //& 重新获取用户数据
        getuserDataLists()
      })
      .catch(() => proxy.$message.error('添加失败'))
  })
}
//* 自定义表单验证规则
const validatePhone = reactive<any>({
  validatePhonenumber: (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入密码'))
    } else if (!/^1\d{10}$/.test(value)) {
      callback(new Error('手机号格式错误'))
    } else {
      callback()
    }
  },
})
//* 用户表单数据
const Froms = reactive<any>({
  //& 添加用户表单数据
  addFrom: {
    username: '',
    password: '',
    email: '',
    mobile: '',
  },
  //& 添加表单的验证规则对象
  addFormRules: {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      {
        min: 3,
        max: 10,
        message: '用户名的长度在3~10个字符之间',
        trigger: 'blur',
      },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      {
        type: 'email',
        message: '请输入正确的邮箱地址',
        trigger: ['blur', 'change'],
      },
    ],
    phonenumber: [
      { validator: validatePhone.validatePhonenumber, trigger: 'blur' },
    ],
  },
})

//! 编辑用户信息对话框
//* 控制添加用户对话框的显示与隐藏
const dialogVisiblea = ref<boolean>(false)
//* 监听添加用户对话框的关闭事件(重置添加表单)
const alterForm = ref<any>(null)
const resetAddForma = () => {
  alterForm.value.resetFields()
}
//* 编辑用户数据
const Fromsa = reactive<any>({
  alterFroms: {},
  alterRules: {
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      {
        type: 'email',
        message: '请输入正确的邮箱地址',
        trigger: ['blur', 'change'],
      },
    ],
    mobile: [{ validator: validatePhone.validatePhonenumber, trigger: 'blur' }],
  },
})
//* 根据id请求用户数据
const handleEdit = (index: any, row: any) => {
  dialogVisiblea.value = true
  proxy.$http.get(`/users/${row.id}`).then((res: any) => {
    Fromsa.alterFroms = res.data
  })
}
//* 点击按钮修改用户信息
const alterUser = () => {
  alterForm.value.validate((valid: any) => {
    if (!valid) return
    proxy.$http
      .put('users/' + Fromsa.alterFroms.id, {
        email: Fromsa.alterFroms.email,
        mobile: Fromsa.alterFroms.mobile,
      })
      .then((res: any) => {
        if (res.meta.status !== 200) {
          return proxy.$message.error('修改用户信息失败')
        }
        proxy.$message.success({
          message: '修改成功',
          type: 'success',
        })
        //& 隐藏添加用户的对话框
        dialogVisiblea.value = false
        //& 重新获取用户数据
        getuserDataLists()
      })
  })
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
