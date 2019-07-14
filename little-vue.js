// Observer
/**
 * 监听data
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
            // 如果target指向了Watcher，就把这个Watcher添加到Dep
            // Dep的addSub是一个Set，所以不会把一个相同的Watcher添加多次
            Dep.target && dep.addSub(Dep.target);
            return val;
        },
        set (newVal) {
            if (newVal === val) return;
            val = newVal;
            observe(newVal);//监听新的键值
            dep.notify();// 当key变化时通知该容器下的所有订阅者
        }
    });
    observe(val);//递归监听对象的键值
}


/**
 * Dep
 * 为每个key构造一个容器。
 * 这个容器（Dependence）需要能够接受这个key的数据变动事件，
 * 然后通知给关心该事件的所有订阅者（Subscription）
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

// Compiler
/**
 * 模板编译
 * @param {*} text 
 */
function textToExp (text) {
    let pieces = text.split(/({{.+?}})/g);
    console.log(pieces);
    pieces = pieces.map(piece => {
        if (piece.match(/{{.+?}}/g)) {// {{}}内的代码，以js表达式输出
            piece = '(' + piece.replace(/^{{|}}$/g, '') + ')';
        } else {// {{}}外的代码，以字符串输出
            piece = '`' + piece.replace(/`/g, '\\`') + '`';// 需要对字符串中的`转义
        }
        return piece;
    });
    return pieces.join('+');
}
/**
 * 拼接好的字符串可以用Function的构造函数转化成可执行代码
 * @param {*} exp 
 * @param {*} scope 
 */
function expToFunc (exp, scope) {
    // 把数据源绑定到函数的this，函数内部加上with(this){}，这样函数内的变量访问的就是数据源data上的key
    return new Function('with(this){return ' + exp + '}').bind(scope);
}
/**
 * 传入一个DOM树和数据源，DOM树上的节点会被遍历并编译
 * @param {*} el 
 * @param {*} scope 
 */
function walkChildren (el, scope) {
    // el.childNodes获取到的是NodeList对象，先把它转化Array
    [].slice.call(el.childNodes).forEach(node => {
        if (node.nodeType === 3) {// 对文本节点编译并替换文本内容
            compileText(node, scope);
        } else if (node.nodeType === 1) {// 对元素节点则继续遍历
            walkChildren(node, scope);
        }
    });
}
/**
 * 结合 textToExp 和 expToFunc 来完成文本编译
 * 编译文本节点时，为这个文本节点创建一个Watcher，把它交给Watcher来更新
 * @param {*} node 
 * @param {*} scope 
 */
function compileText (node, scope) {
    let exp = textToExp(node.textContent);
    // Watcher绑定时会先编译一次，所以这里不需要再手动修改node.textContent
    new Watcher(exp, scope, newVal => {
        node.textContent = newVal;
    });
}

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

// Vue
/**
 * 为方便修改数据做的优化，设置代理函数
 * 例如vm.text = 'new value'
 * @param {*} vm 
 * @param {*} options 
 */
function proxy (vm, options) {
    for (let prop in options.data) {
        Reflect.defineProperty(vm, prop, {
            enumerable: true,
            configurable: true,
            get () {
                return vm.$data[prop];
            },
            set (newVal) {
                vm.$data[prop] = newVal;
            }
        })
    }
}
/**
 * 将所有部分组装(Observer，Compiler，Dep，Watcher)
 */
class Vue {
    constructor (options) {
        this.$data = options.data;
        this.$el = document.querySelector(options.el);
        observe(this.$data);
        proxy(this, options);
        walkChildren(this.$el, this.$data);
    }
}