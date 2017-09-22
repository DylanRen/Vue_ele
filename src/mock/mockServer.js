/**
 * Created by RS on 2017/9/15.
 */
/**
  使用mockjs提交模拟接口
**/
import apiData from './data.json'
import Mock from 'mockjs'
//注册路由
Mock.mock('/api2/goods', {code: 0, data: apiData.goods} )
Mock.mock('/api2/ratings', {code: 0, data: apiData.ratings} )
Mock.mock('/api2/seller', {code: 0, data: apiData.seller} )

//一般写JS模块，在最后都会写一条语句
//export default xxx
//而这个模块比较特殊，只需要执行一次，接口就可以访问了，不需要暴露

