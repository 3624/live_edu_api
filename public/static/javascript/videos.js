//5.左侧内容区Tab切换
$(document).ready(function(){
	var courseUrl = "https://live.bobcheng.space/my_live";
	var courselist = document.getElementById("courselist");
	var courselistOuter = document.getElementById("courselistOuter");
	var tabs = document.getElementById("coursebdNav").getElementsByTagName("a");
	//var identity = "teacher";
	//var usrName = "jiarenqi";
	var identity =sessionStorage.getItem("localIdentify");
	var usrName = sessionStorage.getItem("localName");
	if(usrName == null){
		alert("您还没有登录，将跳转到主页。");
        window.location.href="/";
	}
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

	if(identity == "teacher"){
		var a = $("#coursebdNav");
		a.append('<li><a href="#" id="ii40" name="40">我的直播</a></li>');
		a.append('<li><a href="#" id="ii50" name="50">我的点播</a></li>');
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
			var ctype = target.name;
			go(ctype || 10);//如果获取不到默认为10
		})
	});
	util.triggerEventListener(tabs[0], "click");
});

var createCourseElement = function(ctype,videoList,dataObj,i){
    var timestamp = Date.parse(new Date())/1000;
    console.log(timestamp);
    var state, videostat;
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
    switch (dataObj[i].status){
        case 100:
            videostat = "可观看";
            break;
        case 20:
            videostat = "转码中";
            break;
        case 30:
            videostat = "转码失败";
            break;
        case 31:
            videostat = "转码超时";
            break;
        case 32:
            videostat = "上传超时 ";
            break;
        case 10:
            videostat = "上传中";
            break;
    }
    if(ctype==50 || ctype==30){
        var imgurl = dataObj[i].imgUrl;
        if(imgurl == null){
            imgurl = "http://bpic.588ku.com/element_origin_min_pic/01/35/36/78573bdff36d868.jpg";
        }
        var videoEl = {
            videoUrl: dataObj[i].videoUrl,
            picture:imgurl,
            name: dataObj[i].name,
            hostName: "上传者："+ dataObj[i].hostName,
            classState: videostat,
            describe: dataObj[i].info,
            startTime: "",
            endTime:"",
            videoID: dataObj[i].videoID,
            deleteTP: 'video',
            deleteMD: ctype==30? 'history':'data',
            group: ctype,
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
            videoID: dataObj[i].videoID,
            deleteTP: 'live',
            deleteMD: 'data',
            group: ctype,
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
            videoID: dataObj[i].videoID,
            deleteTP: ctype==10? 'live':'video',
            deleteMD: 'history',
            group: ctype,
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
    var getVideoUrl ="https://live.bobcheng.space/video_history";
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
        getVideoUrl = "https://live.bobcheng.space/my_live";
    }
    else if(ctype == 50){
        videoType = 'video';
        getVideoUrl = "https://live.bobcheng.space/my_video";
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
    });
};

function deletevideos(obj) {
    var group = obj.attributes["group"].value;
    if(group == 40 || group == 50){
    	if(!confirm("确定要删除该视频数据吗？")){
    		return;
		}
	}else {
        if(!confirm("确定要删除该观看历史记录吗？")){
            return;
        }
	}
    var livePost = new FormData();
    livePost.append( 'videoId', obj.attributes["value"].value);
    livePost.append( 'deleteType', obj.attributes["type"].value);
    livePost.append( 'id', sessionStorage.getItem("localName"));

    $.ajax({
        url:  "https://live.bobcheng.space/delete/" + obj.attributes["mode"].value,
        data: livePost,
        type: 'POST',
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true,
        },
        success: function(result){
            if(result.status == true){
            	alert("删除成功！");
				go(group);
			}else {
            	alert("删除失败:"+result.error);
			}

        },
        error: function(){

        },
    });
}

//顶部
$(document).ready(function(){
	
});




