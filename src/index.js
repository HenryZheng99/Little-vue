import walkChildren from './compiler'
import observe from './observer'

// Vue
/**
 * 代理函数
 * 将options中的data、computed、methods挂载到Vue实例上
 * @param {*} options 
 */
// 
function proxy (options) {
    for (let prop in options.data) {
        Reflect.defineProperty(this, prop, {
            enumerable: true,
            configurable: true,
            get () {
                return this.$options.data[prop];
            },
            set (newVal) {
                this.$options.data[prop] = newVal;
            }
        })
    }
}
/**
 * 将所有部分组装(Observer，Compiler，Dep，Watcher)
 * Vue实例，用observer监听data，用compile编译el，compile过程中调用watcher实现el与data的绑定。
 * 通过Observer来监听自己的model的数据变化，通过Compile来解析编译模板指令（vue中是用来解析 {{}}），最终利用watcher搭起observer和Compile之间的通信桥梁
 * 达到数据变化 —>视图更新；视图交互变化（input）—>数据model变更双向绑定效果
 */
window.Vue = class Vue {
    constructor (options) {
        this.$data = options.data;
        this.$el = document.querySelector(options.el);
        observe(this.$data);
        proxy(this, options);
        walkChildren(this.$el, this.$data);
    }
}