<template>
    <div class="container" ref="container"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, toRefs } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import { watch } from 'fs'

//! 获取container的ref
const container = ref<any>(null)
const chart = ref<any>(null)
onMounted(() => {
  chart.value = echarts.init(container.value, 'dark')
  chart.value.setOption(props.options)
})
const props = defineProps({
  options: {
    required: true,
    type: Object,
    default: {},
  },
})
const { options } = toRefs<any>(props)
watch(options, (newOptions: any) => {
  chart.value.setOption(newOptions)
})
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}
</style>
