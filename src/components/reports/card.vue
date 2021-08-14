<template>
  <el-card>
    <div class="container" ref="container"></div>
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { reactive, ref } from '@vue/reactivity'
import { getCurrentInstance, onMounted } from '@vue/runtime-core'

const { proxy } = getCurrentInstance() as any
//! 获取container的ref
const container = ref<any>(null)
const chart = ref<any>(null)
const data = reactive<any>({
  options: {
    title: {
      text: '用户来源',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#E9EEF3',
        },
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        boundaryGap: false,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
  },
})
onMounted(() => {
  chart.value = echarts.init(container.value)
  proxy.$http
    .get('reports/type/1')
    .then((res: any) => {
      const result = { ...data.options, ...res.data }
      chart.value.setOption(result)
    })
    .catch(() => proxy.$message.error('获取数据失败'))
})
</script>

<style scoped lang="scss">
.container {
  width: 1500px;
  height: 600px;
}
</style>
