// 解决图片报错问题
export const imgError = {
  inserted(el, options) {
    // el指令所绑定的元素，可以用来直接操作DOM
    // console.log(el)
    // 当图片赋值出错，给他一个默认图片
    el.onerror = function () {
      el.src = options.value;
    };
  },
};
export const focus = {
  inserted: function (el) {
    // 聚焦元素
    el.focus();
  },
};

// 属性名是key，函数是value
