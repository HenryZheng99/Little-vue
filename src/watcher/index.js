import Dep from '../dependence'
import { expToFunc } from '../util';
// Watcher
/**
 * 订阅者Watcher
 * 在data中的数据改变的时候，重新触发对应的Compiler来对DOM进行更新
 * 原始表达式（exp）、数据源（scope）、DOM更新函数（callback）
 */
class Watcher {
    constructor (exp, scope, callback) {
        this.value = null;// 存放当前编译结果
        this.getValue = expToFunc(exp, scope);// 生成编译结果的函数
        this.callback = callback;
        this.update();// 绑定时需要编译一次
    }
    get () {
        Dep.target = this;// 编译前把target指向当前Watcher实例
        let value = this.getValue();// 这个编译过程中会触发关联的key的getter
        Dep.target = null;// 编译后把target重置
        return value;
    }
    update () {
        let newVal = this.get();// 获取最新编译结果
        if (this.value !== newVal) {// 如果最新编译结果和当前的不一样，则调用callback更新DOM
            this.value = newVal;
            this.callback && this.callback(newVal);
        }
    }
}

export default Watcher;