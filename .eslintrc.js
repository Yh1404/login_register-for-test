// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    "indent": ["error", 2],//使用2个空格缩进
    "eqeqeq": ["error", "always"],//使用恒等
    "semi": ["error", "always", { "omitLastInOneLineBlock": true }],//总是使用分号，忽略花括号在同一行（内容也就在同一行了）的语句块中的最后一个分号
    "no-alert": "error",//禁止使用alert，confirm，prompt
    "no-console": "error",//禁止使用console
    "arrow-parens": ["error", "always"],//箭头函数，总是使用圆括号
    "quotes": ["error", "double"],//总是使用双引号
    "object-shorthand": ["error", "always"],//对象字面量中方法和属性使用简写语法
    "generator-star-spacing": "off",//Generators 不会对*的前后添加空格做要求
    "no-var": "error",//不能使用var声明变量
    // allow debugger during development

    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  }
}