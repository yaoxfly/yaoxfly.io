import { List, Tags } from './type'
export const list:List[] = [
  {
    title: '走近Ts，用了爽，用后一直爽',
    content: 'vue3已经发布了，ts的脚步已经阻拦不住了，还只会es6?别想了，人家都已经在行动了，以下是ts的基本系列教程，ts的基本语法，高级语法等，以及在vue项目中如何应用ts，跟着我赶紧撸起来吧。',
    time: '2023-3-31',
    tag: 'TypeScript',
    path: '/blog/ts-base',
    recommend: 1
  },
  {
    title: 'vue知识点归纳与总结(笔记)',
    content: '当前总结是本人在业余学习与实践过程后的总结与归纳,旨在检验自己的积累,也方便忘记时查阅,同时也希望能帮助那些这方面知识匮乏的同行门,总结是基于',
    time: '2023-3-30',
    tag: 'vue',
    path: '/blog/vue2-base'
  }
]

export const tags:Tags[] = [
  { tag: 'vue' },
  { tag: 'React', color: 'rgb(0,216, 255)' },
  { tag: 'git', color: 'red' },
  { tag: '工具', color: 'black' },
  { tag: 'TypeScript', color: '#136ec2' },
  { tag: 'Node.js', color: '#026e00' }
]

export const useList = () => {
  const set:Set<string> = new Set([])

  list.forEach(item => {
    set.add(item.tag)
  })
  const arr = [...set]
  const data:Tags[] = []
  tags.forEach(item => {
    if (arr.includes(item.tag)) {
      data.unshift(item)
    }
  })

  return {
    list,
    total: list.length,
    tags: { data, length: arr.length }
  }
}
