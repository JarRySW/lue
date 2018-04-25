/**
 * date: 2018-04-24
 * author: llwcy8801
 */

import arrayAugmentations from './array-augmentations'
import objectAugmentations from './object-augmentations'

const ARRAY = 0
const OBJECT = 1

let uid = 0

Observer.emitGet = false

function Observer (value, type) {
    this.value = value
    this.id = ++uid

    // TODO 这里enumerable一定要为false,否则会触发死循环, 原因未明
    Object.defineProperty(value, $observer, {
        value: this,
        enumerable: false,
        writable: true,
        configurable: true
    })

    if (type === ARRAY) {
        value.__proto__ = arrayAugmentations
        this.link(value)
    } else if (type === OBJECT) {
        value.__proto__ = objectAugmentations
        this.walk(value)
    }
}

// 遍历数据的对象
Observer.prototype.walk = function (obj) {
    let val
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) return

        val = obj[key]

        // 存储父节点
        this.observer(key, val)

        // 定义对象属性
        this.convert(key, val)
    }
}

// 定义对象属性
Observer.prototype.convert = function (key, val) {
    let ob = this
    Object.defineProperty(this.value, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            if (Observer.emitGet) {
                ob.notify('get', key)
            }
            return val
        },
        set: function (newVal) {
            if (newVal === val) return
            val = newVal
            ob.notify('set', key, newVal)
        }
    })
}

/**
 * {调用observer函数，如果有父节点存储父节点到自身，方便后面事件传播}
 * @param  [String] key
 * @param  [*] 属性值
 */
Observer.prototype.observer = function (key, val) {
    let ob = Observer.create(val)
    if (!ob) return
    ob.parent = {
        key,
        ob: this
    }
}

/**
 * {var ary = [1,{name:liangshaofeng}]，处理数组某项为对象}
 * @param  [Array] key
 */
Observer.prototype.link = function (items) {
    items.forEach((value, index) => {
        this.observer(index, value)
    })
}


/**
 * {订阅事件}
 * @param  [String] event
 * @param  [Function] 回到函数
 * @return [Observer] 观察者对象
 */
Observer.prototype.on = function (event, fn) {
    this._cbs = this._cbs || {}
    if (!this._cbs[event]) {
        this._cbs[event] = []
    }
    this._cbs[event].push(fn)

    // 实现级联调用
    return this
}

 /**
  * {取消订阅}
  * @param  [event] event
  * @param  [Function] key
  * @return [Observer] key
  */
Observer.prototype.off = function (event, fn) {
    this._cbs = this._cbs || {}

    // 取消订阅事件
    if (!arguments.length) {
        this._cbs = {}
        return this
    }

    let callbacks = this._cbs[event]
    if (!callbacks) return this

    // 取消特定事件
    if (arguments.length === 1) {
        delete this._cbs[event]
        return this
    }

    // 取消特定事件的特定回调函数
    for (let i = 0, cb; i < callbacks.length; i++) {
        cb = callbacks[i]
        if (cb === fn) {
            callbacks.splice(i, 1)
            break
        }
    }
    return this
}

/**
 * {触发消息，并逐层往上传播}
 */
Observer.prototype.notify = function (event, path, val) {
    this.emit(event, path, val)
    let parent = this.parent
    if (!parent) return
    let ob = parent.ob
    let key = parent.key
    let parentPath

    // 兼容数组
    if (path) {
        parentPath = `${key}.${path}`
    } else {
        parentPath = key
    }
    ob.notify(event, parentPath, val)
}


/**
 * {触发执行回调函数}
 * @param  [string] 类型
 * @param  [path] 路径
 */
Observer.prototype.emit = function (event, path, val) {
    this._cbs = this._cbs || {}
    let callbacks = this.cbs[event]
    if (!callbacks) return
    callbacks = callbacks.slice(0)
    callbacks.forEach((cb, i) => {
        callbacks[i].apply(this, arguments)
    })
}

/**
 * {根据不同数据类型，调用observer构造函数}
 * @param  [*] value
 */
Observer.create = function (value) {
    if (Array.isArray(value)) {
        return new Observer(value, ARRAY)
    } else if (typeof value === 'object') {
        return new Observer(value, OBJECT)
    }
}

module.exports = Observer


