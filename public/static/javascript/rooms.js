

//创建房间

/*$(document).ready(function(){
	util.addEventListener(createRoom, "click", function(event){
		util.preventDefault(event);
		util.removeClass(roomModal,"f-dn");
	});
	util.addEventListener(closeRoomModal, "click", function(event){
		util.addClass(roomModal,"f-dn");
	});
	
});*/

/*$(document).ready(function(){
	var className = $("#className").val;
	var classInro = $("#classInro").val;
	var beginTime = $("#beginTime").val;
	var beginUTCTime = Date.parse(new Date(beginTime));
	beginUTCTime = beginUTCTime / 1000;
	var endTime = $("#endTime").val;
	var endUTCTime = Date.parse(new Date(endTime));
	endUTCTime = endUTCTime / 1000;
	switch(classType)
	{
	case "一对一课":
				maxStu = 1;
	  break;
	case "普通大班课":
				maxStu = 20;
	  break;
    case "互动小班课":
				maxStu = 10;
	  break;
	default:
				maxStu = 20;
	}
	var classType = $("input[name='classType']:checked").val();
	$("#createRoomSubmit").click(function(){
		//构造 formdata 类型的请求数据，实际上就是添加键值对，实战中的键（key）和值（value）需要从DOM树中的用户输入获取
		var fd = new FormData();    
		fd.append( 'id', 'jiarenqi');
		fd.append( 'title', className);
		fd.append( 'introduction', classIntro);
		fd.append( 'startTimeStap', beginUTCTime);
		fd.append( 'endTimeStap', endUTCTime);
		fd.append( 'classType', classType);
		fd.append( 'maxStu', maxStu);
		fd.append( 'image', $('#classPic')[0].files[0] ); //上传文件的操作
		$.ajax({
			url: 'http://live.bobcheng.space/build_room', //请求的api地址，这里请求的是sign_in这个api
			data: fd, // 放进刚刚设置的formdata类型的数据
			processData: false,
			contentType: false, 
			type: 'POST',
			xhrFields: {
				withCredentials: true, //用来开启cookies
			},
			//请求成功的回调函数，result数据类型已经是json对象，处理的时候按照处理json对象的方法获取里面的数值
			success: function(){
				alert('提交成功');
			},
			error:function(){     
 				alert('未提交成功');
			},  
		});
	});
})

//上传视频

$(document).ready(function(){
	util.addEventListener(upLoad, "click", function(event){
		util.preventDefault(event);
		util.removeClass(uploadModal,"f-dn");
	});
	util.addEventListener(closeUploadModal, "click", function(event){
		util.addClass(uploadModal,"f-dn");
	});
});


$(document).ready(function(){
	var uploader = new BJY.VideoUploader({
	mainElement: $('input[type="file"]'),
	ignoreError: true,
	name: '',
	multiple: true,
	getUploadUrl: function (data) {
		return $.ajax({
			url: 'http://live.bobcheng.space/upload_url',	//这里的地址对应于api的地址
			type: 'post',
			data: { //这里面的参数对应于api要求发送过来的参数。注意：已有的四个参数是必须的！
				//file_name: data.videoName, //上传视频的文件名保存在data.videoName,但是现在不使用默认的文件名作为点播视频的标题，改用用户自定义的标题。所以改为下面那行的方式。
				file_name:$("#upload-className").val(), //点播视频的标题
				definition: 1,  //点播视频的目标清晰度。目前暂时默认为1。前端实现的时候注意留点余地，方便功能扩展。			
				//其他要post的参数也是用类似的方法弄进来,下面可以自己加
				introduction:$("#upload-classIntro").val(),  //点播视频的简介
				id:'bobcheng_t'	//这里要改，改为当前用户的ID
			}
		})
		.then(function (response) {
			var result = response.data;
			return {
				id: result.video_id,
				url: result.upload_url
			};
		});
	},
	getResumeUploadUrl: function (data) {   //这个函数应该不用改
		return $.ajax({
			url: 'http://live.bobcheng.space/resume_upload_url',	//这里的地址对应于api的地址
			type: 'post',
			data: { //这里面的参数对应于api要求发送过来的参数
				video_id: data.uploadId
			}
		})
		.then(function (response) {
			var result = response.data;
			if (!result) {
				alert(response.msg);
				return;
			}
			return {
				fid: result.video_id,
				id: result.video_id,
				url: result.upload_url,
				uploaded: result.upload_size
			};
		});
	},
	onFileChange: function (files) {
		var currentFiles = uploader.currentFiles;
		if (!currentFiles.length) {
			return;
		}

		if (!uploader.validateFiles(currentFiles)) {
			uploader.reset();
			return;
		}
		var itemHTML = '<div class="item-list">'

		$.each(
			currentFiles,
			function (index, file) {
				itemHTML += '<div class="item">'
					+ '<span class="item-text item-upload-className">'
					//+ file.videoName	//改用 用户自定义的标题作为视频名
					+ $("#upload-className").val()	//这里是修改过后的
					+ '</span>'
					+ '<span class="item-text item-status">等待上传</span>'
					+ ' </div>';
				uploader.autoUpload(file);
			}
		);

		itemHTML += '</div>';
		$(itemHTML).insertAfter($('.bjy-demo'))
	},
	onUploadStart: function (data) {
		console.log('onUploadStart', data.fileItem);
	},
	onUploadProgress: function (data) {
		$('.item')
		.eq(data.fileItem.index)
		.find('.item-status').html('上传' + data.percent + '>uploaded: ' + data.uploaded + '> total: ' +  data.total + '> index :' + data.fileItem.chunk.index);
	},
	onUploadSuccess: function (data) {
		console.log('onUploadSuccess', data.fileItem);
		$('.item')
		.eq(data.fileItem.index)
		.find('.item-status').html('上传成功');
	},
	onChunkUploadError: function (data) {
		alert('上传错误，请重新上传');
	},
	onUploadError: function (data) {
		alert('上传错误，请重新上传');
		$('.item')
		.eq(data.fileItem.index)
		.find('.item-status').html('上传失败');
	},
	onUploadComplete: function (data) {
	},
	onError: function (data) {
		alert(data.content);
	}
});
$('.btn-stop').click(function () {
	// uploader.stopFile 传入上传的 index 可以停止上传
	uploader.stopFile(0);
});
$('.btn-continue').click(function () {
	// 继续上传
	var data = uploader.currentFiles[0];
	uploader.resumeUpload(data);
});	

})*/
