/**
 * date: 2018-04-23
 * author: llwcy8801
 */

import config from '../config'

exports.before = function (el, target) {
    target.parentNode.insertBefore(el, target)
}

exports.after = function (el, target) {
    if (target.nextSibling) {
        exports.before(el, target.nextSibling)
    } else {
        target.parentNode.appendChild(el)
    }
}

exports.remove = function (el) {
    el.parentNode.removeChild(el)
}

exports.replace = function (target, el) {
    let parent = target.parentNode
    parent.replaceChild(el, target)
}

/**
 * {把node节点attr取出来（并移除attr）}
 * @param  [Elment] node
 * @param  [String] attr
 * @return [String]
 */
exports.attr = function (node, attr) {
    attr = config.prefix + attr
    let val = node.getAttribute(attr)
    if (val) {
        node.removeAttribute(attr)
    }
    return val
}

exports.on = function (el, event, cb) {
    el.addEventListener(event, cb)
}

/**
 * {获取动态数据绑定属性值 比如l-bind:name="user.name" :name=user.name}
 * @param  [Element] node
 * @param  [String] name
 * @return [String] 属性值
 */
exports.getBindAttr = function (node, attr) {
    return exports.getAttr(node, `:${name}`) || exports.getAttr(node, `${config.prefix}bind:${name}`)
}

/**
 * {获取节点属性，并移除属性}
 * @param  [ELement] node
 * @param  [String] attr
 * @return [String]
 */
exports.getAttr = function (node, attr) {
    let val = node.getAttribute(attr)
    if (val) {
        node.removeAttribute(attr)
    }
    return val
}
