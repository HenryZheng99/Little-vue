/**
 * Dep
 * 为每个key构造一个依赖收集器 sub。
 * 这个容器（Dependence）需要能够接受这个key的数据变动事件，
 * 然后通知给关心该事件的所有订阅者（Subscription）
 * 解耦
 */
class Dep {
    constructor () {
        this.subs = new Set();
    }
    addSub (sub) {// 添加订阅者，因为用了Set，所以这里可以保证添加进来的订阅者不会重复
        this.subs.add(sub);
    }
    removeSub (sub) {// 删除订阅者
        this.subs.delete(sub);
    }
    notify () {// 通知所有订阅者（调用每个订阅者的update方法）
        for (let sub of this.subs) {
            sub.update();
        }
    }
}
Dep.target = null;

export default Dep;