<script setup lang="ts">
import Tag from './tag.vue'
import { useList } from '@/utils/business'
const emit = defineEmits(['classification'])
const { tags, list } = useList()
const classification = (tag:string) => {
  const lists = list.filter(item => item.tag === tag)
  emit('classification', { tag, lists })
}
</script>
<template>
  <div class="common-piece tag-list">
    <Tag
      v-for="(item, index) in tags.data"
      :key="index"
      class="tag-list-piece"
      :color="item.color"
      @click="classification(item.tag)"
    >
      {{ item.tag }}
    </Tag>
  </div>
</template>

<style lang="scss">
.tag-list {
  padding: 8px 0 16px 20px  ;
  margin-top: 20px;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  line-height: 16px;
  &-piece {
    margin-right: 12px;
    margin-top: 8px;
  }
}
</style>
