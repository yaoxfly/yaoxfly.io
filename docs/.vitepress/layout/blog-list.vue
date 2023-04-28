
<script setup lang="ts">
import Card from './card.vue'
import { onMounted, onUnmounted, ref, computed, toRefs, watch } from 'vue'
import { useRouter, withBase } from 'vitepress'
import { List } from '@/utils/type'
interface Props {
  lists:List[]
}
const props = defineProps<Props>()
const { lists } = toRefs(props)
let list:List[] = []
let total = list.length

const loadPageData = () => {
  const paging = (page = 1) => {
  interface Data {
  title?: string
  content?: string,
  time?: string
  tag?: string
  path?: string
}
  const data = ref<Array<Data>>([])
  const currentPage = ref(page)
  const pageSize = 4
  const startPage = computed(() => (currentPage.value - 1) * pageSize)
  const endPage = computed(() => currentPage.value * pageSize > total ? total : currentPage.value * pageSize)
  const totalPage = Math.ceil(total / pageSize)
  const loading = ref(false)
  return { data, currentPage, pageSize, startPage, endPage, totalPage, loading }
  }
  const { data, currentPage, startPage, endPage, totalPage, loading } = paging()
  const loadData = () => {
    if (data.value.length === total) {
      loading.value = true
      currentPage.value = totalPage
      return
    }
    for (let index = startPage.value; index < endPage.value; index++) {
      const element = list[index]
      data.value.push(element)
    }
    currentPage.value++
  }
  return { loadData, data, currentPage, startPage, endPage, totalPage, loading }
}
const { loadData, data, currentPage, loading } = loadPageData() || {}

/* ----刷新card子组件------ */
const cardReload = ref(1)
const reloadCard = () => {
  cardReload.value++
}

/* ----监听内部有操作值，那么监听必须放在方法和值定义之后------ */
watch(lists, (res) => {
  list = res
  list.sort((a, b) => a.time < b.time ? 1 : -1)
  data.value = []
  total = list.length
  currentPage.value = 1
  loadData()
  reloadCard()
}, { immediate: true })

/*
-----scrollHeight、clientHeight 在DTD已声明的情况下用documentElement，未声明的情况下用body,
不同浏览器body.scrollTop或documentElement.scrollTop总有一个为0-----
*/

// 滚动条在Y轴上的滚动距离
const getScrollTop = () => {
  return document.body.scrollTop + document.documentElement.scrollTop
}

// 浏览器可视部分高度
const getWindowHeight = () => {
  return document.compatMode === 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight
}

// 文档的总高度
const getScrollHeight = () => {
  return document.compatMode === 'CSS1Compat' ? document.documentElement.scrollHeight : document.body.scrollHeight
}

let timer: ReturnType<typeof setTimeout> | null = null
const debounce = (fn: () => void, delay: number, isImmediate = false) => {
  timer && clearTimeout(timer)
  if (isImmediate && timer === null) {
    fn()
    timer = null
    return
  }
  timer = setTimeout(() => {
    fn()
    timer = null
  }, delay)
}

const handleScroll = () => {
  const relative = 100 // 相对距离
  if (getScrollTop() + getWindowHeight() >= getScrollHeight() - relative) {
    debounce(loadData, 500)
  }
}
const { go } = useRouter() // 不能写函数里
const jump = (path?: string) => {
  go(withBase(`${path}`))
}

const init = () => {
  window.addEventListener('scroll', handleScroll)
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

<template>
  <div class="blog-list">
    <Card
      v-for="(item, index) in data"
      :key="`card-${index}${cardReload}`"
      :title="item.title"
      :content="item.content"
      :time="item.time"
      :tag="item.tag"
      @click="jump(item.path)"
    />

    <div
      v-show="loading"
      class="blog-list__bottom-text"
    >
      <span v-show="data.length>4">我也是有底线的~</span>
    </div>
  </div>
</template>

<style lang="scss">
.blog-list {
  .card {
    &:not(:first-child) {
      margin-top: 20px;
    }
  }

  @media (max-width: 768px) {
    .card {
      margin-top: 20px;
    }
  }

  &__bottom-text {
    text-align: center;
    padding-top: 20px;
  }
}
</style>
