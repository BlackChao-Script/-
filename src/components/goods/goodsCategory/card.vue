<template>
  <!-- 卡片视图区 -->
  <el-card>
    <!-- 添加商品分类按钮 -->
    <el-button type="info" @click="addCategoriesList">添加分类</el-button>
    <!-- 商品分类表格 -->
    <el-table
      :data="data.categoriesList"
      :border="true"
      row-key="cat_id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="分类名称" prop="cat_name"></el-table-column>
      <el-table-column label="是否有效">
        <template #default="scope">
          <i v-if="scope.row.cat_deleted" class="el-icon-error"></i>
          <i v-else class="el-icon-success"></i>
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template #default="scope">
          <!-- 一级排序 -->
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <!-- 二级排序 -->
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <!-- 三级排序 -->
          <el-tag type="warning" v-else-if="scope.row.cat_level === 2"
            >三级</el-tag
          >
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
                  @click="redactCategories(scope.row.cat_id)"
                ></el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="5">
              <el-tooltip content="删除" placement="top" effect="light">
                <el-button
                  type="danger"
                  icon="el-icon-delete-solid"
                  circle
                  @click="removerCategoriesbyId(scope.row.cat_id)"
                ></el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChanges"
      @current-change="handleCurrentChanges"
      :current-page="data.pagenum"
      :page-sizes="[5, 10, 30]"
      :page-size="data.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="data.total"
    >
    </el-pagination>
  </el-card>
  <!-- 添加分类对话框 -->
  <el-dialog
    title="添加分类"
    v-model="data.addcategoriesVisible"
    width="50%"
    @close="resetaddFrom"
  >
    <el-form
      :model="data.addCategoriesList"
      :rules="data.addCategoriesListRules"
      ref="addCategoriesFrom"
    >
      <el-form-item label="分类父ID" prop="cat_pid">
        <el-input
          v-model="data.addCategoriesList.cat_pid"
          placeholder="如果要添加1级分类，则父分类Id应该设置为  `0`"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="data.addCategoriesList.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="分类层级" prop="cat_level">
        <el-input
          v-model="data.addCategoriesList.cat_level"
          placeholder="`0`表示一级分类；`1`表示二级分类；`2`表示三级分类"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.addcategoriesVisible = false">取 消</el-button>
        <el-button type="primary" @click="severAddCategories">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 编辑分类对话框 -->
  <el-dialog
    title="编辑分类"
    v-model="data.redactCategoriesVisible"
    width="50%"
  >
    <el-form :model="data.categoriesIdLists" label-width="100px">
      <el-form-item label="分类ID">
        <el-input v-model="data.categoriesIdLists.cat_pid" disabled></el-input>
      </el-form-item>
      <el-form-item label="分类名称">
        <el-input v-model="data.categoriesIdLists.cat_name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.redactCategoriesVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="severResetCategories"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from '@vue/reactivity'
import { getCurrentInstance, onMounted } from '@vue/runtime-core'

//! 注册全局使用方法
const { proxy } = getCurrentInstance() as any
//! 数据
const data = reactive<any>({
  //* 商品分类列表数据
  categoriesList: [],
  //* 当前页码值
  pagenum: 1,
  //* 每页显示的数据
  pagesize: 5,
  //* 总页数
  total: 0,
  //* 控制添加分类对话框显示/隐藏
  addcategoriesVisible: false,
  //* 添加分类数据
  addCategoriesList: {
    cat_pid: '',
    cat_name: '',
    cat_level: '',
  },
  //* 添加分类表单验证
  addCategoriesListRules: {
    cat_pid: [{ required: true, message: '请输入分类父 ID', trigger: 'blur' }],
    cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
    cat_level: [{ required: true, message: '请输入分类层级', trigger: 'blur' }],
  },
  //* 控制编辑分类对话框显示/隐藏
  redactCategoriesVisible: false,
  //* 根据Id查询到的分类数据
  categoriesIdLists: [],
})
//! 方法
//* 获取添加分类表单的ref
const addCategoriesFrom = ref<any>(null)
//* 当添加分类对话框关闭时调用的事件
const resetaddFrom = () => {
  //* 对整个表单进行重置
  addCategoriesFrom.value.resetFields()
}
//* 点击添加分类按钮事件
const addCategoriesList = () => {
  //* 显示对话框
  data.addcategoriesVisible = true
}
//* 监听 pagesize 改变事件
const handleSizeChanges = (newSize: any) => {
  data.pagesize = newSize
  getCategoriesList()
}
//* 监听页码值改变的事件
const handleCurrentChanges = (newPage: any) => {
  data.pagenum = newPage
  getCategoriesList()
}

//! 网络请求方法
//* 请求商品分类数据列表
const getCategoriesList = () => {
  proxy.$http
    .get(`categories?type=3&pagenum=${data.pagenum}&pagesize=${data.pagesize}`)
    .then((res: any) => {
      //* 把获取到的数据赋值给data.categoriesList
      data.categoriesList = res.data.result
      data.total = res.data.total
    })
}
//* 在生命周期函数中调用
onMounted(getCategoriesList)
//* 点击添加分类对话框里面的确定按钮调用的事件
const severAddCategories = () => {
  //& 验证整个添加分类表单
  addCategoriesFrom.value.validate((val: any) => {
    //? 验证不通过
    if (!val) return
    //? 验证通过
    //* 调用添加分类请求
    proxy.$http
      .post('categories', {
        cat_pid: data.addCategoriesList.cat_pid,
        cat_name: data.addCategoriesList.cat_name,
        cat_level: data.addCategoriesList.cat_level,
      })
      .then(() => {
        //* 关闭添加分类对话框
        data.addcategoriesVisible = false
        //* 重新调用请求分类数据列表
        getCategoriesList()
        proxy.$message.success('添加分类成功')
      })
      .catch(() => proxy.$message.error('添加分类失败'))
  })
}
//* 点击编制按钮触发的事件
const redactCategories = (id: any) => {
  //* 显示编辑分类对话框
  data.redactCategoriesVisible = true
  //* 根据分类Id查询详细数据
  proxy.$http.get(`categories/${id}`).then((res: any) => {
    data.categoriesIdLists = res.data
  })
}
//* 点击编辑分类对话框里面的确定按钮调用的事件
const severResetCategories = () => {
  //* 调用编辑提交分类
  proxy.$http
    .put(`categories/${data.categoriesIdLists.cat_id}`, {
      cat_name: data.categoriesIdLists.cat_name,
    })
    .then(() => {
      //* 关闭编辑用户对话框
      data.redactCategoriesVisible = false
      //* 重新调用请求分类数据列表
      getCategoriesList()
      proxy.$message.success('编辑分类成功')
    })
    .catch(() => proxy.$message.error('编辑分类失败'))
}
//* 点击删除分类按钮调用的事件
const removerCategoriesbyId = (id: any) => {
  //? 弹框询问用户是否删除数据
  proxy
    .$confirm('此操作将永久删除改分类', '是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    //* 点击确定执行
    .then(() => {
      proxy.$http
        .delete(`categories/${id}`)
        .then(() => {
          //* 重新调用请求分类数据列表
          getCategoriesList()
          proxy.$message.success('删除成功')
        })
        .catch(() => proxy.$message.error('删除失败'))
    })
    //* 点击取消执行
    .catch(() => proxy.$message.info('已取消删除'))
}
</script>

<style scoped lang="scss">
.el-button {
  margin-bottom: 10px;
}
.el-icon-success {
  color: green;
  font-size: 20px;
}
.el-icon-error {
  color: red;
  font-size: 20px;
}
</style>
