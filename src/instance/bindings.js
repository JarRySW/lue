/**
 * 2018-04-24
 * @param  [type] key
 * @param  [type] key
 * @return [type] key
 */

import Binding from '../binding'

/**
 * 数据改变时执行
 * 1、先更新本市咧所有相关的binding
 * 2、然后再更新本实例所有子实例的相关binding
 * 3、把对应改变了的数据所有watcher执行
 */
exports._updateBindingAt = function () {
    this._updateSelfBindingAt(...arguments)
    this._updateChildrenBindingAt(...arguments)
}

exports._updateSelfBindingAt = function (event, path) {
    let pathAry = path.split('.')
    
    let r = this._rootBinding
    for (let i = 0, l = pathAry.length; i < l; i++) {
        let key = pathAry[i]
        r = r[key]
        if (!r) return
    }
    let subs = r._subs
    subs.forEach((watcher) => {
        watcher.cb()
    })
}

exports._updateChildrenBindingAt = function () {
    if (!this.$children.length) return
    this.$children.forEach((child) => {
        if (child.$options.isComponent) return
        child._updateBindingAt(...arguments)
    })
}

/**
 * 初始化数据对象的变化
 */
exports._initBindings = function () {
    this._rootBinding = new Binding()
    this.observer.on('set', this._updateBindingAt.bind(this))
        .on('get', this._collectDep.bind(this))
}

/**
 * 根据给出的路径获取binding
 * @param  [String] user.name
 * @return [boolean|Binding] key
 */
exports._getBindingAt = function (path) {
    let b = this._rootBinding
    let pathAry = path.split('.')
    for (let i = 0; i < pathAry.length; i++) {
        let key = pathAry[i]
        b = b[key]
        if (!b) return false
    }
    return b
}

/**
 * 根据给出路径创建binding
 * @param  [String] user.name
 * @return [Bindng]
 */
exports._createBindingAt = function (path) {
    let b = this._rootBinding
    let pathAry = path.split('.')

    for (let i = 0; i < pathAry.length; i++) {
        let key = pathAry[i]
        b = b[key] = b._addChild(key)
    }
    return b
}

/**
 * 收集依赖
 * 实现computed计算属性过程
 * 需要知晓计算出来属性依赖于原先哪些属性
 * 才能在原有的属性的_subs数组中添加新属性执行的watcher事件
 * @param  [path] key
 */
exports._collectDep = function (event, path) {
    let watcher = this._activeWatcher
    if (watcher) {
        watcher.addDep(path)
    }
}


