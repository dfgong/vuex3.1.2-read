export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    // gongdf-利用mixin在beforeCreate钩子中实现store的注入
    // gongdf- 同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */
  // gongdf-实现store的注入，store为Store的一个实例
  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      // gongdf-第一级组件直接拿new Vue({store})中的store;
      this.$store = typeof options.store === 'function'
        ? options.store()  // gongdf-传入一个返回store的函数也可以。
        : options.store
    } else if (options.parent && options.parent.$store) {
      // gongdf-之后的反复拿父级的并储存用来使用和传递。
      this.$store = options.parent.$store
    }
  }
}
