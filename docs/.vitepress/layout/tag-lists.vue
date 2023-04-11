<script setup lang="ts">
import Tag from './tag.vue'
import { useList } from '../utils/business'
const { tags } = useList()
</script>
<template>
  <div class="common-piece tag-list">
    <Tag
      v-for="(item, index) in tags.data"
      :key="index"
      class="tag-list-piece"
      :color="item.color"
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
