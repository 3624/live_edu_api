<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 17/12/13
 * Time: 0:01
 */

namespace app\api\controller;


use think\Controller;
use app\api\model\UsersInfo as UserModel;

class Room extends Controller {
    public function buildRoom(){
        $post_info = $this->request->post();
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
}