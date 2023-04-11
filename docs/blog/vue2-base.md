---
{
  title: "vue | vue2知识点归纳与总结",
}
---

# 前言
&nbsp;&nbsp;&nbsp;&nbsp;当前总结是本人在业余学习与实践过程后的总结与归纳,旨在检验自己的积累,也方便忘记时查阅,同时也希望能帮助那些这方面知识匮乏的同行门,总结是基于`vue2.x`,`vue-cli3.x`,主要记录些，`vue`常用的指令、事件，监听、数据绑定、过滤器、组件、动画、`vuex`，`vue-router`等日常工作中时常用到的东西,也有些常用的`插件`和`开发工具`的介绍与使用，以及部分`性能优化`的建议与实践,如有不对，或不足的地方，也请各位大神，指出来，学习学习。

## 1.基础

#### 1. 理解`mvvm`  

+ `m` 是`vue`实例中的`data`,自定义的数据或后端返回的数组
不是后端`mvc`里的`model`概念不同。
+ `vm` 是`vue`的实例 `m`和`v`之间的调度者 是`mvvm`的核心思想
+ `v`是 `html` 要渲染的。

#### 2. 常用指令 

+ `v-cloak` 解决{{}}插值闪烁问题
+ `v-text`  会先执行 覆盖 元素中原本的内容 但是插值表达式只会覆盖自己的占位符，默认不会闪烁 
+ `v-html`  渲染 html标签 覆盖元素中原有元素内容
+ `v-bind`: 简写为:  用来绑定数据 可以写合法的js表达式
+ `v-on`: 简写为 `@` 用来点击事件

#### 3.常用事件修饰符
+ `stop` 阻止冒泡 ：外层和里层都有方法 点击里层会产生冒泡，也会触发外层的事件。
顺序 从里到外产生事件

+ `prevent` 阻止浏览器默认行为 ：
`a`标签有浏览器默认行为。

+ `capture` 捕获事件 ：点击里层先触发外层再触发里层 顺序从外到里产生事件

+ `self`  只触发自己本身的事件 不会产生冒泡和捕获事件  类似于阻止冒泡 但只针对自己那一层 最外层还是会被最里层冒泡冒到 `stop` 是阻止所有层次

+ `once`  事件只执行一次

#### 4.数据的绑定

+ `v-bind`: 数据的单向绑定 
+ `v-modle` :数据的双向绑定 这个只能用于表单元素中
> tips: 表单元素 `radio` `text` `address` `email` `select` `checkbox` `textarea`

+ 组件嵌套：子组件里有v-model，父组件也有v-model的实现多层的双向绑定

```js
  //子组件

  <template>
  <div class="yx-from-item">

    <el-form-item :label="label"
                  :prop="prop">
      <el-select v-model="newModelValue"
                 filterable
                 clearable
                 :placeholder="placeholder">
        <el-option v-for="item in options"
                   :key="item.label"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
    </el-form-item>

  </div>
</template>

export default {
//双向数据绑定--核心
  model: {
    prop: 'modelValue',//要存在于props
    event: 'change'//当组件的值发生改变时要emit的事件名
  },

  props: {
    label: {
      type: String,
      default: () => {
        return ''
      }
    },
    prop: {
      type: String,
      default: () => {
        return ''
      }
    },

    placeholder: {
      type: String,
      default: () => {
        return '选择学校'
      }
    },
    //下拉
    options: {
      type: Array,
      default: () => {
        return [
          {
            label: '开启',
            value: 1
          },
          {
            label: '关闭',
            value: 0
          },
        ];
      }
    },
    
     //数据绑定的值--核心
   modelValue: {
      default: () => {
        return '';
       }
     }
    
  },

  data () {
    return { 
      newModelValue:this.modelValue//核心
    };
  },

  mounted () {
  },
  
 watch: {//这里检测子组件中的data中的值，一旦发生 变化就提交事件到父组件--核心
  newModelValue: function (newVal,oldval)   {
      this.$emit('change', newVal)
    },
    
   //父组件修改了model值也要赋值给子组件--核心
    modelValue: function (newVal, oldval) {
      this.newModelValue = newVal
    }
  },
 }


//父组件使用
 <yx-form-item 
    label="所属学校："
    prop="school_id"
    v-model='leftForm.model.school_id'
    :options='leftForm.schoolOptions'>
 </yx-form-item>
 
  data () {
    return {
   /*表单*/
      leftForm: {
        //学校选项
        schoolOptions: [
          {
            label: "工程",
            value: 2
          },
          {
            label: "华南",
            value: 1,
            className: 'ml-32'
        }
     ],
     
        //绑定的值 rules 规则也使用到的值
      model: {
          school_id: '', //学校id
          grade_id: '',//年级
          branch_id: '',//学院
          specialty_id: '',//专业
          class_id: '', //班级
          st_name: '',//学生姓名
          realname: '',//真实姓名
          alias: '',//学生昵称
          user_name: '',//登录账号、学号
          birthday: '',//出生日期
          password: '',//登录密码
          weixin_userid: '',// 微信账号
          mobile_phone: '',//手机号
          system: '',//学制
          state: '',//学籍状态 --账户状态
          graduate_year: '', //毕业年份
          teachername: '',//辅导员
          sex: '',//性别
          content: '',//介绍
          role: [],//角色
          dorm_id: '',//宿舍号id
          building_id: '', //楼号id
        },

        //规则
        rules: {
          state: [{ required: true, message: "请选择", trigger: "change" }],
          school_id: [
            { required: true, message: "请选择", trigger: "change" }
          ],
          branch_id: [{ required: true, message: "请选择", trigger: "blur" }],
          user_name: [{ required: true, message: "请输入账号", trigger: "blur" }],
          password: [{ required: true, message: "请输入密码", trigger: "blur" }],
          mobile_phone: [
            { validator: this.$Element.isNum, trigger: 'blur' },
            { min: 11, max: 11, message: '请输入11位的手机号', trigger: 'blur' },
          ],
          // sex: [{ required: true, message: "请选择性别", trigger: "change" }]
        },
      }
   }
  
```




#### 5.`class` 绑定

##### 1.数组带对象
```js
<div :class="[classA,classB,{'classC':flag}]" >

data(){
    return{
        flag:true
    }
}
```
 
> tips:可以在类中的数组中写三元表达式,但推荐使用对象来代替它控制是否渲染

##### 2.单纯的对象
```js
<div :class="{classA:falg1,classB:flag2}" />

data(){
    return{
        falg1:true,
        falg2:true
    }
}

```
##### 3.数组带三元
```js
<div :class="['ac','bd',falg?'active':'']" / >

data(){
    return{
        falg:true,
    }
}

```

##### 4.对象升级
```js
<div :class="classObj" />

data(){
    return{
      classObj:{classA:falg1,classB:flag2}
    }
}

```

> tips:直接使用一个对象数组来控制样式
 
 ##### 5.使用`style` 的对象来实现样式的修改
 
 ```js
<div :class="styleObj" />

data(){
    return{
      styleObj:{color:red}
    }
}

```

##### 5.使用`style` 的数组带对象来实现样式的修改
 
 ```js
<div :class="[styleObj1,styleObj2]" />
 data(){
    return{
      styleObj1:{color:red},
      styleObj2:{color:red}
    }
}
```

#### 6.`v-for`的使用
##### 1. 可以遍历: 普通数组,对象数组,对象,还可以是数字
```html
<div v-for='(item,key,index) in object' :key='index'>
 {{item}}--{{key}}--{{index}} 
</div>

<div v-for='(count in 10)'> </div>
```
>**tips**:在遍历对象的时候有多个`index`索引,遍历数字时是从1开始的。绑定`key`时属性值必须是`number`或者`string`


#### 7.`v-if`、`v-show` 

+  `v-if`   有较高的切换性能 , 适合元素可能永远不会被用户看到。
+  `v-show` 有较高的初始渲染消耗,适合元素频繁切换。

#### 8 调试插件
+ 在谷歌商店找`vue-devtools`插件,使用这个插件 
并设置插件,允许访问文件网址。 会在调试中出现vue相关的东西

+ `debugger` 直接写可以调试


#### 9 过滤器 

##### 全局和私有过滤器

```html
<div v-for='(item,key) in object' :key='index'>
 {{item | dateFormat}}
</div>

<div v-for='(count in 10)'> </div>
```
+ 全局 

 ```js
 import Vue form 'vue'
 Vue.filter('过滤器名称',function(){
     do some
 })
```

+ 私有(局部)

 ```js
 filters:{
      dateFormat:function(data,param){
          do some
      }
 }
```
>**tips**： 
>+ `data` 就是 `|` 第一个参数已经被定死了,永远是, 管道左边要被转换的数据,param 是过滤方法传进来的其他参数,过滤器采用就近优先原则，如果私有和全局的名称一样就优先采用私有的。 
>+ `padstart` 和 `padend`  `es6` 的补`0 `方法
>+ 第二个参数是字符串,第三个参数是表达式,如果自己定义参数值是动态的会报错,还未找到原因,后期会找时间再看看,目前就是`简单的过滤用过滤器`,复杂点用`方法`,能用计算属性用`计算属性`,有缓存,能提高性能

