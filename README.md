# little-vue

## 遇到的问题

1. IE不兼容

   开发环境下打包可以正常运行，但生产环境下打包后的JS是用eval封装的，IE报错

2. 多个JS文件的执行顺序

   vue实例化的JS代码和little-vue的核心代码不在同个文件，需要配置webpack和html-webpack-plugin调整文件引入的顺序（实例化执行在后）

3. webpack打包后的变量如何暴露

   由于webpack打包后变量都是在局部的，不能访问到，比如说class Vue，要提升作用域（window）才能访问
4. 遇到过由于babel及其插件版本问题的报错，不知道原因，但复制了别人的webpack配置和依赖之后得以解决



## 使用

`npm run start` 开发环境

`npm run build` 生产环境