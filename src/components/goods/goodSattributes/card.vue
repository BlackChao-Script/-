<template>
  <!-- 卡片视图 -->
  <el-card>
    <!-- 警告消息区 -->
    <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      show-icon
      :closable="false"
    >
    </el-alert>
    <!-- 选择商品分类区 -->
    <div class="cascader">
      <span>选择商品分类:&nbsp&nbsp&nbsp</span>
      <el-cascader
        v-model="data.cascaderdata"
        :options="data.optionsdata"
        :props="data.props"
        @change="changeCascaderdata"
      ></el-cascader>
    </div>
    <!-- 标签页区 -->
    <el-tabs v-model="data.activeName" @tab-click="changeSel">
      <!-- 动态参数 -->
      <el-tab-pane label="动态参数" name="dynamic">
        <!-- 添加参数 -->
        <el-button type="info" :disabled="isBtnDisabled" @click="addCategories"
          >添加参数</el-button
        >
        <!-- 动态参数数据表格 -->
        <el-table :border="true" :data="data.categoriesAttributesList">
          <el-table-column type="expand">
            <template #default="scope">
              <el-tag
                v-for="item in scope.row.attr_vals.split(',')"
                closable
                :disable-transitions="false"
                :key="item"
                @close="handleClose(item)"
              >
                {{ item }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-row type="flex" justify="start">
                <el-col :span="4">
                  <el-tooltip content="修改" placement="top" effect="light">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      circle
                    ></el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="4">
                  <el-tooltip content="删除" placement="top" effect="light">
                    <el-button
                      type="danger"
                      icon="el-icon-delete-solid"
                      circle
                    ></el-button>
                  </el-tooltip>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 静态属性 -->
      <el-tab-pane label="静态属性" name="static">
        <!-- 添加属性 -->
        <el-button type="info" :disabled="isBtnDisabled">添加属性</el-button>
        <!-- 静态参数数据表格 -->
        <el-table :border="true" :data="data.categoriesAttributesList">
          <el-table-column type="expand">
            <template #default="scope">
              <el-tag
                v-for="item in scope.row.attr_vals.split(',')"
                closable
                :disable-transitions="false"
                :key="item"
                @close="handleClose(item)"
              >
                {{ item }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column type="index"> </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-row type="flex" justify="start">
                <el-col :span="4">
                  <el-tooltip content="修改" placement="top" effect="light">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      circle
                    ></el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="4">
                  <el-tooltip content="删除" placement="top" effect="light">
                    <el-button
                      type="danger"
                      icon="el-icon-delete-solid"
                      circle
                    ></el-button>
                  </el-tooltip>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup lang="ts">
import { reactive } from '@vue/reactivity'
import { computed, getCurrentInstance, onMounted } from '@vue/runtime-core'
//! 注册全局使用方法
const { proxy } = getCurrentInstance() as any
//! 数据
const data = reactive<any>({
  //* 选中的值
  cascaderdata: [],
  //* 选择分类数据
  optionsdata: [],
  //* 选择商品分类区props参数
  props: {
    value: 'cat_id',
    label: 'cat_name',
    children: 'children',
    expandTrigger: 'hover',
  },
  //* 标签页选中的值
  activeName: 'dynamic',
  //* 分类参数列表数据
  categoriesAttributesList: [],
  //* 用来判断是静态属性还是动态属性
  sel: 'many',
})
//! 方法

//* 点击关闭标签调用的事件
const handleClose = (item: any) => {
  console.log(item)
}
//! 计算属性
//* 如果按钮需要被禁用,则返回true，否则返回false
const isBtnDisabled = computed(() => {
  if (data.cascaderdata.length !== 3) {
    return true
  }
  return false
})
//! 网络请求
//* 请求商品分类的数据
const getGoodsCategory = () => {
  proxy.$http.get(`categories?type=3`).then((res: any) => {
    data.optionsdata = res.data
  })
}
//* 在生命周期中调用
onMounted(getGoodsCategory)
//* 选择框选中的值变化时调用的事件
const changeCascaderdata = () => {
  if (data.cascaderdata.length !== 3) {
    data.cascaderdata = ''
  }
  //* 请求分类参数列表
  proxy.$http
    .get(`categories/${data.cascaderdata[2]}/attributes?sel=${data.sel}`)
    .then((res: any) => {
      data.categoriesAttributesList = res.data
      console.log(data.categoriesAttributesList)
    })
    .catch(() => {
      proxy.$message.error('获取参数失败')
    })
}
//* 切换tab栏调用的事件
const changeSel = () => {
  if (data.sel === 'many') {
    data.sel = 'only'
  } else if (data.sel === 'only') {
    data.sel = 'many'
  }
  changeCascaderdata()
}
//* 点击添加参数时调用的事件
const addCategories = () => {
  console.log(data.cascaderdata[2])
}
const
</script>

<style scoped lang="scss">
.el-alert {
  margin-bottom: 20px;
}
.cascader {
  margin-bottom: 20px;
}
.el-button {
  margin-bottom: 15px;
}
.el-tag {
  margin-left: 5px;
}
</style>
