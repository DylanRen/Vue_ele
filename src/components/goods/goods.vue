<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuDiv">
        <ul>
          <!--current:代表当前的-->
          <li class="menu-item" v-for="(good, index) in goods"
              :class="{current: currIndex==index}" @click="clickMenuItem(index)">
             <span class="text border-1px">
               <span class="icon" v-if="good.type>=0" :class="classMap[good.type]"></span>{{good.name}}
             </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsDiv">
        <ul>
          <li class="food-list food-list-hook" v-for="good in goods">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item border-1px" v-for="food in good.foods">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    cartcontrol组件
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import BScroll from 'better-scroll'
  export default {
    data(){
      return{
        goods:[],
        classMap:["decrease", "discount", "guarantee", "invoice", "special"],
        scrollY: 0,//垂直方向滚动,不断变化的结果，需要监听
        tops:[]
      }
    },
    mounted(){
      //ajax请求获取goods数据
      axios.get('/api2/goods')
        .then(response => {
          const result = response.data
          if(result.code === 0){
            this.goods = result.data

            //创建scroll对象
//            setTimeout(() =>{
//              this._initScroll()
//            },100)
            //更新界面是异步的，而定时器也不合适，因为无法确定时间
            //实现更新界面以后，再调用回调函数
            //将回调延迟到下次DOM，更新循环之后执行
            this.$nextTick(() =>{
              this._initScroll()//初始化滚动条
              this._initTops()//初始化tops数组
            })
          }
        })
    },
    methods:{
      //不是事件相关的回调函数，会采取_方式，和其他函数区别开
      _initScroll(){
        //创建左侧的列表对应的scroll对象
        new BScroll(this.$refs.menuDiv,{
          click:true//响应点击
        })
        //创建右侧的列表对应的scroll对象,需要监视右侧的滚动
        this.foodsScroller = new BScroll(this.$refs.foodsDiv, {
          //new 对象的时候，除了传一个DOM元素，还可以传一个选项对象 选项配置
          probeType:3//标识分发scroll事件---》绑定scroll回调函数才会调用
        })

        //监视foods列表的滚动
        this.foodsScroller.on('scroll', (event) => {
          if(!this.clickMenu){
            this.scrollY = Math.abs(event.y)
          }
          //console.log(event.y);
        })
        this.foodsScroller.on('scrollEnd' , (event) =>{
          this.clickMenu = false
          this.scrollY = Math.abs(event.y)
        })
      },

      _initTops(){
        //准备一个空容器
        const tops = []
        let top = 0
        tops.push(top)
        const lis = this.$refs.foodsDiv.getElementsByClassName('food-list-hook')
        Array.prototype.slice.call(lis).forEach(li =>{
          top += li.clientHeight
          tops.push(top)
        })
        //更新tops状态
        this.tops = tops
        console.log(tops);
      },
      //better-scroll 默认会阻止浏览器的原生的click事件
      clickMenuItem(index){
        //修改标识属性
        this.clickMenu = true
//        this.scrollY = this.tops[index]
        //console.log(index);
        //滚动的目标li
        const li = this.$refs.foodsDiv.getElementsByClassName('food-list-hook')[index]
        //平滑滚动到li
        this.foodsScroller.scrollToElement(li,300)


      }
    },

    computed:{
      currIndex(){
        const {tops, scrollY} = this
        //findIndex():每个返回true的回调所对应的index
        //scrollY>=当前top值 && scrollY<下一个top值
        return tops.findIndex((top ,index) =>{
          return scrollY>=top && scrollY<tops[index+1]
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
