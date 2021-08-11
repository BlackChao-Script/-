<template>
  <!-- 卡片视图 -->
  <el-card>
    <!-- 提示信息 -->
    <el-alert
      title="添加商品信息"
      type="info"
      :closable="false"
      center
      show-icon
    >
    </el-alert>
    <!-- 步骤条 -->
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <el-steps :active="data.active" finish-status="success">
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <!-- 信息标签 -->
    <el-form
      :model="data.addForm"
      :rules="data.addrules"
      ref="addForm"
      label-position="top"
    >
      <el-tabs tab-position="left" :before-leave="beforeTabLeave">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="data.addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="data.addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="data.addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="data.addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="data.addForm.goods_cat"
              :options="data.optionsdata"
              :props="data.props"
              @change="changeCascaderdata"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <h3 class="tabPaneH3">{{ data.goodsAttributesName }}</h3>
          <el-tag
            v-for="item in data.goodsAttributes_vals"
            :key="item"
            :closable="true"
            >{{ item }}</el-tag
          >
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item
            :label="item.attr_name"
            v-for="item in data.goodspropertys"
            :key="item.attr_id"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            :action="data.uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture"
            :headers="data.headerObj"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 商品介绍输入框 -->
          <el-input
            v-model="data.addForm.goods_introduce"
            type="textarea"
            placeholder="请输入商品介绍信息"
            :show-word-limit="true"
            rows="10"
          ></el-input>
          <!-- 完成添加商品 -->
          <el-button type="info" class="addButton" @click="addGoods"
            >添加商品</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
  <!-- 预览图片对话框 -->
  <el-dialog title="图片预览" v-model="data.showPic" width="50%">
    <img :src="data.picurl" class="pic" />
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from '@vue/reactivity'
import { getCurrentInstance, onMounted } from '@vue/runtime-core'
import { useRouter } from 'vue-router'

//! 注册全局方法
const { proxy } = getCurrentInstance() as any
//! 数据
const data = reactive<any>({
  //* 当前激活步骤
  active: 0,
  //* 添加表单基本信息的数据
  addForm: {
    //* 商品名称
    goods_name: '',
    //* 商品价格
    goods_price: '',
    //* 商品重量
    goods_weight: '',
    //* 商品数量
    goods_number: '',
    //* 上传成功的图片数据
    pics: [],
    //* 商品分类
    goods_cat: [],
    //* 商品介绍
    goods_introduce: '',
    //* 商品参数
    attrs: [],
  },
  //* 添加表单的验证规则
  addrules: {
    goods_name: [
      { required: true, message: '请输入商品名称', trigger: 'blur' },
    ],
    goods_price: [
      { required: true, message: '请输入商品价格', trigger: 'blur' },
    ],
    goods_weight: [
      { required: true, message: '请输入商品重量', trigger: 'blur' },
    ],
    goods_number: [
      { required: true, message: '请输入商品数量', trigger: 'blur' },
    ],
  },
  //* 选中的商品分类数据Id
  cascaderdata: [],
  //* 商品分类数据
  optionsdata: [],
  //* 商品分类props参数
  props: {
    value: 'cat_id',
    label: 'cat_name',
    children: 'children',
    expandTrigger: 'hover',
  },
  //* 商品参数
  goodsAttributes: [],
  //* 展示的商品参数
  goodsAttributes_vals: [],
  //* 参数名称
  goodsAttributesName: '',
  //* 商品属性
  goodspropertys: [],
  //* 图片上传地址
  uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
  //* 图片上传的请求头
  headerObj: {
    Authorization: window.sessionStorage.getItem('token'),
  },
  //* 控制预览图片对话框的显示与隐藏
  showPic: false,
  //* 预览图片效果的url
  picurl: '',
})
//! 方法
//* 请求商品分类的数据
const getGoodsCategory = () => {
  proxy.$http
    .get(`categories?type=3`)
    .then((res: any) => {
      data.optionsdata = res.data
    })
    .catch(() => proxy.$message.error('商品分类数据获取失败'))
}
//* 在生命周期函数中调用
onMounted(getGoodsCategory)
//* 切换tabs之前调用的事件
const beforeTabLeave = (activeName: any, oldActiveName: any) => {
  if (oldActiveName == '0' && data.addForm.goods_cat.length !== 3) {
    proxy.$message.error('请先选择商品分类')
    return false
  }
  data.active = parseInt(activeName)
}
//* 选中分类商品数据时调用的事件
const changeCascaderdata = () => {
  if (data.addForm.goods_cat.length !== 3) {
    data.addForm.goods_cat = ''
  }
  //* 请求商品参数
  proxy.$http
    .get(`categories/${data.addForm.goods_cat[2]}/attributes?sel=many`)
    .then((res: any) => {
      data.goodsAttributes = res.data
      data.goodsAttributes_vals = res.data[0].attr_vals.split(',')
      data.goodsAttributesName = res.data[0].attr_name
    })
    .catch(() => proxy.$message.error('商品参数获取失败'))
  //* 请求商品属性
  proxy.$http
    .get(`categories/${data.addForm.goods_cat[2]}/attributes?sel=only`)
    .then((res: any) => {
      data.goodspropertys = res.data
    })
    .catch(() => proxy.$message.error('商品属性获取失败'))
}
//* 处理图片预览效果的事件
const handlePreview = (file: any) => {
  //* 显示图片预览对话框
  data.showPic = true
  data.picurl = file.response.data.url
}
//* 处理移除图片的事件
const handleRemove = (file: any) => {
  const filePath = file.response.data.tmp_path
  const i = data.addForm.pics.findIndex((v: any) => v.pic === filePath)
  data.addForm.pics.splice(i, 1)
}
//* 上传图片成功的事件
const handleSuccess = (res: any) => {
  const picInof = {
    pic: res.data.tmp_path,
  }
  data.addForm.pics.push(picInof)
}
//* 获取addForm的ref
const addForm = ref<any>(null)
//* 注册路由
const $router = useRouter()
//* 点击添加商品时的事件
const addGoods = () => {
  addForm.value.validate((valid: any) => {
    if (!valid) return proxy.$message.error('请填写必要的表单项')
    data.addForm.goods_cat = data.addForm.goods_cat.join(',')
    // //* 处理动态参数
    data.goodsAttributes.forEach((item: any) => {
      const newInfo = {
        attr_id: item.attr_id,
        attr_value: item.attr_vals,
      }
      data.addForm.attrs.push(newInfo)
    })
    // //* 处理静态属性
    data.goodspropertys.forEach((item: any) => {
      const newInfo = {
        attr_id: item.attr_id,
        attr_value: item.attr_vals,
      }
      data.addForm.attrs.push(newInfo)
    })
    //* 请求添加商品方法
    proxy.$http
      .post('goods', data.addForm)
      .then(() => {
        proxy.$message.success('添加商品成功')
        $router.push('/home/goods')
      })
      .catch(() => proxy.$message.error('添加商品失败'))
  })
}
</script>

<style scoped lang="scss">
.el-alert {
  margin-bottom: 30px;
}
.el-row {
  margin-bottom: 30px;
}
.el-tag {
  margin: 20px;
  margin-top: 30px;
}
.tabPaneH3 {
  font-weight: normal;
  margin-left: 20px;
}
.pic {
  width: 100%;
}
.addButton {
  margin-top: 20px;
}
</style>