#### 10 按键修饰符
+ 监听pc键盘上的值
```html
<input @keyup.enter='方法名'></input>
```
> **tips:** `enter`  可以换成键盘上的任何一个值，只要去找相关的键盘码，就都可以使用,推荐设置个别名，放在没有按钮操作的模板。

+ 自定义全局按键修饰符
`Vue.config.keyCodes.f2=113`,就可使用了 

>**tips:** `f2`修饰符是`vue`里没有定义的自己创建。

#### 11 定义指令
##### 1. 全局
定义的指令都要按规定去创建 在`bind` 和
`inserted`
还有 `updated` 中去创建

```js
Vue.directive('focus'{
  //每当指令绑定到元素上的时候,会立即执行bind 函数,只执行一次,
  注意:在元素刚绑定元素的时候,还没有插入到dom中去,这时候,调用focus方法没有作用,即放在focus 放在bind中是不起作用 的
  bind:function(el,binding){
     el.style.color=binding.value
  },
  
  //表示元素插入到dom中的时候,只执行一次
  inserted:function(){
    el.focus() js行为放在这里去创建  
  },
  
  //当组件更新的时候,可能会触发多次
  updated:function(){},
 
})
```
 > **tips:** 
 >+ `参数1`指令名称,在定义的时候，指令名称前面不需要加v-前缀,但是调用的时候,必须在指令名称前加v-前缀;`参数2`:是一个对象，在这个对象身上，有一些指令相关的函数，这些函数可以在特定的阶段,执行
相关的操作。
 >+ 在每个函数中,的第一个参数,永远是`el`, `el`是代表被`bind`绑定的元素,`el`是个原生的`js`对象。
第二个参数可以是用户传进来值 `bingding.value`

##### 2. 局部

 ```js
 directives:{
     '指令名':{
      bind:function( el,b){

      }
    }
  }
 ```

##### 3. 简写

```js
'指令名':function(el,binding){
    
} //注意这个function 等同于 把代码写到bind和update中去
```

> **tips:**  样式相关的指令放在`bind`中,`js`行为相关的放在`inserted`中比较合适,防止指令不生效。使用场景 写组件时可以用这个去改样式


#### 12 生命周期

常用

+ `beforeCreate()`：这是我们遇到的第一个生命周期函数,表示实例完全被创建出来之前,会执行它...
+ `created()`: 这是遇到的第二个生命周期函数...

+ `beforeMount()`：这是遇到的第3个生命周期函数,表示 模板已经在内存中编辑完成,但是尚未把模板渲染(挂载)到页面中。在 `beforeMount` 执行的时候,页面中的元素,还没有被真正替换过来,只是之前写的一些模板字符串。就像{{text}}这样

+ `mounted()`：这是遇到的第四个生命周期函数,表示内存中的模板,已经真实的挂载到了页面中,用户已经可以看到渲染好的页面了。只要执行完这个生命周期,就表示整个`vue`实例已经初始化完毕了，此时，组件已经脱离了创建阶段，进入到了运行阶段。

