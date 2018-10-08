// 自己定义一个 log 函数
var log = console.log.bind(console)

// 用自己实现的 e 替代 document.querySelector
var e = function(selector) {
    var element = document.querySelector(selector)
    if (element === null) {
        var s = `元素没有找到, 选择器 ${selector} 不对或者 js 没有放在 body 里面`
        alert(s)
    } else {
        return element
    }
}



var todoDemo = function() {
    // 插入 todo 和删除 todo 的时候需要保存数据
    var saveTodo = function(todos, todo) {
        todos.push(todo)
        var s = JSON.stringify(todos)
        localStorage.savedTodos = s
    }

    //用一个 todo 数据生成 html 模板，方便插入到页面中
    var templateTodo = function(todo) {
        var t = `
            <div class="todo-cell">
                <span class="todo-done button">完成</span>
                <span class="todo-delete button">删除</span>
                <span contenteditable="true">${todo}</span>
            </div>
        `
        return t
    }

    //点击删除按钮的时候，把localstorage里面的todo删除
    //并且删除页面中的.
    var deleteTodo = function(container, todoCell) {
        // 1. 找到这个 todo 在 container 里面的下标
        for (var i = 0; i < container.children.length; i++) {
            var cell = container.children[i]
            if (cell === todoCell) {
                log('删除 cell, 找到下标', i)
                // 1. 删除这个 cell dom
                todoCell.remove()
                // 2. 删除保存在 localStorage 里面的对应下标的数据
                var todos = loadTodos()
                // 删除数组中的指定下标的元素的方法如下
                // splice 函数可以删除数组的某个下标
                // 第一个参数是要删除的元素的下标
                // 第二个参数是要删除的元素的个数, 只删除一个, 所以这里是 1
                todos.splice(i, 1)
                // 删除之后, 要保存到 localStorage 中
                var s = JSON.stringify(todos)
                localStorage.savedTodos = s
            }
        }
    }

    // 载入所有存储在 localStorage 中的 todo
    //第一次载入页面的时候执行
    var loadTodos = function() {
        var s = localStorage.savedTodos
        // 第一次打开的时候, 还没有存储这个数据, s 是 undefined
        if (s === undefined) {
            return []
        } else {
            var ts = JSON.parse(s)
            return ts
        }
    }

    // 把所有 todo 插入到页面中
    var insertTodos = function(todos) {
        // 添加到 container 中
        var todoContainer = e('#id-div-container')
        for (var i = 0; i < todos.length; i++) {
            var todo = todos[i]
            var t = templateTodo(todo)
            todoContainer.insertAdjacentHTML('beforeend', t)
        }
    }

    // 在add按钮上绑定事件：点击add按钮时，执行回调函数
    var bindEventAdd = function() {
        var todos = loadTodos() //（loadTodos相当于浏览器中的一个全局变量)
        // 给 add button 绑定添加 todo 事件
        // 1. 获取一个 input 元素
        // 2. 用 input.value 获取用户输入的字符串
        var addButton = e('#id-button-add')
        addButton.addEventListener('click', function() {
            // 获得 input.value
            var todoInput = e('#id-input-todo')
            var todo = todoInput.value
            // 添加的时候存储到 localStorage 中
            saveTodo(todos, todo)
            // 添加到 container 中
            var todoContainer = e('#id-div-container')
            var t = templateTodo(todo)
            todoContainer.insertAdjacentHTML('beforeend', t)
        })
    }

    //绑定事件委托：点击 完成 和 删除 按钮时，执行回调函数
    var bindEventDelegate = function() {
        var todoContainer = e('#id-div-container')
        // 通过 event.target 的 class 来检查点击的是什么
        todoContainer.addEventListener('click', function(event) {
            var target = event.target
            // 得到被点击元素之后, 通过查看它的 class 来判断是哪个按钮
            if (target.classList.contains('todo-done')) {
                log('done')
                // 给 doto div 开关一个状态 class
                // parentElement 是找到父元素
                var todoDiv = target.parentElement
                // toggleClass(todoDiv, 'done')
                todoDiv.classList.toggle('done')
            } else if (target.classList.contains('todo-delete')) {
                log('delete')
                var todoDiv = target.parentElement
                // todoDiv.remove()
                // 获取 container
                // var container = todoDiv.parentElement
                deleteTodo(todoContainer, todoDiv)
            }
        })
    }

    var bindEvents = function(/*todos*/) {
        bindEventAdd(/*todos*/)
        bindEventDelegate()
    }

    var todoMain = function() {
        // 页面载入的时候，从 logcalstorage 中获取 todo 数据
        // 并赋值给 todos 变量
        var todos = loadTodos()

        // 把 todos 作为参数传给 bindEventAdd
        bindEvents()
        insertTodos(todos)
    }
    todoMain()
}

var __main = function() {
    todoDemo()
}

__main()
