(function(){
	//1.检测顶部通知条,实现点击X后关闭
	util.ready(function(){
		var cookiesObj = util.getCookies();
		var tipsElement = document.getElementById("tips");
		if(cookiesObj && cookiesObj.topclose){
			util.addClass(tipsElement, "f-dn");
		}else{
			var closeTips = document.getElementById("closeTips");
			util.addEventListener(closeTips, "click", function(event){
				util.preventDefault(event);
				var now = new Date();
				now.setFullYear(now.getFullYear()+1);
				util.setCookie({
					name: "topclose",
					value: "1",
					expires: now,
				})
				util.addClass(tipsElement, "f-dn");
			})
		};
	});


	//8.热门推荐
	util.ready(function(){
		var hotIntervalId;
		var hotNode = document.getElementById("rmph");

		//创建课程节点
		var createHotCrs = function(dataObj,i){
			var wrapHtml = ("<li>");
			wrapHtml += ("<img src=\"#{imgUrl}\">");
			wrapHtml += ("<h2>#{name}</h2>");
			wrapHtml += ("<span>#{startTime}</span>");
			wrapHtml += ("</li>");
			var tmpEl = document.createElement('div');
			tmpEl.innerHTML = wrapHtml.format(dataObj[i]);
			return tmpEl.childNodes[0];
		}
		//请求数据
/*		util.ajax({
			url: "https://live.bobcheng.space/main_page_videos",
			success: function(data){
				var hotCrsList = JSON.parse(data);
				util.forEach(hotCrsList, function(item){
					hotNode.appendChild(createHotCrs(item));
				});
			}
		});*/
		var hotPost = new FormData();    
        hotPost.append( 'currentPage', '1');
		hotPost.append( 'itemsPerPage', '10');
		hotPost.append( 'videoType', 'live');
		$.ajax({
			url:  "https://live.bobcheng.space/main_page_videos",
			data: hotPost,
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
					hotNode.appendChild(createHotCrs(videos,i));
				}
			},
			error: function(){

			},
		})
		//每5秒自动更换热点课程
		var switchHotFn = function(){
			//每次滚动的高度
			var _eachHeight=70; 
			var _top = 0,
				_timer;
			_timer = setInterval(function(){
				_top += 3;
				hotNode.style.marginTop = "-"+_top + 'px';
				if(_top > _eachHeight){
					clearInterval(_timer);

					//上一个结点
					var _onNode = hotNode.children[0]

					//重复滚动
					if(_onNode.nodeType == 1){
						hotNode.removeChild(_onNode);
						hotNode.appendChild(_onNode);
						hotNode.style.marginTop = "0px"; 
					}					
				}
			},30);


		}
		//轮播热点课程
		hotIntervalId = setInterval(switchHotFn, 5000); 

		//绑定mouseover事件
		util.addEventListener(hotNode,"mouseover",function(){
			clearInterval(hotIntervalId);
		});

		//绑定mouseout事件
		util.addEventListener(hotNode,"mouseout",function(){
			hotIntervalId = setInterval(switchHotFn, 5000); 
		});
	});

})();
