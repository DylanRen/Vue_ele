<template>
  <div class="star" :class="`star-${size}`">
    <span class="star-item" :class="sc" v-for="sc in starClasses"></span>
  </div>
</template>

<script>
  /*
  分数0-5
  最高分: 5
  小数部分>=0.5
   */
  //定义为常量
  const CLASS_ON = 'on'
  const CLASS_HALF = 'half'
  const CLASS_OFF = 'off'

  export default {
    props: {
      score: Number,
      size: Number
    },

    computed: {
      starClasses () {
        const scs = []
        //添加CLASS_ON
        const scoreInteger = Math.floor(this.score)
        for(let i =0;i<scoreInteger;i++){
          scs.push(CLASS_ON)
        }
        //添加CLASS_HALF
        if(this.score-scoreInteger>=0.5){
          scs.push(CLASS_HALF)
        }
        //添加CLASS_OFF
//        let count = 5-scs.length
//        for(let i =0;i<5-count;i++){
//          scs.push(CLASS_OFF)
//        }
        while(scs.length<5){
          scs.push(CLASS_OFF)
        }
        return scs

      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .star-24
    .star-item
      display inline-block
      width 10px
      height 10px
      background-repeat no-repeat
      background-size 10px 10px
    .on
      bg-star(star24_on)
    .half
      bg-star(star24_half)
    .off
      bg-star(star24_off)
  .star-36
    .star-item
      display inline-block
      width 15px
      height 15px
      background-repeat no-repeat
      background-size 15px 15px
    .on
      bg-star(star36_on)
    .half
      bg-star(star36_half)
    .off
      bg-star(star36_off)
  .star-48
    .star-item
      display inline-block
      width 20px
      height 20px
      background-repeat no-repeat
      background-size 20px 20px
    .on
      bg-star(star48_on)
    .half
      bg-star(star48_half)
    .off
      bg-star(star48_off)
</style>
