<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 标题 -->
      <div class="box_title">Login</div>
      <!-- 登录表单 -->
      <div class="login_from">
        <el-form ref="loginFormRef" :model="loginFrom" :rules="loginFromRules">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              v-model="loginFrom.username"
              placeholder="用户名"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="loginFrom.password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <div class="btns">
            <el-form-item>
              <el-button @click="login">登录</el-button>
              <el-button @click="resetLoginForm">重置</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from '@vue/reactivity'
import { getCurrentInstance } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
//! 引入网络请求方法
import { logins } from '../api/login'

//! 定义接口
interface from {
  username: string
  password: number | string
}
interface loginFrom {
  username: Array<object>
  password: Array<object>
}
//! 登录表单的数据绑定对象
const loginFrom = reactive<from>({
  //* 用户名
  username: 'admin',
  //* 密码
  password: '123456',
})
//! 表单验证规则
const loginFromRules = reactive<loginFrom>({
  //* 验证用户名是否合法
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
  ],
  //* 验证密码是否合法
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
  ],
})
//! 获取ref
const loginFormRef = ref<any>(null)
//! 点击重置按钮重置登录表单
const resetLoginForm = () => {
  loginFormRef.value.resetFields()
}
//! 点击登录
const $router = useRouter()
const { proxy } = getCurrentInstance() as any
const login = () => {
  loginFormRef.value.validate((valid: any) => {
    //* 失败执行
    if (!valid) return
    //* 成功执行
    logins(loginFrom.username, loginFrom.password).then((res) => {
      //* 失败执行
      if (res.meta.status != 200) return proxy.$message.error('登录失败')
      //* 成功执行
      proxy.$message.success({
        message: '登录成功',
        type: 'success',
      })
      window.sessionStorage.setItem('token',res.data.token)
      $router.push('/home')
    })
  })
}
</script>

<style scoped lang="scss">
.login_container {
  position: relative;
  height: 100%;
  background: linear-gradient(#141e30, #243b55);
  .login_box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 310px;
    background-color: #0d141f;
    border-radius: 10px;
    box-shadow: 3px 10px 10px rgba(0, 0, 0, 0.5);
    .box_title {
      text-align: center;
      margin-top: 25px;
      color: #fff;
      font-size: 27px;
      font-weight: bold;
    }
    .login_from {
      position: absolute;
      bottom: -5px;
      left: 0;
      right: 0;
      padding: 20px;
      .btns {
        margin-top: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
