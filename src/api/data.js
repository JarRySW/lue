/**
 * date: 2018-04-23
 * author: llwcy8801
 */

import Watcher from '../watcher'

 /**
  * vm.$watch(function(){})
  * @param  [string] 指令表达式
  * @param  [function] 指令表达式对应的数据发生改变执行回调
  */
exports.$watch = function (exp, cb) {
    new Watcher(this, exp, cb, this)
}

/**
 * 设置属性值 this.vm.$set('user.name', 'll')
 * @param  [string] exp user.name
 * @param  [*] 数据的值
 */
exports.$set = function (exp, val) {
    let ee = exp.split('.')
    let length = ee.length
    let data = this.$data
    for (let i = 0; i < length - 1; i++) {
        let key = ee[i]
        data = data[key]
    }
    data[ee[length - 1]] = val
}