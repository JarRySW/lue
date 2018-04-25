/**
 * date: 2018-04-24
 * author: llwcy8801
 */
import _ from '../util'

/**
 * 初始化节点
 * @param  [string] selector
 */
exports._initElement = function (el) {
    if (typeof el === 'string') {
        let selector = el
        this.$el = el = document.querSelector(el)
        if (!el) {
            _.warn(`Cannot find element: ${selector}`)
        }
    } else {
        this.$el = el
    }
    this.$el.__vue__ = this
}