/**
 * date: 2018-04-23
 * author: llwcy8801
 */

exports.parse = function (s) {
    let dirs = []
    if (s.indexOf(':') !== -1) {
        // 属性指令 data-id:user.id
        let ss = s.split(':')
        dirs.push({
            raw: s,
            arg: ss[0],
            expression: ss[1]
        })
    } else {
        // 文本指令
        dirs.push({
            raw: s,
            expression: s
        })
    }

    return dirs
}