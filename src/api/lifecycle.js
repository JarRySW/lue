/**
 * date: 2018-04-24
 * author: llwcy8801
 */

 /**
  * 解析、渲染DOM
  * @param  [string] selector
  */
exports.$mount = function (el) {
    this._initElement(el)

    // 解析、渲染DOM
    this._compile()
}