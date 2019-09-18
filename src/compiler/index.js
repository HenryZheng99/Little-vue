import Watcher from '../watcher';
import { expToFunc } from 'util'
// Compiler
/**
 * 模板编译
 * @param {*} text 
 */
function textToExp (text) {
    let pieces = text.split(/({{.+?}})/g);
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
 * 结合 textToExp 和 expToFunc 来完成文本编译
 * 编译文本节点时，为这个文本节点创建一个Watcher，把它交给Watcher来更新
 * @param {*} node 
 * @param {*} scope 
 */
function compileText (node, scope) {
    let exp = textToExp(node.textContent);
    // Watcher绑定时会先编译一次，所以这里不需要再手动修改node.textContent
    new Watcher(exp, scope, (newVal) => {
        node.textContent = newVal;
    });
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
export default walkChildren;