<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 17/12/13
 * Time: 0:01
 */

namespace app\api\controller;


use app\api\model\LiveNow;
use app\api\model\LivePast;
use app\api\model\Video;
use think\Controller;
use app\api\model\UsersInfo as UserModel;
use think\Exception;
use think\Session;

class Room extends Controller {
    public function build_room(){
        $post_info = $this->request->post();
        /*dump(Session::get('username'));
        dump(Session::get('role'));
        dump($post_info['id']);*/
        $teacher = UserModel::get($post_info['id']);
        if($teacher == null || $teacher->role == 'student'){
            return abort(400, 'user does not exist or is not a teacher');
        }
        $file = $this->request->file('image');
        $image_check = $this->validate(['file' => $file], ['file'=>'require|image'],
            ['file.require' => 'choose image file', 'file.image' => 'not an image']);
        if(true !== $image_check){
            return abort(400, $image_check);
        }
        $info = $file->rule('md5')->move(ROOT_PATH . 'public' . DS . 'static'.DS.'covers');
        if($info){
            $image_url = $this->request->root(true) . '/static/covers/' . $info->getSaveName();
        }else{
            return abort(502, $info->getError());
        }
        $parm = [
            'partner_id' => Funcs::$partner_id,
            'title' => $post_info['title'],
            'start_time' => $post_info['stratTimeStamp'],
            'end_time' => $post_info['endTimeStamp'],
            'type' => $post_info['classType'],
            'max_users' => $post_info['maxStu'],
            'speak_camera_turnon' => 2,
            'timestamp' => time(),
        ];
        $sign = Funcs::getSign($parm);
        $parm['sign'] = $sign;
        $result_str = Funcs::send_post('https://api.baijiayun.com/openapi/room/create', $parm);
        if($result_str == null){
            return abort(502, 'request remote api error');
        }
        $result_json = json_decode($result_str, true);
        if($result_json['code'] != 0){
            return abort(502, $result_json['msg'].'[code]:' . $result_json['code']);
        }
        $result_data = $result_json['data'];
        $teacher->myCreatedLives()->save([
            'room_id' => $result_data['room_id'],
            'title' => $post_info['title'],
            'start_time' => $post_info['stratTimeStamp'],
            'end_time' => $post_info['endTimeStamp'],
            'introdution' => $post_info['introduction'],
            'preface_url' => $image_url,
            'type' => $post_info['classType'],
            'teacher_code' => $result_data['teacher_code'],
            'admin_code' => $result_data['admin_code'],
            'student_code' => $result_data['student_code']]);
        return Funcs::rtnFormat(null);

    }


    //进入直播或回放或点播，通过mode区分 'live'->直播 'playback'->回放 'video'->点播 'quick'->邀请码
    //$room_id表示房间号（直播、回放）、视频号（点播）、或者邀请码（快速模式）
    //$role表示身份，0->audience 1->lecturer
    public function enter_room($mode, $room_id, $role=0){
        if(Session::has('username')){
            $username = Session::get('username');
            $user = UserModel::get($username);
            $real_name = $user->real_name;
            $user_number = $user->number;

        }else{
            $real_name = 'guest';
            $user_number = '0';
        }

        //身份检测
        if($role == 1){
            if(!Session::has('username')){
                return abort(400, 'cannot enter as a teacher before you log in');
            }else if($user->role != 'teacher'){
                return abort(400, 'cannot enter as a teacher when sign in as a student');
            }
        }


        if($mode == 'live'){
            $parm = [
                'room_id' => $room_id,
                'user_number' => $user_number,
                'user_role' => $role,
                'user_name' => $real_name,
                'user_avatar' => 'https://img.qq1234.org/uploads/allimg/140426/155540J58-13.jpg'
            ];
            $sign = Funcs::getSign($parm);
            $parm['sign'] = $sign;
            $base_url = 'http://www.baijiayun.com/web/room/enter';
            $url = Funcs::combineURL($base_url, $parm);
            //添加观看记录
            if($role == 0 && Session::has('username')){
                $video = LiveNow::getByRoomId($room_id);
                try {
                    $user->myJoinedLives()->attach($video, ['join_time' => time()]);
                } catch (Exception $e) {
                    return abort(502,'add to history error'.$e->getMessage());
                }
            }
            $this->redirect($url);
        }elseif ($mode == 'playback'){
            $playback = LivePast::getByRoomId($room_id);
            if($playback == null){
                $this->error('该视频没有回放:(',$this->request->root(true));
            }else{
                $url = $playback->play_url;
                //添加观看记录
                if($role == 0 && Session::has('username')){
                    $video = LiveNow::getByRoomId($room_id);
                    try {
                        $user->myJoinedLives()->attach($video, ['join_time' => time()]);
                    } catch (Exception $e) {
                        return abort(502,'add to history error'.$e->getMessage());
                    }
                }
                $this->redirect($url);
            }
        }elseif ($mode == 'quick'){
            $parm = [
                'code' => $room_id,
                'user_name' => $real_name,
            ];
            $base_url = 'https://www.baijiayun.com/web/room/quickenter';
            $url = Funcs::combineURL($base_url, $parm);
            $this->redirect($url);
        }elseif ($mode == 'video'){
            //TODO
            /**
             *  以下2017-12-28 15:59:36 lhz添加
             *  备注：由于现有的api中只规定了前端要post video_id，没规定要post token
             *  而点播视频的观看链接由video_id和token两部分组成，所以需要访问数据库获取video_id对应token。
             */
            $video=Video::get($room_id);
            if ($video==null) {
                $this->error('点播视频id号不存在！',$this->request->root(true));
            }
            else{
                if ($video->status != 100) {
                    $this->error('该点播尚未转码成功，无法观看',$this->request->root(true));
                }
                else{
                    $parm = [
                        'vid' => $room_id,
                        'token' => $video->token,
                    ];
                    $base_url='http://www.baijiayun.com/web/video/player';
                    $url = Funcs::combineURL($base_url, $parm);
                    //添加观看记录
                    if($role == 0 && Session::has('username')){
                        try {
                            $user->myJoinedVideos()->attach($video, ['join_time' => time()]);
                        } catch (Exception $e) {
                            return abort(502,'add to history error'.$e->getMessage());
                        }
                    }
                    $this->redirect($url);
                }
            }
            
            
            /**
             *  以上2017-12-28 15:59:52  lhz添加
             */
        }
        else{
            return abort(400, 'mode is wrong');
        }
    }
}