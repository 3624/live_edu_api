(function(){
	util.ready(function(){
		var ui =document.getElementById("hello");
		ui.style.display="none";
	})

	util.ready(function(){
					var createliveElement = function(videoList,dataObj,i){
						var livelist = {
							video_link: dataObj[i].video_link,
							img_url: dataObj[i].img_url,
							title:dataObj[i].title,
						};
						var list = videoList.list;
						list.push(livelist);
	    			};
		$.ajax({
			url: 'http://live.bobcheng.space/slides', //请求的api地址，这里请求的是sign_in这个api
			//data: fd, // 放进刚刚设置的formdata类型的数据
			processData: false,
			contentType: false,
			type: 'GET',
			async: false,
			xhrFields: {
				withCredentials: true, //用来开启cookies
			},
			//请求成功的回调函数，result数据类型已经是json对象，处理的时候按照处理json对象的方法获取里面的数值
			success: function(result){
				var data = result.data;
				var status = result.status;
				var imgs = data.imgs
				var videoList ={
					list:[]
				};
				if(status === true){

					for(i=imgs.length-1;i>=imgs.length-3;i--){
						createliveElement(videoList,imgs,i);
					}
					console.log(videoList);

					var html = template("templateheadimg",videoList);
				   document.getElementById('headimg').innerHTML=html;

				}
				if(status === false){
						alert(result.error);
				}
							
			},
			error:function(result){
				alert('error');
				//alert('账号或密码错误!');
			},
		});
	});
	//2.关于网易产品 、 登陆
	util.ready(function(){
			if(sessionStorage&&sessionStorage['localName']){
				var u1 =document.getElementById("zhuce2");
				u1.style.display="none";
				var u2 =document.getElementById("denglu2");
				u2.style.display="none";
				var ui =document.getElementById("hello");
				ui.style.display="";
				var mi =document.getElementById("home");
				//console.log(mi.innerHTML);
				mi.innerHTML="hello,"+sessionStorage.getItem('localName');
                var outi =document.getElementById("logout");
                outi.innerHTML="退出登录";
				
			}
			var loginModal = document.getElementById("login");
			//var closeLoginModal = document.getElementById("closeLoginModal");
			var loginUserName = document.getElementById("loginUserName");
			var loginPassword = document.getElementById("loginPassword");
			var loginSubmit = document.getElementById("loginSubmit");
			//var loginUrl = "http://study.163.com/webDev/login.htm";
			//var guanzhuUrl = "http://study.163.com/webDev/attention.htm";
			/**
			 * 检测登陆的表单验证
			 * @return {[type]} [description]
			 */
			var validateLoginForm = function(){
				var _flag = true;
				if(loginUserName.value.length <= 0){
					_flag = false;
					util.addClass(loginUserName, "error");
					alter('请输入用户名');
				}else if (loginPassword.value.length <= 0){
					_flag = false;
					util.addClass(loginPassword, "error");
					alter('请输入密码');
				}
				return _flag;
			}
			util.addEventListener(loginUserName, "input",function(event){
				util.removeClass(loginUserName, "error");
			});

			util.addEventListener(loginPassword, "input",function(event){
				util.removeClass(loginPassword, "error");
			});

			
			util.addEventListener(loginSubmit, "click",function(event){
				util.preventDefault(event);
				if(validateLoginForm()){
					var usrID = $("#loginUserName").val();
					var usrPassword = $("#loginPassword").val();
					var fd = new FormData();
					fd.append( 'id', usrID);
					fd.append( 'password', usrPassword);
					$.ajax({
						url: 'http://live.bobcheng.space/sign_in', //请求的api地址，这里请求的是sign_in这个api
						data: fd, // 放进刚刚设置的formdata类型的数据
						processData: false,
						contentType: false, 
						type: 'POST',
						xhrFields: {
							withCredentials: true, //用来开启cookies
						},
						//请求成功的回调函数，result数据类型已经是json对象，处理的时候按照处理json对象的方法获取里面的数值
						success: function(result){
							var data = result.data;
							var status = result.status;
							//console.log(data.username);
							if(status === true){
								alert('登录成功');
								var ui =document.getElementById("hello");
									ui.style.display="";
									var mi =document.getElementById("home");
									//console.log(mi.innerHTML);
									mi.innerHTML="hello,"+data.username;
                                	var outi =document.getElementById("logout");
                                	outi.innerHTML="退出登录";

								var u1 =document.getElementById("zhuce2");
									u1.style.display="none";
								var u2 =document.getElementById("denglu2");
									u2.style.display="none";
								$("button.close[data-dismiss='modal']").click()
								//var u3 =document.getElementById("login");
								sessionStorage.setItem("localName",data.username);
								sessionStorage.setItem("localIdentify",data.identity);
								//localStorage.setItem("localRealName","data.realname");
								console.log(sessionStorage);
								

							}
							if(status === false){
							  	alert(result.error);
							}
							
						},
						error:function(result){ 
						 	alert('error');
							//alert('账号或密码错误!');					
						},  
					});
				}
			});
		//}
	});
//3.关于注册
	util.ready(function(){
			var registerModal = document.getElementById("register");
			//var closeLoginModal = document.getElementById("closeLoginModal");
			var registerUserName = document.getElementById("registerUserName");
			var registerRealName = document.getElementById("registerRealName");
			var registerPassword = document.getElementById("registerPassword");
			//var registerregisterPassword2 = document.getElementById("registerPassword2");
			var registerEmail = document.getElementById("registerEmail");
			var registeridentify=document.getElementsByName("identify");
			var registerSubmit = document.getElementById("registerSubmit");
			//var registerUrl = "http://study.163.com/webDev/login.htm";
			//var guanzhuUrl = "http://study.163.com/webDev/attention.htm";
			/**
			 * 检测登陆的表单验证
			 * @return {[type]} [description]
			 */
			var validateregisterForm = function(){
				var _flag = true;
				if(registerUserName.value.length <= 0){
					_flag = false;
					util.addClass(registerUserName, "error");
					alert('请填写用户名');
				}else if(registerRealName.value.length <= 0){
					_flag = false;
					util.addClass(registerRealName, "error");
					alert('请填写真实姓名');
				}
				else if (registerPassword.value.length <= 5){
					_flag = false;
					util.addClass(registerPassword, "error");
					alert('密码长度不够');
				}
				else if (registerEmail.value.length <= 0){
					_flag = false;
					util.addClass(registerEmail, "error");
					alert('请填写email');
				}

				return _flag;
			}
			util.addEventListener(registerUserName, "input",function(event){
				util.removeClass(registerUserName, "error");
			});

			util.addEventListener(registerPassword, "input",function(event){
				util.removeClass(registerPassword, "error");
			});
			util.addEventListener(registerRealName, "input",function(event){
				util.removeClass(registerRealName, "error");
			});
			util.addEventListener(registerEmail, "input",function(event){
				util.removeClass(registerEmail, "error");
			});


			
			util.addEventListener(registerSubmit, "click",function(event){

				if(validateregisterForm()){
					var usrID = $("#registerUserName").val();
					var usrName=$("#registerRealName").val();
					var usrPassword = $("#registerPassword").val();
					var email=$("#registerEmail").val();
					var identity=$("input[name='identify']:checked").val()
					var fd = new FormData();
					fd.append( 'id', usrID);
					fd.append('realName',usrName);
					fd.append('email',email);
					fd.append('password', usrPassword);
					fd.append('identity',identity);

					$.ajax({
						url: 'http://live.bobcheng.space/sign_up', //请求的api地址，这里请求的是sign_in这个api
						data: fd, // 放进刚刚设置的formdata类型的数据
						processData: false,
						contentType: false, 
						type: 'POST',
						xhrFields: {
							withCredentials: true, //用来开启cookies
						},
						//请求成功的回调函数，result数据类型已经是json对象，处理的时候按照处理json对象的方法获取里面的数值
						success: function(result){
							var data = result.data
							var status = result.status;
							if(status === true){
								sessionStorage.setItem("localName",data.username);
								sessionStorage.setItem("localIdentify",data.identity);
								//localStorage.setItem("localRealName","data.realname");
								alert('注册成功');
								var ui =document.getElementById("hello");
									ui.style.display="";
									var mi =document.getElementById("home");
									//console.log(mi.innerHTML);
									mi.innerHTML="hello,"+data.username;
                                	var outi =document.getElementById("logout");
                                	outi.innerHTML="退出登录";
								var u1 =document.getElementById("zhuce2");
									u1.style.display="none";
								var u2 =document.getElementById("denglu2");
									u2.style.display="none";
								$("button.close[data-dismiss='modal']").click()
							}
							if(status === false){
								alert(result.error);
							}
							
						},
						error:function(){   
						alert('errorregister');
						},  
					});
				}
			});
		//}
	});
	//5.左侧内容区Tab切换
	 util.ready(function(){
	 	var courseUrl = "http://live.bobcheng.space/my_live";
		// var livecourselist = document.getElementById("live");
		// var videocourselist = document.getElementById("video");
		// var backcourselist = document.getElementById("back");
		var createliveElement = function(videoList,dataObj,i){
			var timestamp = Date.parse(new Date())/1000;
		//console.log(timestamp);
			var state;
			function timetrans(date){
			var date = new Date(date*1000);//如果date为13位不需要乘1000
			var Y = date.getFullYear() + '-';
			var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
			var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
			var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
			var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
			var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
			return Y+M+D+h+m+s;
		}
			var livelist = {
				address: dataObj[i].videoUrl,
				picture: dataObj[i].imgUrl,
				name:dataObj[i].name,
				hostname: dataObj[i].hostName,
				describe: dataObj[i].info,
				endtime: timetrans(dataObj[i].startTime),
				starttime:timetrans(dataObj[i].endTime)
			};
			var list = videoList.list;
			list.push(livelist);
	    };
	  
		var go1 = function(){
			var pagenum=1;
			var videoType = "live";
			var videoList = {
					list:[]
			};
			var list = videoList.list;
		//ctype = 40;
		//var videoType = "";
			var getVideoUrl ="http://live.bobcheng.space/main_page_videos";
		// console.log(ctype);
		// console.log(getVideoUrl);

		//var usrid = sessionStorage;
			var livePost = new FormData();    
        //livePost.append( 'id', 'zzj1');
        	livePost.append( 'currentPage', pagenum);
			livePost.append( 'itemsPerPage', '5');
			livePost.append( 'videoType', videoType);
			$.ajax({
				url:  getVideoUrl,
				data: livePost,
				type: 'POST',
				processData: false,
				contentType: false,
				xhrFields: {
					withCredentials: true,
				},
				success: function(result){

					var data = result.data;
					//console.log(data.);
					var videos = data.videos;
					for(i=0;i < videos.length;i++){
						createliveElement(videoList,videos,i);
					}
					var html = template("templatelive",videoList);
					document.getElementById('live').innerHTML=html;
					var totalpage=Math.ceil(data.total/5);
					
					var curPage=data.PageNumber;
		
					var options = {
						bootstrapMajorVersion: 3,
						currentPage:curPage,
						totalPages:totalpage,
						itemTexts: function (type, page, current) {
	                        switch (type) {
	                            case "first":
	                                return "首页";
	                            case "prev":
	                                return "上一页";
	                            case "next":
	                                return "下一页";
	                            case "last":
	                                return "末页";
	                            case "page":
	                                return page;
	                        }
	                    },onPageClicked:function (event, originalEvent, type, page){
	                    	var livePost1 = new FormData();    
	        //livePost.append( 'id', 'zzj1');
	        				livePost1.append( 'currentPage', page);
							livePost1.append( 'itemsPerPage', '5');
							livePost1.append( 'videoType', videoType);
							//console.log(livePost1);
							$.ajax({
								url:  getVideoUrl,
								data: livePost1,
								type: 'POST',
								processData: false,
								contentType: false,
								xhrFields: {
								withCredentials: true,
							},
								success: function(result){
									var data = result.data;
									var videos = data.videos;
									var videoList = {
										list:[]
									};
									for(i=0;i < videos.length;i++){
										createliveElement(videoList,videos,i);
									}
									var html = template("templatelive",videoList);
									document.getElementById('live').innerHTML=html;
	                    		},
	                    		error:function(){
	                    			alert('liveerrorin');
	                    		}
	                    	});
						}

					};
					$('#liveoption').bootstrapPaginator(options);

				},
				error: function(){
					alert('liveerrorout');
				},
			});
	};go1();
});
	 util.ready(function(){
	 
		var createliveElement = function(videoList,dataObj,i){
            var timestamp = Date.parse(new Date())/1000;
            //console.log(timestamp);
            var state;
            function timetrans(date){
                var date = new Date(date*1000);//如果date为13位不需要乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
                var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
                return h+m+s;
            }
				var livelist = {
				address: dataObj[i].videoUrl,
				picture: dataObj[i].imgUrl,
				name:dataObj[i].name,
				hostname: dataObj[i].hostName,
				describe: dataObj[i].info,
				lengthtime: timetrans(dataObj[i].length)
			};
			var list = videoList.list;
			list.push(livelist);
	    };
	
	  
		var go2 = function(){
			var pagenum=1;
			var videoType = "playback";
			var videoList = {
					list:[]
			};
			var list = videoList.list;
		//ctype = 40;
		//var videoType = "";
			var getVideoUrl ="http://live.bobcheng.space/main_page_videos";
		// console.log(ctype);
		// console.log(getVideoUrl);

		//var usrid = sessionStorage;
			var livePost = new FormData();    
        //livePost.append( 'id', 'zzj1');
        	livePost.append( 'currentPage', pagenum);
			livePost.append( 'itemsPerPage', '5');
			livePost.append( 'videoType', videoType);
			$.ajax({
				url:  getVideoUrl,
				data: livePost,
				type: 'POST',
				processData: false,
				contentType: false,
				xhrFields: {
					withCredentials: true,
				},
				success: function(result){

					var data = result.data;
					//console.log(data.);
					var videos = data.videos;
					for(i=0;i < videos.length;i++){
						createliveElement(videoList,videos,i);
					}
					var html = template("templateback",videoList);
					document.getElementById('back').innerHTML=html;
					var totalpage=Math.ceil(data.total/5);
					
					var curPage=data.PageNumber;
		
					var options = {
						bootstrapMajorVersion: 3,
						currentPage:curPage,
						totalPages:totalpage,
						itemTexts: function (type, page, current) {
	                        switch (type) {
	                            case "first":
	                                return "首页";
	                            case "prev":
	                                return "上一页";
	                            case "next":
	                                return "下一页";
	                            case "last":
	                                return "末页";
	                            case "page":
	                                return page;
	                        }
	                    },onPageClicked:function (event, originalEvent, type, page){
	                    	var livePost1 = new FormData();    
	        //livePost.append( 'id', 'zzj1');
	        				livePost1.append( 'currentPage', page);
							livePost1.append( 'itemsPerPage', '5');
							livePost1.append( 'videoType', videoType);
							//console.log(livePost1);
							$.ajax({
								url:  getVideoUrl,
								data: livePost1,
								type: 'POST',
								processData: false,
								contentType: false,
								xhrFields: {
								withCredentials: true,
							},
								success: function(result){
									var data = result.data;
									var videos = data.videos;
									var videoList = {
										list:[]
									};
									for(i=0;i < videos.length;i++){
										createliveElement(videoList,videos,i);
									}
									var html = template("templateback",videoList);
									document.getElementById('back').innerHTML=html;
	                    		},
	                    		error:function(){
	                    			alert('backerrorin');
	                    		}
	                    	});
						}

					};
					$('#backoption').bootstrapPaginator(options);

				},
				error: function(){
					alert('backerrorout');
				},
			});
	};go2();
});
	util.ready(function(){
	 
		var createliveElement = function(videoList,dataObj,i){
            var timestamp = Date.parse(new Date())/1000;
            //console.log(timestamp);
            var state;
            function timetrans(date){
                var date = new Date(date*1000);//如果date为13位不需要乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
                var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes())+ ':';
                var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
                return h+m+s;
            }
				var livelist = {
				address: dataObj[i].videoUrl,
				picture: dataObj[i].imgUrl,
				name:dataObj[i].name,
				hostname: dataObj[i].hostName,
				describe: dataObj[i].info,
				lengthtime: timetrans(dataObj[i].length)
			};
			var list = videoList.list;
			list.push(livelist);
	    };
	 
	  
		var go3 = function(){
			var pagenum=1;
			var videoType = "video";
			var videoList = {
					list:[]
			};
			var list = videoList.list;
		//ctype = 40;
		//var videoType = "";
			var getVideoUrl ="http://live.bobcheng.space/main_page_videos";
		// console.log(ctype);
		// console.log(getVideoUrl);

		//var usrid = sessionStorage;
			var livePost = new FormData();    
        //livePost.append( 'id', 'zzj1');
        	livePost.append( 'currentPage', pagenum);
			livePost.append( 'itemsPerPage', '5');
			livePost.append( 'videoType', videoType);
			$.ajax({
				url:  getVideoUrl,
				data: livePost,
				type: 'POST',
				processData: false,
				contentType: false,
				xhrFields: {
					withCredentials: true,
				},
				success: function(result){

					var data = result.data;
					//console.log(data.);
					var videos = data.videos;
					for(i=0;i < videos.length;i++){
						createliveElement(videoList,videos,i);
					}
					var html = template("templatevideo",videoList);
					document.getElementById('video').innerHTML=html;
					var totalpage=Math.ceil(data.total/5);
					
					var curPage=data.PageNumber;
		
					var options = {
						bootstrapMajorVersion: 3,
						currentPage:curPage,
						totalPages:totalpage,
						itemTexts: function (type, page, current) {
	                        switch (type) {
	                            case "first":
	                                return "首页";
	                            case "prev":
	                                return "上一页";
	                            case "next":
	                                return "下一页";
	                            case "last":
	                                return "末页";
	                            case "page":
	                                return page;
	                        }
	                    },onPageClicked:function (event, originalEvent, type, page){
	                    	var livePost1 = new FormData();    
	        //livePost.append( 'id', 'zzj1');
	        				livePost1.append( 'currentPage', page);
							livePost1.append( 'itemsPerPage', '5');
							livePost1.append( 'videoType', videoType);
							//console.log(livePost1);
							$.ajax({
								url:  getVideoUrl,
								data: livePost1,
								type: 'POST',
								processData: false,
								contentType: false,
								xhrFields: {
								withCredentials: true,
							},
								success: function(result){
									var data = result.data;
									var videos = data.videos;
									var videoList = {
										list:[]
									};
									for(i=0;i < videos.length;i++){
										createliveElement(videoList,videos,i);
									}
									var html = template("templatevideo",videoList);
									document.getElementById('video').innerHTML=html;
	                    		},
	                    		error:function(){
	                    			alert('videoerrorin');
	                    		}
	                    	});
						}

					};
					$('#videooption').bootstrapPaginator(options);

				},
				error: function(){
					alert('videoerrorout');
				},
			});
	};go3();
});
})();
function logout(){
    var ui =document.getElementById("hello");
    ui.style.display="none";
    var u1 =document.getElementById("zhuce2");
    u1.style.display="";
    var u2 =document.getElementById("denglu2");
    u2.style.display="";
}

