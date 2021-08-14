<template>
  <!-- 卡片视图 -->
  <el-card>
    <!-- 搜索框 -->
    <el-row>
      <el-col :span="10">
        <el-input v-model="data.searchDate" placeholder="请输入内容">
          <template #append>
            <el-button
              icon="el-icon-search"
              @click="getOrderDataList"
            ></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <!-- 订单数据列表 -->
    <el-table :data="data.ordersDataList" :border="true">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="订单编号"
        width="600px"
        prop="order_number"
      ></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款">
        <template #default="scope">
          <el-tag v-if="scope.row.pay_status === '0'" type="danger"
            >未付款</el-tag
          >
          <el-tag v-else type="success">已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-row type="flex" justify="space-around">
            <el-col :span="5">
              <el-tooltip content="修改订单地址" placement="top" effect="light">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="changeOrdersSite"
                ></el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="5">
              <el-tooltip content="物流进度" placement="top" effect="light">
                <el-button
                  type="success"
                  icon="el-icon-location-outline"
                  circle
                  @click="Clicklogistics"
                ></el-button>
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
      :current-page="data.pagenum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="data.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="data.total"
    >
    </el-pagination>
  </el-card>
  <!-- 修改订单地址对话框 -->
  <el-dialog
    title="修改地址"
    v-model="data.showOrdersSite"
    width="50%"
    @close="ClosedDialog"
  >
    <el-form
      :model="data.alterOrderForm"
      :role="data.alterOrderFormRole"
      ref="alterOrderFormRef"
      label-width="100px"
    >
      <el-form-item label="省市区/县" prop="probablySite">
        <el-cascader
          :options="city_data"
          v-model="data.alterOrderForm.probablySite"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="particularSite">
        <el-input v-model="data.alterOrderForm.particularSite"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="data.showOrdersSite = false">取 消</el-button>
        <el-button type="primary" @click="data.showOrdersSite = false"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
  <!-- 物流进度对话框 -->
  <el-dialog title="物流进度" v-model="data.showLogistics" width="50%">
    <el-timeline>
      <el-timeline-item
        v-for="item in data.LogisticsData"
        :timestamp="item.time"
        placement="top"
      >
        <el-card>
          <h4>{{ item.context }}</h4>
          <p>{{ item.ftime }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </el-dialog>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, reactive, ref } from '@vue/runtime-core'
import city_data from './city_data'
import LogisticsData from './losistcsdata'
//! 注册全局方法
const { proxy } = getCurrentInstance() as any
//! 数据
const data = reactive({
  //* 搜索值的数据
  searchDate: '',
  //* 订单列表数据
  ordersDataList: [],
  //* 当前订单列表的页码
  pagenum: 1,
  //* 订单列表的每页显示条数
  pagesize: 10,
  //* 订单的总条数
  total: 0,
  //* 修改订单地址的对话框的显示与隐藏
  showOrdersSite: false,
  //* 修改订单表单的数据
  alterOrderForm: {
    probablySite: [],
    particularSite: '',
  },
  //* 修改订单表单的表单验证
  alterOrderFormRole: {
    probablySite: [
      { required: true, message: '请选择省市区县', trigger: 'blur' },
    ],
    particularSite: [
      { required: true, message: '请输入详细地址', trigger: 'blur' },
    ],
  },
  //* 地区地址数据
  city_data,
  //* 物流进度对话框的显示与隐藏
  showLogistics: false,
  //* 物流信息
  LogisticsData,
})
//! 方法
//* 请求订单列表数据
const getOrderDataList = () => {
  proxy.$http
    .get(
      `orders?query=${data.searchDate}&pagenum=${data.pagenum}&pagesize=${data.pagesize}`
    )
    .then((res: any) => {
      data.ordersDataList = res.data.goods
      data.total = res.data.total
    })
    .catch(() => proxy.$message.error('获取订单列表数据失败'))
}
//* 在生命周期函数中调用
onMounted(getOrderDataList)
//* 监听 pagesize 改变事件
const handleSizeChange = (newSize: any) => {
  data.pagesize = newSize
  getOrderDataList()
}
//* 监听页码值改变的事件
const handleCurrentChange = (newPage: any) => {
  data.pagenum = newPage
  getOrderDataList()
}
//* 点击修改订单地址的事件
const changeOrdersSite = () => {
  //* 显示修改订单地址的对话框
  data.showOrdersSite = true
}
//* 关闭修改订单对话框时调用的事件
//* 获取alterOrderFormRole的ref
const alterOrderFormRef = ref<any>(null)
const ClosedDialog = () => {
  alterOrderFormRef.value.resetFields()
}
//* 点击物流信息的事件
const Clicklogistics = () => {
  //* 显示物流信息对话框
  data.showLogistics = true
}
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
}
</style>
