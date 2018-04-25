/**
 * date: 2018-04-23
 * author: llwcy8801
 */

// 批处理构造函数
function Batcher() {
    this.reset()
}

Batcher.prototype.reset = function () {
    this.has = {}
    this.queue = []
    this.waiting = false
}

Batcher.prototype.push = function (job) {
    if (!this.has[job.id]) {
        this.queue.push(job)
        this.has[job.id] = job
        if (!this.waiting) {
            this.waiting = true
            setTimeout(() => {
                // isFlushing, 此字段用来处理多重异步队列的问题
                this.isFlushing = true
                this.flush()
                this.isFlushing = false
            })
        }
    }
}

Batcher.prototype.flush = function () {
    this.queue.forEach((job) => {
        job.run()
    })
    this.reset()
}

module.exports = Batcher