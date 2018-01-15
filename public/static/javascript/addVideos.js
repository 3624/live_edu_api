//7.右侧功能区
//var identity="teacher";
var identity =sessionStorage.getItem("localIdentify");
//学生和老师加入房间
$(document).ready(function(){
	var loginRoomSubmit = $("#loginRoomSubmit");
	loginRoomSubmit.click(function(){
		var loginRoomID = $("#loginRoomID").val();
		console.log(loginRoomID);
		window.location.href= "http://live.bobcheng.space/enter/quick/"+loginRoomID;
	});
});

//老师的动态加载
window.onload=function abe(){
	if(identity == "teacher"){
		var createRoomData ={
				list:[{},]
			};
		var roomDivHtml = template("template-createRoom",createRoomData);
		document.getElementById('createRoomList').innerHTML=roomDivHtml;
		var uploadData ={
			list:[{},]
		};
		var uploadDivHtml = template("template-upload",uploadData);
		document.getElementById('uploadList').innerHTML=uploadDivHtml;
		//----------------------绑定事件--------------------------------------
/*			util.addEventListener(createRoom, "click", function(event){
				util.preventDefault(event);
				util.removeClass(roomModal,"f-dn");
			});
			util.addEventListener(closeRoomModal, "click", function(event){
				util.addClass(roomModal,"f-dn");
			});*/
		//---------------------老师创建房间---------------------------------------------

		$("#createRoomSubmit").click(function(event){
			//构造 formdata 类型的请求数据，实际上就是添加键值对，实战中的键（key）和值（value）需要从DOM树中的用户输入获取
			event.preventDefault();
			//event.stopPropagation();
			console.log(1111);
			var className = $("#className").val();
			var classIntro = $("#classIntro").val();
			var beginTime = $("#beginTime").val();
			var beginUTCTime = Date.parse(new Date(beginTime));
			beginUTCTime = beginUTCTime / 1000;
			var endTime = $("#endTime").val();
			var endUTCTime = Date.parse(new Date(endTime));
			endUTCTime = endUTCTime / 1000;
			//var classTypeValue = $('#classTypeId input[name="classTypeName"]:checked').val();
			//var classType = 2;
			//switch(classTypeValue)
			//{
			//	case "一对一课":
			//		maxStu = 1;
			//		classType = 1;	
			//		break;
			//	case "普通大班课":
			//		maxStu = 20;
			//		classType = 2;	
			//	  break;
			//	case "互动小班课":
			//		maxStu = 10;
			//		classType = 3;	
			//	  break;
			//	default:
			//		maxStu = 20;
			//		classType = 2;
			//}
			classType = 2;
			maxStu = 20;
			console.log(className);
			console.log(classIntro);
			console.log(beginUTCTime);
			console.log(endUTCTime);
			console.log(classType);
			console.log(maxStu);
			var fd = new FormData();    
			fd.append( 'id', 'jiarenqi');
			fd.append( 'title', className);
			fd.append( 'introduction', classIntro);
			fd.append( 'stratTimeStamp', beginUTCTime);
			fd.append( 'endTimeStamp', endUTCTime);
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

		//-------------------------上传视频---------------------------------
        var uploader = new BJY.VideoUploader({
            mainElement: $('input[id="uploadVideo"]'),
            ignoreError: true,
            name: '',
            multiple: true,
            getUploadUrl: function (data) {
                return $.ajax({
					url: 'http://live.bobcheng.space/upload_url',	//这里的地址对应于api的地址
                    type: 'post',
                    data: { //这里面的参数对应于api要求发送过来的参数。注意：已有的四个参数是必须的！
                        //file_name: data.videoName, //上传视频的文件名保存在data.videoName,但是现在不使用默认的文件名作为点播视频的标题，改用用户自定义的标题。所以改为下面那行的方式。
						file_name:$("#name").val(), //点播视频的标题
                        definition: 1,  //点播视频的目标清晰度。目前暂时默认为1。前端实现的时候注意留点余地，方便功能扩展。
						
						//其他要post的参数也是用类似的方法弄进来,下面可以自己加
						introduction:$("#introduction").val(),  //点播视频的简介
						id:'jiarenqi'	//这里要改，改为当前用户的ID
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
                            + '<span class="item-text item-name">'
                            //+ file.videoName	//改用 用户自定义的标题作为视频名
							+ $("#name").val()	//这里是修改过后的
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
	}
	
};




