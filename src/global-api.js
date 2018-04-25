module.exports = function (Lue) {
    /**
     * [组件构造器返回组件构造函数]
     * @param  [type]
     * @return [LueComponents]
     */
    Lue.extend = function (extendOptions = {}) {
        let Super = this
        let Sub = createClass()
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        Sub.options = _.mergeOptions(Super.options, extendOptions)
    }

    /**
     * [构造组件构造函数本身]
     * @return [Function]
     */
     function createClass () {
        return new Function('return function LueComponent (options) {this._init(options)}')()
     }

    /**
     * [注册组件]
     * @param  [String] id 比如my-conponent
     * @param  [LueComponent] 比如MyComonents 
     * @return [type]
     */
     Lue.component = function (id, definition) {
        this.options.components[id] = definition
        return definition
     }
}