<template>
  <!-- 卡片视图数据 -->
  <el-card>
    <!-- 搜索与添加 -->
    <el-row :gutter="20">
      <el-col :span="10">
        <el-input
          placeholder="请输入内容"
          v-model="data.searchgoods"
          :clearable="true"
          @clear="clearablesearch"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="searchgoods"></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="info" plain @click="addGoods">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 商品数据表格 -->
    <el-table :data="data.goodsLists" :border="true" :stripe="true">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="商品名称"
        prop="goods_name"
        width="700"
      ></el-table-column>
      <el-table-column
        label="商品价格(元)"
        prop="goods_price"
      ></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="操作"
        ><template #default="scope">
          <el-row type="flex" justify="space-around">
            <el-col :span="4">
              <el-tooltip content="修改" placement="top" effect="light">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="amendGoods(scope.row.goods_id)"
                ></el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="4">
              <el-tooltip content="删除" placement="top" effect="light">
                <el-button
                  type="danger"
                  icon="el-icon-delete-solid"
                  circle
                  @click="removergoodsbyId(scope.row.goods_id)"
                ></el-button>
              </el-tooltip>
            </el-col>
          </el-row> </template
      ></el-table-column>
    </el-table>
    <!-- 分页区 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="data.pagenum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="data.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="data.total"
    >
    </el-pagination>
  </el-card>
  <!-- 编辑商品对话框 -->
  <el-dialog title="编辑商品" v-model="data.showAmendGoods" width="50%">
    <el-form :model="data.goodsByIdDatd" label-position="top">
      <el-form-item label="商品名称">
        <el-input v-model="data.goodsByIdDatd.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input v-model="data.goodsByIdDatd.goods_price"></el-input>
      </el-form-item>
      <el-form-item label="商品数量">
        <el-input v-model="data.goodsByIdDatd.goods_number"></el-input>
      </el-form-item>
      <el-form-item label="商品重量">
        <el-input v-model="data.goodsByIdDatd.goods_weight"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.showAmendGoods = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive } from '@vue/reactivity'
import { getCurrentInstance, onMounted } from '@vue/runtime-core'
import { useRouter } from 'vue-router'

//! 注册全局方法
const { proxy } = getCurrentInstance() as any
//! 数据
const data = reactive<any>({
  //* 搜索框里面输入的内容
  searchgoods: '',
  //* 商品列表数据
  goodsLists: [],
  //* 当前商品列表的页码
  pagenum: 1,
  //* 商品列表数据每页显示的条数
  pagesize: 10,
  //* 总共的商品列表数据数量
  total: 0,
  //* 根据Id查询到的商品数据
  goodsByIdDatd: [],
  //* 控制编制商品对话框的显示与隐藏
  showAmendGoods: false,
})
//! 方法
//* 请求商品列表数据
const getgoodsLists = () => {
  proxy.$http
    .get(
      `goods?query=${data.searchgoods}&pagenum=${data.pagenum}&pagesize=${data.pagesize}`
    )
    .then((res: any) => {
      data.goodsLists = res.data.goods
      data.total = res.data.total
    })
}
//* 在生命周期函数中调用
onMounted(getgoodsLists)
//* 监听 pagesize 改变事件
const handleSizeChange = (newSize: any) => {
  data.pagesize = newSize
  getgoodsLists()
}
//* 监听页码值改变的事件
const handleCurrentChange = (newPage: any) => {
  data.pagenum = newPage
  getgoodsLists()
}
//* 点击搜索时调用的事件
const searchgoods = () => {
  getgoodsLists()
}
//* 点击输入框中的清除时调用的事件
const clearablesearch = () => {
  data.searchgoods = ''
  getgoodsLists()
}
//* 注册路由
const $router = useRouter()
//* 点击添加商品时调用事件
const addGoods = () => {
  //* 跳转到添加商品页面
  $router.push('/home/addgoods')
}
//* 点击编辑时得到事件
const amendGoods = (id: any) => {
  //* 显示编辑商品对话框
  data.showAmendGoods = true
  //* 根据id查询商品
  proxy.$http.get(`goods/${id}`).then((res: any) => {
    data.goodsByIdDatd = res.data
  })
}
//* 点击对话框里面的确定的事件
const submitData = () => {
  //* 提交编辑商品信息
  proxy.$http
    .put(`goods/${data.goodsByIdDatd.goods_id}`, data.goodsByIdDatd)
    .then(() => {
      //* 关闭编辑商品对话框
      data.showAmendGoods = false
      proxy.$message.success('编辑商品成功')
      //* 重新请求商品数据列表
      getgoodsLists()
    })
    .catch(() => proxy.$message.error('编辑商品失败'))
}
//* 点击删除时的事件(通过Id)
const removergoodsbyId = (id: any) => {
  //? 弹框询问用户是否删除数据
  proxy
    .$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      proxy.$http
        .delete(`goods/${id}`)
        .then(() => {
          proxy.$message.success('删除商品成功')
          //* 重新请求商品数据列表
          getgoodsLists()
        })
        .catch(() => proxy.$message.error('删除商品失败'))
    })
    .catch(() => proxy.$message.error('以取消删除此商品'))
}
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
}
</style>
