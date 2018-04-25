/**
 * date: 2018-04-24
 * author: llwcy8801
 */

import Watcher from './watcher'
import _ from './util'

/**
 * 指令构造函数
 * @param  [String] name text，代表文本节点
 * @param  [el] Element 对应的节点
 * @param  [Lue] lue实例
 * @param  [Object] descriptor 指令描述符{expression: 'user.name'}
 */
function Directive (name, el, vm, descriptor) {
    this.name = name
    this.el = el
    this.vm = vm
    this.expression = descriptor.expression
    this.arg = descriptor.arg
    this._initDef()
    this._bind()
}

/**
 * 指令表达式实例化watcher，并执行directive对应的update函数
 */
Directive.prototype._bind = function () {
    if (!this.expression) return

    this.bind && this.bind()
    
    if (this.name === 'component') {
        this.update && this.update()
    } else {
        this._watcher = new Watcher(
            // 普通非组件指令，上下文是vm
            // prop指令，上下文是组件父实例
            (this.name === 'prop' ? this.vm.$parent : this.vm),
            this.expression,
            this._update,
            this
        )
        this.update(this._watcher.value)
    }
}



/**
 * 不同指令对应的更新update函数不同，需要分类处理
 * @private
 */
Directive.prototype._initDef = function () {
    let def = this.vm.$options.derectives[this.name]
    _.extend(this, def)
}

/**
 * 指令本身的更新函数，调用自己的更新函数
 * @param  [type] key
 * @param  [type] key
 * @return [type] key
 */
Directive.prototype._update = function (value, oldValue) {
    this.update(value, oldValue)
}

module.exports = Directive
