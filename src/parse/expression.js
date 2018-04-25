/**
 * date: 2018-04-24
 * author: llwcy8801
 */

/**
 * {根据path创建个通用的getter函数}
 * @param  [String] path 如"user.name"
 * @return [Function] Getter函数
 */
exports.complieGetter = function (path) {
    path = path.split('.')
    let body = 'if (o !== null)'
    let pathString = 'o'
    let key
    for (let i = 0; i < path.length - 1; i++) {
        key = path[i]
        pathString += `.${key}`
        body += `&& ${pathString} !== null`
    }
    key = path[path.length - 1]
    pathString += `.${key}`
    body += `) return ${pathString}`
    return new Function('o', body)
}