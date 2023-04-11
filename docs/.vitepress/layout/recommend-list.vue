<script setup lang="ts">
import { list } from '@/utils/business'
import { useRouter, withBase } from 'vitepress'
const card = list.filter(item => item.recommend)
card.sort((a, b) => a.recommend && b.recommend && (a.recommend > b.recommend) ? 1 : -1)
const { go } = useRouter()
const jump = (path?: string) => {
  go(withBase(`${path}`))
}

</script>

<template>
  <div class="recommend-list  common-piece">
    <div
      v-for="(item, index) in card"
      :key="`card${index}`"
      class="recommend-list__card"
      @click="jump(item.path)"
    >
      <p
        class="recommend-list__number"
        :class="[`recommend-list__color-${item.recommend && item.recommend > 3 ? 4 : item.recommend}`]"
      >
        {{ item.recommend }}
      </p>
      <p class="recommend-list__content">
        {{ item.title }}
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.recommend-list {
  margin-top: 20px;
  &__card {
    display: flex;
    align-items: flex-start;
    &:not(:first-child) {
      margin-top: 20px;
    }
    cursor: pointer;
    // border-bottom: 1px solid yellow;
    &:hover {
      .recommend-list__content {
        margin-left: 16px;
        transition:all 0.5s ease;
      }
    }
  }

  &__number {
    color: #fff;
    text-align: center;
    border-radius: 4px;
    font-size: var(--custom-font-size-assist);
    padding: 0 10px;
    margin-top: 2px;
  }

  &__content {
    margin-left: 12px;
    transition: all 0.5s ease;
    &:hover{
       color: var(--vp-c-brand);
    }
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis
  }

  &__color-1 {
    background: var(--vp-c-red);
  }

  &__color-2 {
    background: orange;
  }

  &__color-3 {
    background: var(--vp-c-yellow);
  }

  &__color-4 {
    background: var(--vp-c-gray);
  }
}
</style>
