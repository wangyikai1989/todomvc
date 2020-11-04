# TodoMvc
## 一 项目结构
+ css
  + app.css:css文件
+ js
  + app.js:写代码
+ .editorconfig:对编辑器的设置
+ .gitattributes:对git的设置
+ .gitignore:git的忽略文件配置
+ package.json:项目描述
  + 使用npm install下载项目依赖包
  + 下载完成多了一个node_modules文件夹
+ index.html:html文件

## 二 项目功能描述
+ 展示任务
+ 添加任务
+ 删除任务
+ 编辑任务
+ 切换任务完成状态
+ 批量切换任务状态
+ 清除已完成的任务
+ 隐藏/显示清除按钮
+ 显示未完成任务数量
+ 切换不同任务的显示
  + 点击按钮
  + 改变路由
+ 数据同步到本地存储中

## 三 功能思路
+ 选择使用vue来使用这个项目:引入vue,在引入app.js之前
+ 展示任务容器:ul.todo-list>li
+ 添加任务:input.new-todo,enter触发
+ 删除任务:button.destroy点击触发
+ 编辑任务:div.view>lable双击触发
+ 切换任务完成状态:input.toogle-all点击触发
+ 批量切换任务完成状态:lable.toggle-all点击触发
+ 清除已完成的任务:button.clear-completed点击触发
+ 隐藏/显示清除按钮:通过v-if实时控制button.clear-completed的显示和隐藏
+ 显示未完成任务数量:todo-count>strong通过v-text实时设置数量
+ 切换不同任务的显示:通过监控路由切换到不同人物的显示
+ 数据同步到本地存储中:书写两个方法,一个存入本地,一个从本地存储取出

## 四 书写本地存储的存取方法
> 村相互的任务集合是一个数组,每个人物是一个对象,任务对象的格式如下:

```js
{
    title:"任务名称",
    completed:true/false,
    id:"当前时间戳"
}
```

> 定义一个storage对象,里面放关于本地存取的方法

```js
window.storage = {
    getStorage(){
        // 获取本地存储,并转换为json对象
        return JSON.parse(window.localStorage.getItem('todos'||'[]'));
    },
    setStorage(json){
        // 把传入的json对象转成json字符串,存入本地存储
        window.localStorage.setItem('todos',JSON.stringify(json));
    }
}
```

## 五 展示任务
```html
<ul class="todo-list">
    <!-- 编辑添加`editing`类名,已完成添加`completed`类名 -->
    <li v-for="task in tasks" :class="completed:task.completed">
        <div class="view">
            <input class="toggle" type="checkbox" checked>
            <label>{{task.tatle}}</label>
            <button class="destroy"></button>
        </div>
        <input class="edit" value="Create a TodoMVC template">
    </li>
    
</ul>
```

```js
// 创建一个vue实例
	window.app = new Vue({
		el:".todoapp",
		data:{
			tasks:window.app.getStorage();
		}
    })
```

## 六 添加任务
```js
data:{
    newTask:""
},
methods:{
    add(){
        var task = {
            title:this.newTask,
            completed:false,
            id:Date.now()
        }
        this.tasks.push(task);
        // 输入完成后,清空文本框
        this.newTask = ""
        // 同步到本地存储中
        window.storage.setStorage(this.tasks);
    }
}
```

```html
<input class="new-todo" placeholder="What needs to be done?" autofocus v-model="newTask" @keyup.enter="add">
```

## 七 编辑任务

```js
data:{
    isEditing:-1
}
```

```html
<li v-for="task in tasks" :class="{completed:task.completed,editing:isEditing==task.id}">
    <div class="view">
        <input class="toggle" type="checkbox" checked>
        <label
            @dblclick="isEditing=task.id"
        >{{task.title}}</label>
        <button class="destroy"></button>
    </div>
    <input class="edit" v-model="task.title"
        @keyup.enter="isEditing=-1"
        @blur="isEditing=-1"
    >
</li>
```

## 八 删除任务
```js
remove(id){
    this.tasks = this.tasks.filter(task=>{
        return task.id!=id;
    })
    // 同步到本地存储中
    window.storage.setStorage(this.tasks);
},
```

```html
<button class="destroy" @click="remove(task.id)"></button>
```

## 九 切换任务完成状态
```html
<input class="toggle" type="checkbox" v-model="task.completed">
```

## 十 批量切换任务状态
```html
<label for="toggle-all" @click="toggleAll">Mark all as complete</label>
```

```js
// 在data里面添加一个status
data:{
    status:true
}
// 在methods里面添加一个toggleAll方法
toggleAll(){
    this.tasks.forEach((task)=>{
        task.completed = this.status
    });
    this.status = !this.status
    // 同步到本地存储中
    window.storage.setStorage(this.tasks);
}
```

## 十一 显示未完成任务数量
```html
<span class="todo-count"><strong v-text="activeNum"></strong> item left</span>
```

```js
data:{
    count:0
}
computed:{
    activeNum(){
        this.count = 0;
        this.tasks.forEach((task)=>{
            if(!task.completed){
                this.count++;
            }
        })
        return this.count;
    }
}
```

## 十二 清除已完成的任务
```html
<button class="clear-completed" @click="clearAll">Clear completed</button>
```

```js
clearAll(){
    this.tasks = this.tasks.filter((task)=>{
        if(!task.completed){
            return true;
        }
    })
}
```

## 十三 隐藏/显示清除按钮
```html
<button class="clear-completed" @click="clearAll" v-if="isShow">Clear completed</button>
```
```js
isShow(){
    for(var i=0;i<this.tasks.length;i++){
        if(this.tasks[i].completed){
            return true;
        }
    }
    return false;
}
```

## 十四 切换不同任务的显示
> 点击all/active/complete可以切换不同任务的显示
> 在浏览器地址栏输入：#/或者#/active或者#/completed可以切换不同任务的显示
> 是做点击事件还是监控路由
> 只要监控了路由，a标签点击会自动切路由，就也能切换不同任务的显示
> 监控路由的事件：window.onhashchange = function(){}

> 切换按钮的高亮状态
```html
<ul class="filters">
    <li>
        <a :class="{selected:flag===''}" href="#/">All</a>
    </li>
    <li>
        <a href="#/active" :class="{selected:flag.completed===false}">Active</a>
    </li>
    <li>
        <a href="#/completed" :class="{selected:flag.completed===true}">Completed</a>
    </li>
</ul>
```

```js
data:{
    flag:""
}

// 监控路由的变化
	window.onhashchange = function(){
		// console.log(location.hash)
		if(location.hash=='#/active'){
			window.app.flag = {completed:false};
			return;
		}else if(location.hash=="#/completed"){
			window.app.flag = {completed:true};
			return;
		}else{
			// 如果是其他路由,都显示全部任务
			window.app.flag = "";
			return;
		}
	}
```
> 切换对应的任务显示
```html
<li v-for="task in tasks" :class="{completed:task.completed,editing:isEditing==task.id}" v-if="show(task.completed)">
```

```js
show(i){
    if(this.flag===""){
        return true;
    }else if(this.flag.completed===i){
        return true;
    }
}
```