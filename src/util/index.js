/**
 * 拼接好的字符串可以用Function的构造函数转化成可执行代码
 * @param {*} exp 
 * @param {*} scope 
 */
export const expToFunc = function (exp, scope) {
    // 把数据源绑定到函数的this，函数内部加上with(this){}，这样函数内的变量访问的就是数据源data上的key
    return new Function('with(this){return ' + exp + '}').bind(scope);
}