+ `beforeUpdate()`：这时候表示,我们的界面还没有被更新[但数据已经被更新了页面中显示的数据，还是旧的，此时`data`数据是最新的。页面尚未和最新的数据保持同步

+ `update()` : 这一步执行的是 先根据`data`中最新的数据，在内存中重新渲染出一份最新的内存`dom`树,当最新的内存`dom`树被更新后,会把最新的内存`DOM`树重新渲染到真实的页面中去,这时候，就完成了数据`data(model层)->view(视图层)`的更新，
页面和`data`数据已经保持同步了,都是最新的。

+ `beforeDestory` :当执行  `beforeDestory` 钩子函数的时候,`Vue`实例就已经从运行阶段,进入到销毁阶段, 当执行`beforeDestroy`的时候，实例身上所有的`data`和所有的`methods`以及`过滤器、指令...`都处于可用状态,此时,还没有真正执行销毁的过程。

+ `destroyed` :
当执行这个函数的时候,组件已经被完全销毁了,此时，组件中所有的`数据,方法，指令，过滤器...`都已经不可用了

+ `activated`:
当有keep-alive的状态下才能触发的生命周期，每次进入页面都会执行。


新增

+ `disactivated`
当keep-alive停用时调用。

+ `disactivated`
当keep-alive停用时调用。

+ `errorCaptured`
对组件中出现对异常错误进行处理

#### 13 过渡类名实现动画

##### 1. vue的内置动画
```html
 <style>

 .v-enter,
 .v-leave-to{
     opacity:0;
     transform:translateX(150px) --这东西是位移
 }
 
 .v-enter-active,
 .v-leave-active{
 transition:all 0.4s ease;     
 }
 
 </style>

```
```html
<transition name='my'>
 <h3 v-if="flag"></h3>
</transition>
```

```js
<script>
 data(){
  return {
    flag:false
  } 
 }
</script>

```
##### 2. 使用第三方类实现动画

```html
<transition enter-active-class="bounceIn"
leave-avtive-class="bounceOut"  duration='200' 

>
 <h3 v-if="flag" class="animated"  ></h3>
</transition>
```

##### 3. 在属性中声明js钩子 实现半场动画(只需要进场,不需要离场)

```html
<transition
  <div 
 
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  >
  
  </div>
  </transition>
 
```


```html
<transition
  <div 
  v-show="flag"
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  >
  
  </div>
  </transition>
 
```

```js
<script>
  methods:{
    beforeEnter(el){
    //动画入场之前,此时动画尚未开始, 可以在beforeEnter中设置元素开始动画之前的初始位置    
    
   el.style.transform=
   "translate(0,0)"
    },
    enter(el,done){
     /*这句话,没有实际的作用,但是,如果不写,出不来动画效果,可以认为 这个会强制刷新动画,ofset触发了重绘重排导致动画更新了*/
     
     el.offsetWidth
     
     el.style.transform=
     "translate(150px,450px)"
     
     el.style.transition='all 1s ease'
    
     /*这里的done 代表着 
     afterEnter的引用,
     这个会立即执行afterEnter 否则会有延时 
     */
     done()       
    },
    
    afterEnter(el){
    /*动画完成之后,会调用afterEnter */
      this.flag=!this.flag
      
    }
  } 
</script>

```

##### 4. 在实现列表过渡的时候,如果需要过渡的元素,是通过`v-for`循环渲染出来的,不能使用`transition`包裹,需要使用`transitionGroup` 

```html
<transition-group appear tag='ul'>
 <li v-for >
 
 <li>

</transition-group>

```

```css
 .v-enter,
 .v-leave-to{
     opacity: 0;
     transform:translateY(80x);
 }
 
 .v-enter-active,
 .v-leave-active {
     transition: all 0.6s ease;
 }
 
 /*离开后下一个东西没有动画使用这个可以使用动画实现下一个东西渐渐地飘上来的效果,要和 v-leave-active的absolute 配合 固定写法*/
 .v-move {
  transition:all 0.6s ease
 }
 
 .v-leave-active{
   /* absolute 有个特点元素默认宽度就是最小值,要在元素上添加width:100%*/
    position:absolute;
 }

```

```html
<transition mode="out-in">
    <component  :is="comName" >
    </component>
</transition>
```

>  tips:
>1. `v-enter` [这是一个时间点] 是进入之前,元素的起始状态,此时还没有开始进入
>2. `v-leave-to` [这是一个时间点] 是动画离开之后，离开的终止状态,此时，元素动画已经结束了
>3.  `v-enter-active`
[入场动画的时间段]
>4.  `v-leave-active`
[离场动画的时间段]
>5. `animated` 是个动画库 新版本似乎不需要加入 
>6. 使用：`duration=200` 来表示动画的时间 如果只写一个表示统一配置了开场和离场时间  用 `对象`可传入c入场和离场 `duration="{enter:200,leave:400}"`
>7. 添加`appear`属性,实现页面刚展示出来,入场时候的效果
>8. 通过为`transition-group` 元素,设置`tag`属性
指定 `transition-group` 渲染为指定元素,如果不指定`tag`属性,默认,渲染为`span` 标签
>9. `mode="out-in"  先过渡再进来,防止有
阴影,通过`mode`来设置过渡方式。

> 注意：最外层一定要用`transition`包裹着,动画似乎升级了,可以在`transition`标签中加入`name`属性,并且在`css`样式中把`v`,替换为你的`name`属性值。

##### 5.vue动画实践-路由(页面)切换

 + 适用于后台管理系统
```
<transition 
    name="fade-move"
    mode="out-in" //先过渡再进来，防止阴影
    >
    <router-view> </router-view>
</transition>
```

```css
.fade-move-enter-active,
.fade-move-leave-active {
  transition: 0.5s all ease;
  // position: absolute
}

.fade-move-enter,
.fade-move-leave-to {
  opacity: 0;
  transform: translate3d(0, 0, -100%);
}

.fade-move-enter-to,
.fade-move-leave {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
```

+ 适用于移动端

 ```
<transition 
    name="fade-move"
    mode="out-in"
    >
    <router-view> </router-view>
</transition>
```

```css
.fade-move-enter-active,
 .fade-move-leave-active {
  transition: 0.5s all ease;
  // position: absolute
}

.fade-move-enter,
 .fade-move-leave-to {
   opacity: 0;
   transform: translateX(-10px);
}

.fade-move-enter-to,
 .fade-move-leave {
   opacity: 1;
   transform: translateX(0);
}

```


#### 14 组件
 1.使用`Vue.extend` 来创建全局的`Vue`组件 
 ```js
 var coml=Vue.extend({
  template:'<h3>这是使用Vue.extend 创建的组件</h3>'
 })
 ```

 ```
 //第一个参数组件名称,第二个参数创建出来的组件模板对象
  Vue.component('myComl',coml)
 ```

```html
<my-coml><my-coml/>
 ```
 
 2.使用 `vue.component` 来创建组件
 ```html
 Vue.component('mycom2',{
    
 template:'<div>
  <h3>
     这是直接使用Vue.component 创建出来的组件
  </h3>
</div>'    
     
 })
 
  ```

3.使用 `template` 来创建组件  

  ```html
  <template id='tmp1'>
  <div>
   <h1>
   这里通过template元素,在外部定义的组件结构,这个方式,有代码的智能提示和高量
   </h1> 
  </div>
  </template>
  
  
   Vue.component('mycom3',{
    template:'#tem1'   
   })

   ```


4. 私有组件 `componment`

```html
<template   id='temp2'>
 <h1>这是私有login组件</h1>
</template>

componment:{
 login:
  {
   template:'tmpl2'
  }
}
```

5. 函数式组件 `componment`

子
```js
/*eslint-disable*/
//VueJSX的写法
//--最主要最关键的原因是函数式组件不需要实例化，无状态，没有生命周期，所以渲染性能要好于普通组件
//--函数式组件结构比较简单，代码结构更清晰
export default {
    // 通过配置functional属性指定组件为函数式组件
    functional: true,
    // 组件接收的外部属性
    props: {
        avatar: {
            type: String
        }
    },
    /**
    * 渲染函数
    * @param {*} h
    * @param {*} context 函数式组件没有this, props, slots等都在context上面挂着
    */
    render (h, context) {
        const { props } = context
        if (props.avatar) {
            return <img src={props.avatar}></img>
        }
        return <img src={require('@/assets/logo.png')}></img>
    }
}
```

父
```
<template>
  <div>
    <template v-if="type === 'name'">
      <label>用户名：</label>
      <input type="text" placeholder="请输入用户名..." />
    </template>
    <template v-else>
      <label>邮箱：</label>
      <input type="text" placeholder="请输入邮箱..." />
    </template>
    <button @click="handleToggleClick">切换输入类型</button>
    <fuc></fuc>
    <img src="@/assets/logo.png" />
  </div>
</template>
<script>
import fuc from './fuc.js'
export default {
  name: 'KeyTest',
  components: {
    fuc
  },
  data () {
    return {
      type: 'name'
    }
  },
  methods: {
    handleToggleClick () {
      this.type = this.type === 'name' ? 'mail' : 'name'
    }
  }
}
</script>
```

```html
<!--我不想用JSX，能用函数式组件吗？
在Vue2.5之前，使用函数式组件只能通过JSX的方式，在之后，可以通过模板语法来生命函数式组件-->

<!--在template 上面添加 functional属性-->
<template functional>
  <img :src="props.avatar ? props.avatar : require('@/assets/logo.png')" />
</template>

<!--可以省略声明props-->
```

 + 如果使用了`Vue.component` 定义了全局组件的时候,组件名称使用了驼峰命名，在引用的时候大写的驼峰要改为小写,同时两个单词之间 使用-链接
 + `Vue.component`第一个参数:组件的名称,将来在引用组件的时候，就是一个标签形式来引入的,第二个参数：
 `Vue.extend` 创建的组件，其中 `template`就是组件将来要展示的内容
 
+ 注意:不论是哪种方式创建出来的组件,组件的`template` 属性指向的模板内容,必须有且只能有唯一的一个根元素。
 
#### 15 组件里的`data`

1. 组件可以有自己的`data`数据
2. 组件的`data`和实例中的`data`有点不一样,实例中的`data` 可以为一个对象,但是组件中的`data`必须是一个方法。
3. 组件中的`data` 除了必须为一个方法之外,这个方法内部,还必须返回一个对象才行。
4. 组件中的`data`数据,使用方式，和实例中的`data`使用方式完全一样!
5. 组件里`data`为什么必须是个方法返回个对象呢？ 因为要确保每个`实例`里的数据是唯一的,独有的。如果`data`里的数据是放在`实例外部`的,会被`其他实例`共享。


#### 16 组件切换
1. 组件里的切换 可以用 `v-if` 和 `v-else` 进行切换
即标签页切换

```html
 <a href=""
 @click.prevent="flag=true"
 >
 登录
 </a>
```

```html
 <a href=""
   @click.prevent="flag=flase"
  >
 注册
 </a>
```

```html
<login v-if="flag">
</login>

<register v-else="flag">
</register>

```

 2. `vue` 提供了 `component`，来展示对应名称的组件
 

```js
//component 是一个占位符

:is属性,可以用来指定要展示的组件的名称 写死的时候这个组件名要是个字符串,动态绑定时key普通写法就好,但value必须是字符串。

<component :is="'componentId'">
</component>

<component :is="oneName">
</component>

data(){
    return{
     oneName:"login",
    }
}
```


#### 17 父子组件通讯

1. 父子组件传值,通过`v-bind:(:)`来传值，通过`props`来接收值

2. 父组件用事件绑定机制传递`方法`给子组件—`v-on` 简写 `@`
```js
//父组件中
  <component-name 
  :children='children'  //传值
  @handle='show'  //绑定方法
  >
  </component-name>
  
  data(){
    
    return(){
        children:11
    }  
      
  }
  
  methods:{
      
    show(data){
          
      }
  }
  
```
3. `emit` 英文原意: 是触发,调用,发射的意思。 
`@handle=show` 父组件传`show`方法给子组件。
子组件接收父组件的方法,并用`$emit`把子组件的值传给父组件

```js
 //子组件中
   methods:{
    handle(){
        this.$emit('handle',{
            age:1,
            name:'搞事'
        })
      }
  }
```

4. 在父组件中接收子组件所有参数的同时，添加自定义参数

```js
1.子组件传出单个参数时：

// 子组件
this.$emit('test',this.param)
// 父组件
@test='test($event,userDefined)'

2.子组件传出多个参数时：

// 子组件
this.$emit('test',this.param1，this.param2, this.param3)
// 父组件 arguments 是以数组的形式传入
@test='test(arguments,userDefined)'

3.可传出个对象
this.$emit('test',{param1:1,param1:2,param1:3})

```

> tips：子组件中的`data`数据,并不是通过 父组件传递过来的,而是子组件自身私有的,比如子组件通过`ajax`,请求回来的数据,都可以放到`data`身上,`data` 上的数据都是可读可写的;


4.使用.sync来使子组件修改父组件(props)的值

```
**在父组件中,直接在需要传递的属性后面加上.sync**
<test4 :word.sync="word"/>
**在子组件中**
<template>
  <div>
    <h3>{{word}}</h3>
    <input type="text" v-model="str" />
  </div>
</template>
<script>
export default {
  props: {
    word: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      str: '',
    }
  },
  watch: {
    str(newVal, oldVal) {
      //使用update事件来更新word,而在父组件不需要调用该函数。
      this.$emit('update:word', newVal);
    }
  }
}
</script>
```
> tips: this.$emit('update:word', newVal);这个方法可不放在监听器里，父组件必须使用加上sync。如果还遇到不能修改props的警告，要再把props的值赋值给data里的值再监听，即可解决问题

5. $attrs和$listeners

+ `v-bind="$attrs"` 将父组件中不被认为 `props`特性绑定的属性传入子组件中
+ `v-on="$listeners"`
未识别的事件可通过`v-on="$listeners"`传入（.native绑原生事件是没用的）

> 主要用于高级组件的封装

#### 18  使用 ref 获取dom元素

```js
 <h3  id='myh3' ref='myh3'> </h3>
 methods:{
   getElement(){
     console.log( this.$refs.myh3.innerText)
  } 
 }
```

```js
//组件也可以使用ref,让父组件调用子组件里的方法和属性值
<login ref='mylogin'> </login>

 methods:{
     getElement(){
     //父组件调用子组件里的属性值
     console.log(this.$refs.mylogin.msg)
     }    
}
```
> tips: 
> 1. `refs`; `s`代表多个引用,会有多个`dom`元素。
> 2. `ref`英文是`reference`,值类型和引用类型。
 

#### 19 路由

1.这是`vue-router`提供的元素,专门用来 当作占位符的,
将来,路由规则,匹配到的组件,就会展示到这个`router-view`中去,所以:我们可以把router-view认为是一个占位符

```html
<router-view></router-view>
```

2.路由切换 模板写法,默认渲染为一个`a`标签,
使用`tag`的`span`可以用来转换模板的标签名


```html
<router-link to="/login" tag='span' >
登录
</router-link>
```

3.路由配置

```js
new VueRouter({
//路由匹配规则
routes:[
   {
     path:'/',
     redirect:'/login'
    },
    
    {
     path:'login',
     component:login
    },
    
    {
     path:'/register',
     component:register
    }
]  

//路由高亮的类名
linkActiveClass:'myactive'
})


var vm=new Vue({
 el:'#app',
 data:{},
 methods:{},
 router //将路由规则对象注册到vm实例上,用来监听Url地址的变化，然后展示对应的组件。
})
```

4.路由传参
  1. `query`
 
```js
 //跳转并传值
 this.$router.push({
    name: 'TeacherDetail',//组件名
    query: {
        scaleId: 1
    }
 });
 //在TeacherDetail组件中接收scaleId
 this.$route.query.scaleId 
```
>tips:接收参数和跳转路由的主体对象不同，跳转是$router,接收是$route,不要搞混了

  2. 在`path`上设置参数

```html
//参数要一一对应不可缺失,不然可能会
造成路由的不匹配
<router-link to="/login/12/ls">

```
```js
{
    path:'/login/:id/:name',component:login   
}
```


5.子路由

```html
<router-link
to="/account/login"
>
</router-link>

```

 ```js
 routes:[
 {
   path:'/account',
   component:account,
   children:{
    {
    path:'login',
    component:login
    }   
   }
 }
 
 ] 
 ```

> tips:
> + 每个路由规则,都是一个对象,这个规则对象,身上,有两个必须的属性。
> + 属性1 是`path`,表示监听,哪个路由链接地址;
> + 属性2是`component`,表示,如果路由是前面匹配到的path,则展示`component`属性对应的那个组件。
> + 子路由不能加`/`, 加了/ 会以根目录为基准匹配,这样不方便我们用户去理解`url`地址
> + 超链接的`to` 一定要加上父路由
 
  ==注意==:**`componen`属性值，必须是一个组件的模板对象,不能是组件的引用名称**

6.动态路由(router.addRoutes)更新路由信息以及获取路由信息

```js
//子路由--循环的子项
  router.options.routes[0].children.push({
        path: '/' + (menu.path.includes('iframe') ? menu.path.split('iframe')[1] : menu.path),
        name: menu.name,
        component: (resolve) => require([`evecom-scplatform-front/src/module/${menu.path}`], resolve),
        meta: { title: menu.name, icon: 'link', keepAlive: true }
      })
//父路由--循环的子项     
  router.options.routes.push({
        path: '/iframe/' + (menu.path.includes('iframe') ? menu.path.split('iframe')[1] : menu.path),
        name: menu.name,
        component: (resolve) => require([`evecom-scplatform-front/src/module/${menu.path}`], resolve),
        meta: { title: menu.name, icon: 'link', keepAlive: true }
   })
  //打印注册的路由信息
  console.log(this.$router.options.routes) 
```

> tips: 使用`router.addRoutes(routes)`方法，并不能更新路由信息，此时还应该用`router.options.routes.push()`手动添加路由信息。


7.重复点击路由时发生警告错误的解决方法

```js
// 去除路由重复点击时发生的错误警告
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
```

#### 20 命名视图实现经典布局
根据`name` 来找组件

```html
<router-view></router-view>
<router-view name="left"></router-view>
<router-view name="main"></router-view>
```

```js
var header={
    template:'<h1>header</h1>'
}

var leftBox={
    template:'<h1>leftBox</h1>'
}

var mainBox={
    template:'<h1>mainBox</h1>'
}

```

```js
{
    path:'/',components:{
        'default':header,
        'left':leftBox,
        'main':mainBox
    }
}
```
####  21 watch
 监听非`dom`元素
```js
 watch:{
    'obj.a'(newValue,oldValue){  },
     immediate:false  
  }
```

```js
 watch:{
    'obj':{
              handler (newValue, oldValue) {
            }
      },
      deep:true   //深程度监听 性能消耗大
  }
```

```js
watch:{ 
    //监听路由
    '$route.path':{
              handler (newValue, oldValue) {
            }
      },
      //immediate:true代表如果在 wacth 里声明了之后，就会立即先去执行里面的handler方法，如果为 false就跟我们以前的效果一样，不会在绑定的时候就执行
      immediate:true   
  }
```
> tips:
> + 用了`obj.a`  加上`handle +immediate：true` ,就可以监听 对象里的值，如果是`obj`  加上 `handle+deep true`  也是可以监听对象的属性但是性能消耗大 一般是直接对象> > +属性  
> + 用`handle` 方法可以让`watch`初始化就执行,如果不用 handle它就先不执行,待数据改变再执行。
> + 不要在`watch` 和`computer` 中去修改参与计算或者监听的值 而是要生成新的值。

####  22 `computed`  计算属性
+ 不传参的计算属性
```js
computed:{
 isShowExpand () {
       return this.data.length > 3 || (this.winWidth < this.maxWinWidth && this.data.length === 3)
   }
}
```
+ 传参的计算属性

```html
 <label
       class=" eve-btn-combination__from-lable"
       :class="[checkHidden(index) ? 'eve-btn-combination__display-none': 'eve-btn-combination__display-block']"
     >
     {{ item.label }}
  </label>
            
computed: {
   checkHidden () {
     // 闭包传值,index是传进来的参数
      return function (index) {
          return (index === 2 && this.winWidth <= this.maxWinWidth && this.isHidden) || (index > 2 && this.isHidden)
         }
     }
  }
```

#### 23. `render` 函数注册组件（`vm`[`vue`实例]的属性)
```js
 render:function(createElements){
 //createElements是一个方法,调用它,能够把指定的 组件模板 渲染为html结构
  return createElements(login)
  //注意 这里 return 的结果,会替换页面中el 指定的那个容器
 }
```

+ 封装按钮组件

// 创建一个button.vue文件 写法如下
```
<script>
 export default {
  //接收外部值    
  props:{
        type:{
            type:String,
            default:'normal'
        },
        text:{
            type:String,
            default:'button'
        }
   },
   
render(h){
    /*h类似于createElement: 1-元素,2-选项*/
  return h('button',{
     class:{
             btn:true,
            'btn-success':this.type === 'success',
            'btn-danger':this.type === 'danger',
            'btn-warning':this.type === 'warning',
            'btn-normal':this.type === 'normal',
        },
    //组件显示的值--dom属性
     domProps:{
           innerText: this.text || 'default'
        },
    //发射方法 
      on:{
             click:this.handleClick
         }
       })
     },
    methods:{
    //传给父组件的方法
        handleClick(){
            this.$emit('myClick')
        }
    }
}

</script>

<style scoped>
.btn{
    width: 100px;
    height:40px;
    line-height:40px;
    border:0px;
    border-radius:5px;
    color:#ffff;
}
.btn-success{
    background:#2ecc71;
}
.btn-danger{
    background:#e74c3c;
}
.btn-warning{
    background:#f39c12;
}
.btn-normal{
    background:#bdc3c7;
}
</style>
```

```
//  引入
<template>
  <div>
    <Button type='success' text='myButton' @myClick='...'></Button>
  </div>
</template>

<script>
import Button from './button.vue'
export default {
  name: 'Home',
  data(){
    return{
    }
  },
  components:{
      Button
  },
  methods:{
  }
}
</script>

<style scoped lang="less">
</style>
```

> tips: `render`和`components`区别 `render` 会把整个`app`里组件全部覆盖掉一个`app`中只能放一个`render`组件`components` 可以多个,且不会覆盖


+ render 的写法、使用方法。

```js
    render: (h, data) => {
            console.log(h, data)
            return h('div', {
              //和`v-bind:class`一样的 API
              class: {
                foo: true,
                bar: false
              },
              //和`v-bind:style`一样的 API
              style: {
                color: 'red',
                fontSize: '14px'
              },
              // 正常的 HTML 特性
              attrs: {
                id: 'foo'
              },
              // 组件 props
              props: {
                myProp: 'bar'
              },

              // DOM 属性
              domProps: {
                innerHTML: 'baz'//显示值
              },

              // 事件监听器基于 `on`
              // 所以不再支持如 `v-on:keyup.enter` 修饰器
              // 需要手动匹配 keyCode。
              on: {
                click: this.clickHandler
              },

              // 仅对于组件，用于监听原生事件，而不是组件内部使用
              // `vm.$emit` 触发的事件。
              nativeOn: {
                click: this.nativeClickHandler
              },

              // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
              // 赋值，因为 Vue 已经自动为你进行了同步。
              directives: [
                {
                  name: 'my-custom-directive',
                  value: '2',
                  expression: '1 + 1',
                  arg: 'foo',
                  modifiers: {
                    bar: true
                  }
                }
              ],
              // Scoped slots in the form of
              // { name: props => VNode | Array<VNode> }
              scopedSlots: {
                default: props => h('span', props.text)
              },
              // 如果组件是其他组件的子组件，需为插槽指定名称
              slot: 'name-of-slot',
              // 其他特殊顶层属性
              key: 'myKey',
              ref: 'myRef'
        })
    }
```

+ render 函数式组件

```js
export default {
    functional: true,
    props: {
        row: Object, // 表格的某一行数据
        render: Function, //render方法
        index: Number, //下标
        item: {
            type: Object,
            default: null
        },
        data: Array //表格里所有数据
    },
    render: (h, ctx) => {
        const params = {
            row: ctx.props.row,
            index: ctx.props.index,
            data: ctx.props.data
        }
        if (ctx.props.item) params.item = ctx.props.item
        return ctx.props.render(h, params)
    }
}
```

#### 24. `slot` 插槽

1.写插槽
```html
 <div v-if="layout === 'block'"    class="layout-block"  :class="scroll?'layout-scroll':''">
      <slot></slot>  //匿名插槽
    </div>
    
  <!-- 左右块 -->
    <div v-if="layout === 'both'" class="d-flex jc-between">
      <div class="layout-both" :class="scrollLeft?'layout-scroll':''">
        <slot name="left"></slot> //有名字的插槽
      </div>
      <div class="layout-both" :class="scrollRight?'layout-scroll':''">
        <slot name="right"></slot>
      </div>
    </div>    
```

2.使用插槽

```html
  //有名字的插槽 # v-slot的缩写是#
   <template #left></template>
   <template v-slot="left" > </template>
```

>tips 区别对待v-slot="" 和v-slot:name; =和:的区别 一个是slot的name 一个是父组件获取子组件的数据,插槽一定要用
template包裹着
```html
<template>
 插槽的内容
</template> 
```

3. 作用域 slot-scope、v-slot/#(推荐)
```
 //子组件
  <slot :node="node" :data="data">
     <span>{{ node.label }}</span>
        <span>
            <el-button type="text" size="mini" @click="() => append(data)">
              Append
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)"
            >
              Delete
            </el-button>
        </span>
  </slot>
  
  //父组件
    <eve-tree ref="tree">
      <template v-slot="{ node, data }">
        <span>{{ node.label }}</span>
        <el-button type="text" size="mini" @click="() => append(data)">
          Append
        </el-button>
      </template>
    </eve-tree>
