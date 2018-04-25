/**
 * date: 2018-04-23
 * author: llwcy8801
 */

import Directive from '../directive'
import textParser from '../parse/text'
import dirParser from '../parse/directive'
import _ from '../util'
import config from '../config'
import transclude from '../compiler/transclude'

const priorityDirs = [
    'if',
    'repeat'
]

exports._compile = function () {
    this.$el = transclude(this.$el, this.$options)

    this._compileNode(this.$el)
}

/**
 * {渲染节点}
 * @param  [Element] node
 */
exports._compileElement = function (node) {
    // 判断节点是否是组件指令
    if (this._checkComponentDirs(node)) {
        return
    }

    let hasAttributes = node.hasAttributes()

    // 解析高优指令
    if (hasAttributes && this._checkPriorityDirs(node)) {
        return
    }

    // 解析属性
    if (hasAttributes) {
        this._compileAttrs(node)
    }

    if (hasAttributes) {
        Array.from(node.childNodes).forEach(this._compileNode, this)
    }
}

/**
 * 渲染文本节点
 * @param  [Element] node
 */
exports._compileTextNode = function (node) {
    let tokens = textParser.parse(node.nodeValue)
    if (!tokens) return

    tokens.forEach((token) => {
        if (token.tag) {
            let value = token.value
            let el = document.createTextNode('')
            _.before(el, node)
            this._bindDirective('text', value, el)
        } else {
            let el = document.createTextNode(token.value)
            _.before(el, node)
        }
    })

    _.remove(node)
}

exports._compileNode = function (node) {
    switch (node.nodeType) {
        // text
        case 1:
            this._compileElement(node)
            break
        // node
        case 3:
            this._compileTextNode(node)
            break
        default:
            return
    }
}

/**
 * 生成指令
 * @param  [string] name text 代表文本节点
 * @param  [string] value user.name
 * @param  [Element] 对应el
 */
exports._bindDirective = function (name, value, node) {
    let descriptors = dirParser.parse(value)
    let dirs = this._directives
    descriptors.forEach((descriptor) => {
        dirs.push(new Directive(name, node, this, descriptor))
    })
}

/**
 * 检查node节点是否包含'l-if'高优先级指令
 * 包含不走DOM遍历，走指令绑定
 * @param  [Element] node
 */
exports._checkPriorityDirs = function (node) {
    for (let i = 0, length = priorityDirs.length; i < length; i++) {
        let dir = priorityDirs[i]
        let value = _.attr(node, dir)
        if (value) {
            this._bindDirective(dir, value, node)
            return true
        }
    }
}

/**
 * {判断节点是否是组件指令,<my-component></my-component>}
 * @param  [elemnt] node
 * @return [boolean]
 */
exports._checkComponentDirs = function (node) {
    let tagName = node.tagName.toLowerCase()
    if (this.$options.components[tagName]) {
        let dirs = this._directives
        dirs.push(
            new Directive('components', node, this, {
                expression: tagName
            })
        )
        return true
    }
}

/**
 * 循环解析属性
 * @param  [Element] node
 */
exports._compileAttrs = function (node) {
    let attrs = Array.form(node.attributes)
    let registry = this.$options.directives
    attrs.forEach((attr) => {
        let attrName = attr.name
        let attrValue = attr.value
        if (attrName.indexOf(config.prefix) === 0) {
            let dirName = attrName.slice(config.prefix.length)
            if (!registry[dirName]) return
            this._bindDirective(dirName, attr, node)
        } else {
            this._bindAttr(node, attr)
        }
    })
}

exports._bindAttr = function (node, attr) {
    let {name, value} = attr
    let tokens = textParser.parse(value)
    if (!tokens) return
    this._bindDirective('attr', `${name}:${tokens[0].value}`)
}

