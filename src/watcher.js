/**
 * date: 2018-04-24
 * author: llwcy8801
 */

 import Batcher from './batcher'
 import expParser from './parse/expression'
 import Observer from './observer/observer'

 let uid = 0
 let batcher = new Batcher()

 /**
  * Watcher构造函数
  * 1.指令对应的数据发生改变的时候，执行更新DOM的updtate函数
  * 2.当$watch API对应的数据发生改变的时候，执行自己定义的回调函数
  * @param  [Lue] lue实例
  * @param  [String] expression 表达式，'user.name'
  * @param  [Function] cb 回调函数
  * @param  [Object] ctx 执行上下文
  */
function Watcher (vm, expression, cb, ctx) {
    this.id = ++uid
    this.vm = vm
    this.expression = expression
    this.cb = cb
    this.ctx = ctx || vm
    this.deps = Object.create(null)
    this.getter = expParser.compilerGetter(expression)
    this.initDeps(expression)
}

Watcher.prototype.initDeps = function (path) {
    this.addDep(path)
    this.value = this.get()
}

/**
 * 根据给出路径，创建Binding对象
 * 然后把当前watcher对象添加到binding对象上
 * @param  [String] path
 */
Watcher.prototype.addDep = function (path) {
    let vm = this.vm
    let deps = this.deps
    if (deps[path]) return
    deps[path] = true
    let binding = vm._getBindingAt(path) || vm._createBindingAt(path)
    binding._addSub(this)
}

/**
 * 数据发生更新的时候，就是触发notify
 * 冒泡到顶层的时候，触发updateBindAt
 * 对应的binding包含的watcher的update方法就会触发
 * 执行watcher的cb回调
 * $watcher调用，是自己定义的回调函数
 * directive的_update对应各自更新方法，文本节点就是nodeValue
 */
Watcher.prototype.update = function () {
  if (!batcher.isFlushing) {
    batcher.push(this)
  } else {
    setTimeout(() => {
      batcher.push(this)
    })
  }
}

/**
 * 调用属性getter前，打开开关
 */
Watcher.prototype.beforeGet = function () {
  Observer.emitGet = true
  this.vm._activeWatcher = this
}




