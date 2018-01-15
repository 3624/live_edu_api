//5.左侧内容区Tab切换
$(document).ready(function(){
	var courseUrl = "http://live.bobcheng.space/my_live";
	var courselist = document.getElementById("courselist");
	var courselistOuter = document.getElementById("courselistOuter");
	var tabs = document.getElementById("coursebdNav").getElementsByTagName("a");
	//var identity = "teacher";
	//var usrName = "jiarenqi";
	var identity =sessionStorage.getItem("localIdentify");
	var usrName = sessionStorage.getItem("localName");
	var helloContent ='<li><a    href="/" id="usrHello" >你好，'+usrName+'</a></li>';
	$("#usrHello").html(helloContent);


	//鼠标移入
	var mouseenterHandler = function(event){
		//鼠标移入删除区域
		var divX = 0;
		var divY = 0;
		event = event || window.event;
		var target = event.target || event.srcElement;  
		var courseAreaNode = document.getElementById("courseArea"); 
		divX = this.offsetLeft + this.clientWidth;
		divY = this.offsetTop; 
		var parantWidth=this.offsetParent.clientWidth;

		var dataset = util.getElementDataSet(this);

		var detailNode = createdetailCourseElement(dataset); 
		//左右适应
			var flagProcessingwidth = true;
			if (parentWidth >= 980) {

				if (dataset.index % 4 == 0) {
					detailNode.style.left = (parentWidth - this.offsetLeft) + 'px';
					flagProcessingwidth = false;
				} else if (dataset.index % 4 == 3) {
					flagProcessingwidth = false;
				}
			} else if (parentWidth <= 735) {

				if (dataset.index % 3 == 0) {
					flagProcessingwidth = false;
				}
			}


		if(flagProcessingwidth){
			detailNode.style.left = (divX + 20) + "px";
		}
		detailNode.style.top = divY + "px";
		courselistOuter.appendChild(detailNode);
	}
	//鼠标移出
	var mouseleaveHandler = function(event){
		var dataset = util.getElementDataSet(this);
		var detailNode = document.getElementById("suspend_course-"+dataset.id);
		courselistOuter.removeChild(detailNode);
	}

	//创建课程
	var createCourseElement = function(ctype,videoList,dataObj,i){
		var timestamp = Date.parse(new Date())/1000;
		console.log(timestamp);
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
		if(timestamp < dataObj[i].startTime){
			state = "未开始";
		}			
		else if(timestamp >= dataObj[i].startTime && timestamp <= dataObj[i].endTime){
			state = "正在进行";
		}			
		else if(timestamp > dataObj[i].endTime){
			state = "已结束";
		}	
		if(ctype==50 || ctype==30){
			var videoEl = {
			videoUrl: dataObj[i].videoUrl,
			picture: dataObj[i].imgUrl,
			name: dataObj[i].name,
			hostName: "主讲人："+ dataObj[i].hostName,
		    classState:"可观看",
			describe: dataObj[i].info,
			startTime: "",
			endTime:"",
			}
		}else if(ctype == 40){
			var onlineUrl = dataObj[i].videoUrl+'/1';
			var videoEl = {
			videoUrl: onlineUrl,
			picture: dataObj[i].imgUrl,
			name: dataObj[i].name,
			hostName: "邀请码: "+dataObj[i].joinCode,
		    classState:state,
			describe: dataObj[i].info,
			startTime: "开始时间："+timetrans(dataObj[i].startTime),
			endTime:"结束时间："+timetrans(dataObj[i].endTime),
			};
			console.log(onlineUrl);
		}
		else{
			var videoEl = {
			videoUrl: dataObj[i].videoUrl,
			picture: dataObj[i].imgUrl,
			name: dataObj[i].name,
			hostName: "主讲人："+ dataObj[i].hostName,
		    classState:state,
			describe: dataObj[i].info,
			startTime: "开始时间："+timetrans(dataObj[i].startTime),
			endTime:"结束时间："+timetrans(dataObj[i].endTime),
			};
		}
		
		var list = videoList.list;
		list.push(videoEl);
	}
	var go = function(ctype){
		//var videoType = "live";
		var videoList = {
				list:[]
			};
		var list = videoList.list;
		//ctype = 40;
		var videoType = "";
		var getVideoUrl ="http://live.bobcheng.space/video_history";
		if(ctype == 10){
			videoType = "live";
		}
		else if(ctype == 20){
			videoType = "playback";
		}
		else if(ctype == 30){
			videoType = "video";
		}
		else if(ctype == 40){
			videoType = 'live';
			getVideoUrl = "http://live.bobcheng.space/my_live";
		}
		else if(ctype == 50){
			videoType = 'video';
			getVideoUrl = "http://live.bobcheng.space/my_video";
		}
		console.log(ctype);
		console.log(getVideoUrl);
		//var usrid = "jiarenqi";
		var livePost = new FormData();    
        livePost.append( 'id', usrName);
        livePost.append( 'currentPage', '1');
		livePost.append( 'itemsPerPage', '20');
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
				var videos = data.videos;
				for(i=0;i < videos.length;i++){
					createCourseElement(ctype,videoList,videos,i);
				}
				var html = template("template-courselist",videoList);
				document.getElementById('courselist').innerHTML=html;
				
			},
			error: function(){

			},
		})
	};
	if(identity == "teacher"){
		var a = $("#coursebdNav");
		a.append('<li><a href="#" id="40" >我的直播</a></li>');
		a.append('<li><a href="#" id="50" >我的点播</a></li>');
	}
	util.forEach(tabs, function(item){
		util.addEventListener(item, "click", function(event){
			util.preventDefault(event);
			var target = event.target ;
			util.forEach(tabs, function(item){
				if(item.className === "z-crl"){
					util.removeClass(item, "z-crl");
					return ;
				}	
			});
			util.addClass(target, "z-crl");
			ctype = target.id;
			go(ctype || 10);//如果获取不到默认为10
		})
	});
	util.triggerEventListener(tabs[0], "click");
});

//顶部
$(document).ready(function(){
	
});




