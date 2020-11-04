(function (window) {
	'use strict';
	// 里面的变量都是局部变量,除非绑定在window上
	// 书写本地存储的存取方法
	window.storage = {
		getStorage(){
			// 获取本地存储,并转换为json对象
			return JSON.parse(window.localStorage.getItem('todos')||'[]');
		},
		setStorage(json){
			// 把传入的json对象转成json字符串,存入本地存储
			window.localStorage.setItem('todos',JSON.stringify(json));
		}
	}
	// 创建一个vue实例
	window.app = new Vue({
		el:".todoapp",
		data:{
			tasks:window.storage.getStorage(),
			newTask:"",
			isEditing:-1,
			status:true,
			count:0,
			flag:"",
		},
		methods:{
			remove(id){
				this.tasks = this.tasks.filter(task=>{
					return task.id!=id;
				})
				// 同步到本地存储中
				window.storage.setStorage(this.tasks);
			},
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
			},
			toggleAll(){
				this.tasks.forEach((task)=>{
					task.completed = this.status
				});
				this.status = !this.status
				// 同步到本地存储中
				window.storage.setStorage(this.tasks);
			},
			clearAll(){
				this.tasks = this.tasks.filter((task)=>{
					if(!task.completed){
						return true;
					}
				})
			},
			show(i){
				if(this.flag===""){
					return true;
				}else if(this.flag.completed===i){
					return true;
				}
			}
		},
		computed:{
			activeNum(){
				this.count = 0;
				this.tasks.forEach((task)=>{
					if(!task.completed){
						this.count++;
					}
				})
				return this.count;
			},
			isShow(){
				for(var i=0;i<this.tasks.length;i++){
					if(this.tasks[i].completed){
						return true;
					}
				}
				return false;
			},
			
		}
	})

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

})(window);