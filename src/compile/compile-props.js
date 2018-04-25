/**
 * date: 2018-04-24
 * author: llwcy8801
 */

import _ from '../uitl'
import Directive from '../directive'
import {compileGetter} from '../parse/expression'

/**
 * 解析props参数，包括动态属性和静态属性
 * @param  [Element] 组件节点 <my-component b-bind:name="user.name" message="hello"></my-component>
 * @param  [Object] propOptions 
 * @return [Array] 解析后prop数组
 */
// [
//     {
//         "name":"name", // 组件属性名
//         "options": {}, // Vue.extend传来的属性对应的参数
//         "raw":"user.name", // 属性对应的值
//         "dynamic": true, // true代表动态属性，就是从父实例/组件哪里获取值
//         "parentPath":"user.name" //属性值在父实例/组件中的路径
//     },
//     {
//         "name":"message",
//         "options":{},
//         "raw":"how are you?"
//     }
// ]
exports.compileProps = function (el, propOptions) {
    let names = Object.keys(propOptions)
    let props = []
    names.forEach((name) => {
        let options = propOptions[name] || {}
        let prop = {
            name,
            options,
            raw: null
        }

        let value

        if ((value = _.getBindAttr(el, name))) {
            // 动态props
            prop.raw = value
            prop.dynamic = true
            prop.parentPath = value
        } else if (value = _.getAttr(el, name)) {
            // 静态props
            prop.raw = value
        }
        props.push(prop)
    })
    return props
}

/**
 * 应用属性到vm实例上
 * 动态属性，额外走Directive、Watcher
 * @param  [Array] props
 */
exports.applyProps = function (props) {
    props.forEach((prop) => {
        if (prop.dynamic) {
            // 动态props
            let dirs = this.$parent._directives
            dirs.push(
                new Directive('prop', null, this, {
                    expression: prop.raw,
                    arg: prop.name
                })
            )
        } else {
            this.initProp(prop.name, prop.raw, prop.dynamic)
        }
    })
}

/**
 * 将prop设置到当前组件实例的$data上，initData监听数据
 * 动态属性，需要父实例/组件取值
 * @param  [string] path 组件prop键值
 * @param  [string] val 组件prop值，静态或动态值
 * @param  [boolean] dynamic
 */
exports.initProp = function (path, val, dynamic) {
    if (!dynamic) {
        this.$data[path] = val
    } else {
        this.$data[path] = compileGetter(val)(this.$parent.$data)
    }
}

