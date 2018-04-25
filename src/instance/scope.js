/**
 * date: 2018-04-24
 * author: llwcy8801
 */

import Observer from '../observer/observer'
import _ from '../util'

/**
 * 初始化观察对象
 */
exports._initData = function (data) {
    this.observer = Observer.create(data)
}

/**
 * 初始化props，将props解析添加到$data
 * 如果是动态属性，会在父实例生成对应的directive和watcher
 * @param  [type] key
 */
exports._initProps = function () {
    let {el, props, isComponent} = this.$options
    if (!isComponent || !props) return
    let compiledProps = this.compiledProps(el, props)
    this.applyProps(compiledProps)
}

/**
 * 初始化计算属性，将计算属性定义的function当做该函数的getter
 */
exports._initComputed = function () {
    let computed = this.$options.computed
    if (!computed) return
    for (let key in computed) {
        let def = computed[key]
        if (typeof def === 'function') {
            def = {
                get: def
            }
            def.enumerable = true
            def.configurable = true
            Object.defineProperty(this.$data, key, def)
        }
    }
}

/**
 * 初始化方法：将method下方法，proxy到vm实例上
 */
exports._initMethods = function () {
    let {methods} = this.$options
    if (!methods) return
    for (let key in methods) {
        this[key] = () => {
            methods[key].apply(this, arguments)
        }
    }
}

/**
 * 初始化代理，将$data里面的数据代理到vm实例上
 */
exports._initProxy = function () {
    for (let key in this.$data) {
        _.proxy(this, this.$data, key)
    }
}


