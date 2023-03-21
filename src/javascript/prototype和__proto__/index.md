---
nav:
    path: '/javascript'
    title: 'javascript'
    order: 2
group:
    path: '/'
    title: 'javascript'
title: 'prototype和__proto__'
order: 0
---

-   `__proto__` 是对象的一个私有属性，用来访问该对象的原型对象
-   `prototype` 是函数特有的一个属性，当该函数是一个构造函数时，指的是实例化对象的原型

    ```js
    const People = function() {};
    const xiaoMing = new People();

    xiaoMing.__proto__ === People.prototype; // true
    ```

-   在 js 里面，函数也是一个对象，因此函数也有 `__proto__` 属性。<br />
    面试官问我，函数的 `__proto__` 指向谁，当时我没回答上来，回家后我想，
    那应该是这个函数的原型，而函数都是由构造函数 `Function` 创建出来的，所以我推论函数的 `__proto__` 指向造函数 `Function` 的 `prototype`

    ```js
    const People = function() {};

    People.__proto__ === Function.prototype; // true 哈哈我的推论是对的
    ```
