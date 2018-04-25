/**
 * date: 2018-04-23
 * author: llwcy8801
 * 实例初始化
 */

import _ from '../util'

exports._init = function (options) {
    // 存储遍历DOM生成的当前Watcher
    this._activeWatcher = null
    this.$options = options
    this.$parent = options.parent
    this.$children = []
    this._evnts = {}

    if (!this.$options.isComponent) {
        this.__proto__ = this.$parent
    }

    // lue构造函数函数上定义了一些指令相关的方法，引入
    _.extend(this.$options, this.constructor.options)

    if (this.$parent) {
        this.$parent.$children.push(this)
    }

    this.$data = options.data || {}

    // 初始化组件props
    this._initProps()

    // 初始化data，主要做Observer，数据监听
    this._initData(this.$data)

    // 初始化计算属性
    this._initComputed()

    // 初始化数据代理
    this._initProxy()

    // 初始化事件
    this._initEvents()

    // 初始化方法
    this._initMethods()

    // binding、watcher、directive动态绑定数据核心
    this._initBindings()

    // 指令数组，存放解析DOM模板的时候生成的指令
    this._directives = []

    // 解析DOM模板，渲染真实DOM
    if (options.el) {
        this.$mount(options.el)
    }
}



