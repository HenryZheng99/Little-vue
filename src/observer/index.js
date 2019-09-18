/*
 * @Author: 郑浩瀚
 * @Date: 2019-07-17 09:40:01
 * @LastEditors: 郑浩瀚
 * @LastEditTime: 2019-07-17 09:40:01
 * @Description: 
 */
import Dep from '../dependence';

// Observer
/**
 * 监听data，劫持数据
 * @param {*} data 
 */
function observe (data) {
    if (Object.prototype.toString.call(data) === '[object Object]') {//确保监听的对象是object
        for (let prop in data) {
            defineReactive(data, prop, data[prop]);
        }
    }
}
/**
 * 对对象的key进行监听
 * @param {*} obj 
 * @param {*} key 
 * @param {*} val 
 */
function defineReactive (obj, key, val) {
    const dep = new Dep();// 为每个key构造一个存放关心该key的订阅者的容器
    Reflect.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get () {
            // 依赖(watcher)收集
            // 如果target指向了Watcher，就把这个Watcher添加到Dep
            // Dep的addSub是一个Set，所以不会把一个相同的Watcher添加多次
            Dep.target && dep.addSub(Dep.target);
            return val;// 形成闭包
        },
        set (newVal) {
            // 依赖更新
            if (newVal === val) return;//值没有变化
            val = newVal;//修改闭包的值
            observe(newVal);//监听新的键值
            dep.notify();// 当key变化时通知该容器下的所有订阅者
        }
    });
    observe(val);//递归监听对象的键值
}

export default observe;