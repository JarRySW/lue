/**
 * date: 2018-04-23
 * author: llwcy8801
 */

/**
 * 注册事件及回到函数到实例上
 * @param  [string] event
 * @param  [Function] fn
 * @return [lue]
 */
exports.$on = function (event, fn) {
    (this._events[event] || (this._events[event] = [])).push(fn)
}

/**
 * 当前实例中触发执行事件，执行对应回调函数
 * @param  [string] 事件名称
 * @param  [*] 事件携带参数
 * @return [boolean] true可以继续传播，false不可以
 */
exports.$emit = function (event, val) {
    let cbs = this._events[event]
    let shouldPropagate = true
    if (cbs) {
        shouldPropagate = false
        // 遍历执行事件
        let args = new Array(Array.from(arguments)[1])
        cbs.forEach((cb) => {
            let res = cb.apply(this, args)
            if (res === true) {
                shouldPropagate = true
            }
        })
    }
    return shouldPropagate
}

/**
 * 向上冒泡事件
 * @param  [string] event
 * @param  [*] val
 * @return [lue]
 */
exports.$dispatch = function (event, val) {
    let shouldPropagate = this.$emit.apply(this, arguments)
    if (!shouldPropagate) return this
    let parent = this.$parent
    // 遍历父链
    while (parent) {
        shouldPropagate = parent.$emit.apply(parent, arguments)
        parent = shouldPropagate ? parent.$parent : null
    }
    return this
}

exports.$broadcast = function (event, val) {
    let children = this.$children
    let shouldPropagate = true
    children.forEach((child) => {
        shouldPropagate = child.$emit.apply(child, arguments)
        if (shouldPropagate) {
            child.$broadcast.apply(child, arguments)
        }
    })
    return this
}