```

> tips: 用v-slot插槽里写好的样式不会乱掉,用slot-scope样式会不起作用。
> v-slot:default 针对的是匿名的插槽
---

#### 25. `minixs` 混合
 共享方法、参数、生命周期等

```js
//mixin
const mixin = {
  created: function () {
     console.log('我是混入的')
    if (this.isWeixin()) {
      // alert(1)
    }
  },
  methods: {
    isWeixin () {
      const ua = navigator.userAgent.toLowerCase()
      const isWeixin = ua.indexOf('micromessenger') !== -1
      if (isWeixin) {
        return true
      } else {
        return false
      }
    }
  }
}

export default mixin
```

```
// import mixin from '@/core/mixin'
//全局引入-main.js

var vue = new Vue({
  mixins: [mixin],
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default vue

// 局部引入
// import mixin from '@/core/mixin'
export default {
 mixins: [mixin],
}
```


#### 26. `props` 细谈
  `props`,接收父组件传进来的参数，类型有很多，包括：`Number`、`Object`、`Function`、`Array`、`Boolean`等类型，其中稍微注意以下两种类型
 
 + 当类型为`function`时当默认值里有`this`时，不能写成箭头函数，要写成普通函数，否则`this`的指向会变成父组件
 ```js
     onExceed: {
      type: Function,
      default: function (files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      }
    }
 ```
 
  + 当类型为`Object`时当默认值里有值时要加个小括号,不加小括号报错
 ```js
     onExceed: {
      type: Object,
      default: ()=>({
          value:1
      })
    }
 ```
 
## 2.杂项

#### 1. nrm
 安装 `nrm` 
 + `npm i nrm -g` 全局安装
 + `nrm ls` 显示列表
 + `nrm use npm` 使用`npm use` 后有很多地址可选择
>tips:`nrm`只是单纯的提供几个常用的下载包`url`地址,并能够让我们在这几个地址之前,很方便的进行切换，但是，我们每次装包的时候，使用的装包工具，都是`npm`。和

```
npm i cnpm -g  不一样
```

+ 新增地址
```
nrm add 自定义名字 镜像地址
```
+ 删除地址
```
nrm del 镜像名
```
+ 测试源速度

```
nrm test  <registry>
```

#### 2. webpack
 在网页中会引用哪些常见的静态资源
+ js   
    - .js .jsx .coffee .ts(TypeScript)
+ css 
    - .css .less .sass .scss
+ Image
  - .jpg .png .gif .bmp .svg 
+ 字体文件(Fonts)
  - .svg .ttf .eof .woff .woff2

+ 模板文件
  - .ejs .jade .vue 

#### 3. 热部署
`webpack-dev-server` 实现自动打包功能,浏览器不用刷新也能看到文件已经修改,打包的文件并没有放在实际的物理磁盘上,而是直接托管到了，电脑的内存中,所以,我们在项目根目录中,根本找不到这个打包好的文件,这文件和`src`、 `dist`、 `node_modules` 平级,有一个看不见的文件

#### 4. 热更新 
  `hot`  网页不重载 直接更新 加快打包速度 不生成新文件
 
```json
 "scripts":{
   "dev":"webpack-dev-ser  ver --open --prot       3000 --contentBase src --hot "     
 }
```
配置文件中配置热更新 

 ```js
    devServer:{
      hot:true 就热更新了
 }
 ```
> tips:`webpack`当中带`s`都是数组

#### 5.`webpack`引入`vue` 

在 `webpack` 中 使用以下方式导入的`Vue`
构造函数,功能并不完善,只提供了 `runtime-only`的方式,并没有提供 像网页中那样的使用方式;

```js
//阉割版
import Vue from 'vue'

//齐全版
 import Vue from '../node_modules/vue/dist/vue.js'
 module.exports={
  resolve:{
   //设置 Vue被导入的时候的包的路径
      alias:{
        "vue$":"vue/dist/vue.js"  
    }
  }
 }
```
> tips: 包的查找规则:
> - 找项目根目录中有没有`node_modules`的文件夹 
> - 在 `node_modules` 中 根据包名,找对应的`vue`文件夹 
> - 在`vue`文件夹中，找一个叫做`package.json` 的包配置文件
> - 在`package.json` 文件中,查找一个`main`属性[`main`属性指定了这个包在被加载时候的入口文件]
> - 改了`webpake`的包就需要重新运行项目
 
#### 6.在`webpack`中通过`render`展示组件

如果想要通过`vue`,把一个组件放到页面中去展示,`vm` 实例中的`render`函数可以实现

```js
  render:function(createElement){
     return  createElement(login) 
  }
  
  //就一行可以省略{} 并且没有花括号默认就有return, 
  简写: render: c => c(login)
  
 ```
 > tips: `webpack`中 如何使用`Vue:`
 > 1. 安装`Vue`的包 
 > 2. 由于在`webpack`中,推荐使用`.vue `这个组件模板文件定义组件,所以需要安装 能解析这种文件的`loader` 
 >  3. 在`main.js`中,导入`vue` 模块
  `import Vue from 'vue'` 
 >  4. 定义一个`.vue` 结尾的组件,其中,组件有三部分组成
 >  5. 使用 `import login from './login.vue'` 导入这个组件
 >  6. 创建 `vm` 的实例 `var vm = new Vue` `({el:'app',render:c=>c(login)})`
 >  7. 在页面中创建一个`id`为`app`的`div`元素,作为我们vm实例要控制的区域
  
 #### 7. `export default` 和 `export`
 + `export default` 向外暴露的成员,可以使用任意的变量来接收
 + 在一个模块中,`export default`只允许向外暴露1次
 + 在一个模块中，可以同时使用 `export default` 和 `export` 向外暴露成员
 + 使用 `export` 向外暴露的成员,只能使用{}的形式来接收,这种形式,叫做[按需导出]
 + `export` 可以向外暴露多个成员,同时,如果某些成员,我们在`import`的时候,不需要,则可以不在 { }中定义
 +  注意使用 `export` 导出的成员,必须严格按照导出时候的名称,来使用{ } 按需接收
 
 + 使用 `export` 导出的成员，如果就想换个名称来接收,可以使用 as 来起别名

 ```js
 const arr={
      a:'1',
      b：'2'
  }
  export default arr
  
 /* export default {
    这个暴露是错误的所以当前注释 一个js文件中只能暴露一次
     address:'北京'
  }
  */
 
  export title=1 
  import arr, {title as title1 } from  '/xxx.js'
  
 ```
 
 #### 8. router
  
 + `render`会把`el`指定的容器中,所有的内容都清空覆盖,所有不要把路由的`router-view`和`router-link` 直接写到`el`所控制的元素中
 
 + 注意 `app`这个组件，是通过`vm` 实例的`render` 函数,渲染出来的,`render`函数如果要渲染组件,渲染出来的组件,只能放到`el: '#app'`所指定的元素中;
 
 + `Account` 和`GoodsList` 组件，是通过路由匹配监听到的,所以,这两个组件,只能展示到属于路由的
 
 ```html
 <router-view></router-view>中去
 ```
 + 子路由的应用场景在`标签页`切换
 
 
 #### 9. `scoped`
 
  1. 样式的 `scoped` 是通过 `css` 的属性选择器来实现的,在`vue`中的`scoped`属性的效果主要通过`PostCSS`转译实现,作用是实现了样式的模块化，防止样式全局污染。

  ```css
   .aa[vsfp]{
     color:red
    }
  ```

  2. 如何修改被scoped属性标识的样式
  可以使用/deep/ 或 >>> 样式穿透，本人常用/deep/
 常用于修改自己封装的组件库或者三方的组件库
 ```css
   /deep/ .aa{
    color:blue
   } 
 ```
 > tips:vsfp是哈希值

 #### 10. promise
 + 模拟 `promise`
 ```js
  getFution(aa,callback){
   callback(aa)   
 }
 
  getFution(aa,funtion(res){
   console.log (aa)
  })
  ```
 + 异步操作

  
  ```js
  /*
  每当new一个Promise实例的时候,就会立即执行这个异步操作中的代码。也就是说,new的时候,除了能够得到一个promise实例之外,还会立即调用 我们为 Promise 构造函数传递的那个funtion,执行这个function中的异步操作代码。
  可用一个函数包裹,这样就可以不立即执行,用函数执行
 */
  var promise=new  Promise(function(resolve,reject){
     异步操作,ajax函数等,而且可以自由输出东西了
     resolve(true) 
     reject(false)
  })
  ```
  
  ```js
  getFunction(){
    var promise=new  Promise(function(){
     异步操作,ajax函数等,而且可以自由输出东西了
     })
   }
  
  getFunction().then(
   function(data){
    console.log(err)
   },function(err){
     console.log(err)
  })
 ```

 和async和await的结合
 
 ```js
 
  async getFunction(){
    const aa= await getFunction()
    console.log(aa)
  }

 ```
 
 > tips：在 `then`里面多写个返回错误的方法是不可取的。

 #### 11. vuex
 
 + `vuex`是为了保存组件之间共享数据而诞生的,如果组件之间 有要共享的数据,可以直接挂载到`vuex`中,而不必通过父子组件之间传值了,如果组件的数据不需要共享,此时,这些不需要共享的私有数据,没有必要放到`vuex`中;

+ `vuex`,存放共享数据,`data` 存放组件私有的数据 `props`存放父组件传过来的数据

+ 操作`vuex`里的`state`
  - 直接操作`store`里的属性值,不推荐这种做法
     ```
     this.$store.state.属性值
     ```
   -  推荐只通过`mutations` 提供的方法,才能操作对应的数据,

     ```js
       mutations:{
        increment(state,payload){
            state.count++ 
          }
         }
     this.$store.commit('方法名')
    ```
 +  `vuex`里的`getters` 
 
     如果`store`中`state`上的数据,在对外提供的时候,需要做一层包装,那么推荐使用`getters`。
    
     ```
     optCount:state=>state.count
     this.$store.getters.***
     ```
 > tips: `increment`方法里的 `state`是属于`vuex`里的`state`; `count`是`state`里的属性 ;`payload`外部传进来的值,用来修改`state`里属性的值.。最多支持只能传两个参数,可以是数组和对象。
 
 + 如何监听vuex值的改变
 
 ```js

//引入组手函数 
 import {
  mapState,
} from "vuex";

 export default {
  computed: {
    // buttonType () {
    //   return this.$store.state.chat.buttonType;
    // }
    //定义一个computed，和上一行代码类似的操作
    ...mapState({
      chat: 'chat'
    })
  },

  watch: {
    //监听值变化，又进行部分操作
    'chat.buttonType': {
      handler (newV, old) {
        const res = this.getButton(this.chat.buttonType)
        this.buttonData = res.buttonData
        this.status = res.status
      }
    }
  },
 }
 
 ```
 
  #### 12. ngrok 
  可以映射本地`80`端口,把本地的映射为外网 
  [npm地址](https://www.npmjs.com/package/ngrok)
 
 ```
 //npm下载 --感觉下的有点慢 换个路径下比较好
  npm install ngrok -g 
 //命令
  ngrok http 80
  ```
  
 >tips：需要开启本地服务器,映射后只是映射www路径,不是完整的程序路径需要自己去补充完整,如果在服务器中(appach)，有开启httpd-vhosts.conf，要用#关闭
 ```#Include conf/extra/httpd-vhosts.conf```
  
#### 13.public 目录下的图片如何用 require引入
  
  ```
  //第一种 图片质量小的可以自动转换为base64的
  img: require("@/../public/img/home/user.jpg ")
  
  //第二种 这里可以把最前面的 / 看做是public
  /img/abnormal/Trash.png 
  
  即 public/img/abnormal/Trash.png
  
  ```
 >tips: @是指src目录 .. @的上一级目录,再进入public
  
#### 14.发布订阅模式
 可用于多个场景,比如兄弟组件间的数据传递，computer和watch 等无法监听的场景下
```js
 //订阅 异步的 
 this.$on('test', function (msg) {
      console.log(msg) //输出hello word!
    })
 //发布  
 this.$emit('test', 'hello world!')
```

#### 15. require.context 
一个`webpack`的`api`,通过执行`require.context`函数获取一个特定的上下文,可以使用这个`api`,它会遍历文件夹中的指定文件,然后自动导入,使得不需要每次显式的调用`import`导入模块

```js
 import Vue from "vue";
//自动加载global全局目录下以.js结尾的文件
 const componentsContext = require.context("./global", true, /\.js$/);
 componentsContext.keys().forEach(component => {
  const componentConfig = componentsContext(component);
  //兼容import export 和 require module.export 两种规范
  const file = componentConfig.default || componentConfig;
  //注册组件
  Vue.component(file.name, file);
});

```
 |参数|类型|说明|
 |--|--|--|
 |directory|String|读取文件的路径|
 |useSubdirectories|Boolean|是否遍历文件的子目录|
 |regExp|RegExp|匹配文件的正则|
 
> tips: 参数按表格里的顺序

#### 16. http-server

+ 简介

 本地文件夹中直接打开的html文件一般都是file协议，当代码中存在http或https的链接时，HTML页面就无法正常打开，为了解决这种情况，可利用node.js中的http-server，开启一个本地服务，步骤如下：

+ 安装

```js
 npm install http-server -g
 
```
+ 使用

终端进入目标文件夹，然后在终端输入：

```js
//开启服务
http-server -c-1
//成功示例
Starting up http-server, serving ./
 Available on:
  http://127.0.0.1:8080
  http://192.168.8.196:8080
Hit CTRL-C to stop the server
//关闭服务
按快捷键CTRL-C
```

> tips 开启服务只输入http-server的话，更新了代码后，页面不会同步更新

---

## 3.性能优化建议

1. `watch`如果是obj  加上 `handle+deep true`  也是可以监听对象的属性但是性能消耗大
2. `computer` 里生成的值 会有缓存 不建议用函数去处理一些值得计算 而是用 `computer` 来计算值，这样性能高。
3. `:key ='id'`  
 id是列表返回的id 如果没有id 就写item 一般不建议 写 index (eslint会有警告错误信息) 写上key 是为了减少消耗 它会有个缓存。

4. `v-once` 和 `v-model` 的区别是 只会绑定一次  不会重新更新内容 可以 减少开销  应用场景：只读场景,不进行修改页面内容的时候  
 
5.  `v-for` 和 `v-if`  不适合在同个div连用 
 
   + 可在最外层套用一层`template`来解决
```html
    <template v-for="(column, index) in btn">
       <el-button size="small"
                       :type='column.type'
                       :plain='column.plain'
                       :class='!isEmpty(column.style)&&[scope.$index + (currentPage - 1) * pageSize==column.style.index?column.style.className:""] '
                       @click="handle(id&&!column.isGetAll?scope.row[id]:scope.row,column.lable,scope.$index + (currentPage - 1) * pageSize)"
                       :key='index'>
              {{column.lable}}
            </el-button>
          </template>

```
6. `this.$parent` 可修改父组件值,但不建议,只读就好

7. `gzip` 优化
+ `vue`配置 在前端生成带有`gz`的文件
+ 辅助插件:`compression-webpack-plugin`



```js
//当前的配置不适用于最新版本插件的配置，可用于5.0.1版本。

const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const isProduction = process.env.NODE_ENV === 'production'

configureWebpack: config => {
    if (isProduction) {
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      )
    }
  },
```

> tips:有些人会疑惑后端开启gzip，就会将相应文件压缩，浏览器就能识别，就已经起到优化的效果了,前端为什么还要压缩？

>1. nginx给你返回js文件的时候，会判断是否开启gzip，然后压缩后再还给浏览器。但是nginx其实会先判断是否有.gz后缀的相同文件，有的话直接返回，不自己压缩。
>2. 压缩是要时间的！不同级别的压缩率花的时间也不一样。所以提前准备gz文件，可以降低服务器压缩的负担，更加优化。而且可以把压缩率提高点，这样带宽消耗会更小。


ngnix服务端配置
```json
 //配合前端的gzip
  在站点配置添加如下代码：

    location ~* \.(css|js)$ {
       gzip_static on;
    }
 
    这是 nginx 的静态 gzip功能，会自动查找对应扩展名的文件，如果存在 gzip 文件，就使用，如果没有就用原文件

   //后端返回gzip
    gzip on;
    gzip_static  on;
    gzip_min_length  1k;
    gzip_buffers     4 16k;
    gzip_http_version 1.1;
    gzip_comp_level 2;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml;
    gzip_vary on;
    gzip_proxied   expired no-cache no-store private auth;
    gzip_disable   "MSIE [1-6]\.";
```

8. `cdn`加速

```html
    <script src="https://unpkg.com/vue@2.6.10/dist/vue.runtime.min.js"></script>
    <script src="https://unpkg.com/vuex@3.0.1/dist/vuex.min.js"></script>
    <script src="https://unpkg.com/vue-router@3.0.3/dist/vue-router.min.js"></script>
    <script src="https://unpkg.com/axios@0.19.0/dist/axios.min.js"></script>
    <script src="https://unpkg.com/element-ui@2.9.2/lib/index.js"></script>

```

```js
  //有了config就按以下配置
  configureWebpack: config => {
    //cdn 
    config.externals = {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      axios: 'axios'
    }
    if (isProduction) {
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      )
    }
  }
  ```
  
9. 网页中引入的静态资源多了以后有什么问题?
  + 网页加载速度慢, 因为我们要发起很多的`二次`请求;
  + 要处理错综复杂的依赖关系

 > 解决方案: 
> 1. 合并、压缩、精灵图、图片的`base64`编码 、`cdn`
> 2. 可以使用之前学过的`requireJs`、也可以使用`webpack`
 

10. 建立不同的环境变量(开发、测试、正式)
```js
一、建立环境配置文件
在package.json 同级的目录下 建立3个文件
1 .env.development  --开发环境 (本地环境)
2 .env.production   --正式环境 (正式线服务器--打包)
3 .env.test         --测试环境 (测试线服务器--打包)

二、在每个文件中写入具体的配置内容

/*****.env.development文件的内容*****/

  ENV = 'development'
  VUE_APP_CURRENT_MODE = 'development'

/*****.env.production文件的内容*****/

  ENV = 'production'
  VUE_APP_CURRENT_MODE = 'production'

/*****.env.test*****/
  NODE_ENV = production  //注意这里一定不能加字符串
  ENV = 'test'
  VUE_APP_CURRENT_MODE = 'test'

三、在package.json 中写入

 1.在纯粹的vue_cli3.x配置如下
 
 "scripts": {
    "serve": "vue-cli-service serve --mode development",
    "build": "vue-cli-service build --mode production",
    "build:test": "vue-cli-service build --mode test",
  },
  
 2.在uni-app下的vue_cli3.x的配置
 
  "scripts": {
    "serve": "npm run dev:h5 -- development", //修改点
    "build": "npm run build:h5 -- production", //修改点
    "build:test": "npm run build:h5  -- test",  //修改点
    "build:h5": "cross-env NODE_ENV=production UNI_PLATFORM=h5    vue-cli-service uni-build --mode", //修改点
    "build:mp-alipay": "cross-env NODE_ENV=production UNI_PLATFORM=mp-alipay vue-cli-service uni-build",
    "build:mp-baidu": "cross-env NODE_ENV=production UNI_PLATFORM=mp-baidu vue-cli-service uni-build",
    "build:mp-toutiao": "cross-env NODE_ENV=production UNI_PLATFORM=mp-toutiao vue-cli-service uni-build",
    "build:mp-weixin": "cross-env NODE_ENV=production UNI_PLATFORM=mp-weixin vue-cli-service uni-build",
    "dev:h5": "cross-env NODE_ENV=development UNI_PLATFORM=h5 vue-cli-service uni-serve --mode", //修改点
    "dev:mp-alipay": "cross-env NODE_ENV=development UNI_PLATFORM=mp-alipay vue-cli-service uni-build --watch",
    "dev:mp-baidu": "cross-env NODE_ENV=development UNI_PLATFORM=mp-baidu vue-cli-service uni-build --watch",
    "dev:mp-toutiao": "cross-env NODE_ENV=development UNI_PLATFORM=mp-toutiao vue-cli-service uni-build --watch",
    "dev:mp-weixin": "cross-env NODE_ENV=development UNI_PLATFORM=mp-weixin vue-cli-service uni-build --watch",
    "info": "node node_modules/@dcloudio/vue-cli-plugin-uni/commands/info.js"
  },
```

>tips:以上不同环境的切换,修改点主要就是mode  -- '环境变量'  然后写  NODE_ENV = production 的时候 production不要加引号
 VUE_APP_GETWAY_SERVER = http://172.16.111.54:81/  //写域名的时候也不要加引号


11.sourceMap 

我们在项目进行打包后，会将开发中的多个文件代码打包到一个文件中，并且经过压缩，去掉多余的空格，这样处理后的代码和源代码会有很大的差别，当有bug的时候，我们只能定位到压缩处理后的代码位置，无法定位到开发环境中的代码，对于开发不好调式,因此sourceMap出现了，它就是为了解决不好调式代码问题的。

12. 解决Vue入口文件index.html缓存，导致白屏问题
 
 ngnix服务器配置不让缓存index.html

```js
 //方案一
 location = /index.html {
    add_header Cache-Control "no-cache, no-store";
 }
 
 //方案二
 location / {
         root /www/dm;
         index index.html index.htm;
         try_files $uri $uri/ /index.html;
         //添加header cache no store配置
         add_header Cache-Control "no-cache, no-store";
 }
 
 //方案三 (这个方案可能有效)
 再换一种方案，更改服务器配置，强制不缓存入口文件，其他静态正常缓存，比如在nginx中对静态部分如下

 location / {
    root   /mnt/dat1/test/tes-app;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
    #### kill cache
    add_header Last-Modified $date_gmt;
    add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
    if_modified_since off;
    expires off;
    etag off;
 }
  //设置其他静态需缓存除了index.html;
 location ~* ^.+\.(jpg|jpeg|gif|png|ico|css|js)$ {
    root   /mnt/dat1/test/tes-app;
    access_log off;
    expires 30d;
}  
```

13. 解决引入第三方npm包ie兼容问题

babel-loader 会忽略所有 node_modules 中的文件，在vue.config.js中 配置以下配置可以实现显示转换 

```js
 // 1.绝对路径
  transpileDependencies: [/node_modules[/\\\\](evecom-scplatform-front|)[/\\\\]/],
  // 2.相对路径
  transpileDependencies: ['vue-baidu-map', 'element-ui']
```

>tips:`evecom-scplatform-front` 是指 npm包名

14. 当在写插件的目录，引入并测试lib模式打包的js文件，出现eslint检查错误的解决

在被打包的文件头加上/*eslint-disable*/去除eslint检查。

>tips:插件包在node_module里好像就不检查eslint了

14. proxy
代理配置

```js
//配置多个代理
在vue.config.js中
devServer: {
    proxy: {
      '/cas': {
        target: process.env.VUE_APP_CAS_SERVER,
        // ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/cas': '/'
        }
      },
      '/api-gateway': {
        target: process.env.VUE_APP_GETWAY_SERVER,
        // ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api-gateway': '/'
        }
      }
    }
  },
```

```js
//使用
const cas = process.env.NODE_ENV === 'development' ? `cas` : `${process.env.VUE_APP_CAS_SERVER}`
const apiGateway = process.env.NODE_ENV === 'development' ? `api-gateway` : ''

const login = {
  // 发送短信的接口
  sendMsgNotice: `${apiGateway}${config.service.noticeService}/msgnotice/sendMsgNotice`,
  // 获取token
  getToken: `${cas}/oauth2.0/accessToken`,
  // 保存token
  saveUsernameToken: `${cas}/saveUsernameToken`,
  // 获取用户信息
  getUserInfo: `${apiGateway}${config.service.teachService}/userInfo/userInfo?clientType=app`,
  // 注册用户
  register: `${apiGateway}${config.service.uumsService}/register/appRegister`
}
export default login
```

>tips:需要特别注意，本地代理时axios的baseUrl一定要设置成'/', 在使用接口的时候要在接口名前加上代理名。

15.splitChunks分包优化
大体积的包，分成多个小体积的包进行加载，减少请求时间

```js
 //1.全部处理
const chunks = ['vendors', 'index']
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 输出文件名
      filename: 'index.html',
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'eve-ui',
      chunks: chunks //这个比较关键,要把要分包的插件写入这里，否则页面将会白屏
    }
  },

  configureWebpack: config => {
   
      const optimization = {
        splitChunks: {
          chunks: 'all',
          minSize: 20000, //代码分割的最小值，默认30k；
          maxInitialRequests: Infinity, //最大的初始化加载次数，默认为3；
          cacheGroups: { //缓存组
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name (module) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                chunks.push(packageName)
                return `${packageName.replace('@', '')}`
              },
            },
            vendors: {
              name: 'vendors',
              test: /[\\/]node_modules[\\/]/,
              priority: -20
            }
          }
        },
      }
      Object.assign(config, { optimization })
    }
  
  
  //2.单独处理
  const chunks = ['vendors', 'vue', 'vuex', 'vue-router', 'element-ui', 'index']

  cacheGroups: { //缓存组
          // // 处理入口chunk,同步的
          // commons: {
          //   chunks: 'initial',
          //   minChunks: 2,
          //   maxInitialRequests: 5, // The default limit is too small to showcase the effect
          //   minSize: 0, // This is example is too small to create commons chunks
          // },
    
          vuex: {
            name: 'vuex',
            test: /[\\/]node_modules[\\/]vuex[\\/]/,
            priority: -10
          },
          'vue-router': {
            name: 'vue-router',
            test: /[\\/]node_modules[\\/]vue-router[\\/]/,
            priority: -10
          },

          vue: {
            name: 'vue',
            test: /[\\/]node_modules[\\/]vue[\\/]/,
            priority: -10
          },
          'element-ui': {
            name: 'element-ui',
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            priority: -10
          },
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -20
   }
 
 
```


## 4. 各种插件的介绍和引用
1. postcss-plugin-px2rem   
配置文件名`postcss.config.js`  `vue-cli3.x`脚手架自带的`px`转`rem`等单位和自动加浏览器前缀的配置,建立脚手架的时候选择分离,不然配置在`josn`文件中不好配置；
rootValue中的192为1rem所对应的px；默认为100，我这里设计图是1920的所以改为192。如果设计图是750，rootValue，就是75。  

```js
module.exports = {
  plugins: [
    //自动加前缀
    require('autoprefixer')(),
    //自动转rem
    require('postcss-plugin-px2rem')({
      rootValue: 192, //设计图的宽度/10
      unitPrecision: 10, //换算的rem保留几位小数点
      mediaQuery: flase,//媒体查询条件值是否开启转换rem
      minPixelValue: 3
      // exclude:/node_modules|folder_name/i,把第三方的框架排除掉
    })
  ]
}

```
>tips: 这边会有歧义，`mediaQuery`设置为`true`，会导致`@media screen and (max-width: 1200px){}` 中的`1200px`会转为`rem`,但媒体查询内部的值的转换不会受到影响，会进行值的转换，所以设置为`false`。
自动添加前缀如果看不效果要改browserslistrc这个文件，建议配置如下，特别注意如果没有安装postcss-plugin-px2rem 这个插件postcss.config.js可全都不要配置，它已经自带有自动添加前缀功能，只需要修改browserslistrc这个文件即可
```
> 1%
last 2 versions
not ie <= 8
chrome >= 14
safari >= 3
not dead
```

2. babel-plugin-transform-remove-console

删除`console`,在根目录中新建个`.babelrc`的文件,在以下文件中配置
```js
//第一种
{
  "env": {
    "production": {
      "plugins": [
        ["transform-remove-console", { "exclude": ["error", "warn"] }]
      ]
    }
  }
}

//第二种

一、建立环境配置文件
在package.json 同级的目录下 建立3个文件
1 .env.development  --开发环境 (本地环境)
2 .env.production   --正式环境 (正式线服务器--打包)
3 .env.test         --测试环境 (测试线服务器--打包)

二、在每个文件中写入具体的配置内容

/*****.env.development文件的内容*****/
  ENV = 'development'
  VUE_APP_CURRENT_MODE = 'development'

/*****.env.production文件的内容*****/
  ENV = 'production'
  VUE_APP_CURRENT_MODE = 'production'

/*****.env.test*****/
  NODE_ENV = production  //注意这里的production一定不能加字符串
  ENV = 'test'
  VUE_APP_CURRENT_MODE = 'test'

三、在package.json 中写入
 
 "scripts": {
    "serve": "vue-cli-service serve --mode development",
    "build": "vue-cli-service build --mode production",
    "build:test": "vue-cli-service build --mode test",
  },


四、在babel.config.js 中写
 let transformRemoveConsolePlugin = [];
 if (process.env.VUE_APP_CURRENT_MODE === "production") {
  transformRemoveConsolePlugin = [
    ["transform-remove-console", { exclude: ["error", "warn"] }]
  ];
}

module.exports = {
  presets: ["@vue/app"],
  plugins: [...transformRemoveConsolePlugin]
};

```

3. `html-webpack-plugin` 
当使用 `html-webpack-plugin` 之后,我们不再需要手动处理`bundle.js`的引用路径了,因为这个插件,已经帮我们自动创建了一个合适的script,并且,引用了正确的路径

```js
/*导入在内存中生成html页面的插件,只要是插件,都一定要放到plugins节点中去
*/

 const htmlWebpackPlugin=require("html-webpack-plugin")

  //创建一个 内存中 生成html 页面的插件
 new htmlWebpackPlugin({
 template:path.join(__dirname,'./src/index.html')
 filename:'index.html'
 })

 ```
 
 ```js
 //这个节点,用于配置 所有 第三方模块 加载器
 module:{
   rules:[
    {test:/\.css$,use:[]}
   ]     
 }
 ```
 4. prerender-spa-plugin
 
 构建阶段生成匹配预渲染路径的 html 文件

```js
npm install prerender-spa-plugin --save
vue.config.js 

const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

configureWebpack: config => {
    if (isProduction) {
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      ),
        config.plugins.push(
          new PrerenderSPAPlugin({
            staticDir: path.join(__dirname, 'dist'),
            routes: [
              // '/'
              '/login'
              // '/show',
              // '/websocket',
              // 'websocket2',
              // '/websocket3',
              // '/home',
              // 'abnormal/AbnormalStatis',
              // 'abnormal/FocusCrowd',
              // 'abnormal/FocusDetail',
              // 'abnormal/ScaleDetail',
              // 'abnormal/WarnSetup',
              // 'abnormal/WarnDetail',
              // 'abnormal/WarnLists',
              // 'abnormal/PsychMonth',
              // 'abnormal/PsychTeacher',
              // 'abnormal/PsychList',
              // 'laboratory/sports/MoveClock',
              // 'laboratory/sports/ClockDetail',
              // 'activity/ActList',
              // 'activity/ActForm'
            ],

            minify: {
              minifyCSS: true, // css压缩
              removeComments: true // 移除注释
            },
            server: {
              port: 8080
            },

            //忽略打包错误
            ignoreJSErrors: true,
            phantomOptions: '--web-security=false',
            maxAttempts: 10,
            renderer: new Renderer({
              injectProperty: '__PRERENDER_INJECTED',
              inject: {
                foo: 'bar'
              },
              headless: false,
              renderAfterTime: 5000,
              renderAfterDocumentEvent: 'render-event'
            })
          })
        )
    }
  },

	 main.js
	  new Vue({
	   mounted() {
	    document.dispatchEvent(new Event('render-event')) 
	  }
	 }).$mount('#app')
 
 ```
 >tips: `main.js`中的`render-event`,要和 `renderAfterDocumentEvent:'render-event'` 一一对应 ,`publicPath` 目前验证必须是/ 不能自定义文件夹

5.webpack-bundle-analyzer

打包后各个包大小分析插件

```js
npm i webpack-bundle-analyzer --save-dev
```

在vue.config.js中配置
```js
 chainWebpack: config => {
  process.env.NODE_ENV === 'production' && config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  },
```



