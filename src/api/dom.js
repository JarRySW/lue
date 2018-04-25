/**
 * date: ctrl+alt+d
 * author: llwcy8801
 * 本文件对DOM的操作是以lue实例为单位
 */

import _ from '../util'

/**
 * 插入lue实例
 * @param  [Element] target
 */
exports.$before = function (target) {
    _.before(this.$el, target)
}

/**
 * 移除lue实例
 */
exports.$remove = function () {
    if (this.$el.parentNode) {
        _.remove(this.$el)
    }
}