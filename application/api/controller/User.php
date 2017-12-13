<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 17/12/06
 * Time: 21:06
 */

namespace app\api\controller;
use app\api\model\UsersInfo as UserModel;
use think\Controller;
use think\Session;

class User extends Controller {
    public function sign_up(){
        $post_info = $this->request->post();
        $check_user = UserModel::get($post_info['id']);
        if($check_user == null){
            $new_user = new UserModel;
            $new_user->user_id = $post_info['id'];
            $new_user->email = $post_info['email'];
            $new_user->password = $post_info['password'];
            $new_user->real_name = $post_info['realName'];
            $new_user->role = $post_info['identity'];
            if($new_user->save()){
                $created_user = UserModel::get($post_info['id']);
                $data =['username' => $created_user->user_id,
                    'realname' => $created_user->real_name,
                    'identity' => $created_user->role];
                //设置session记录用户的用户名和角色
                Session::set('username', $created_user->user_id);
                Session::set('role', $created_user->role);

                return json(Funcs::rtnFormat($data));
            }else{
                return abort(502, 'save info error');
            }
        }else{
            return abort(404, 'username has existed');
        }
    }

    public function sign_in(){
        $post_info = $this->request->post();
        $find_user = UserModel::get($post_info['id']);
        if($find_user == null){
            return abort(404, 'username does not exist' );
        }else if($find_user->password != $post_info['password']){
            return abort(404, 'password error');
        }else{
            $data =['username' => $find_user->user_id,
                'realname' => $find_user->real_name,
                'identity' => $find_user->role];
            //设置session记录用户的用户名和角色
            Session::set('username', $find_user->user_id);
            Session::set('role', $find_user->role);

            return json(Funcs::rtnFormat($data));
        }
    }

    public function my_created_lives(){
        $post_info = $this->request->post();
        $teacher = UserModel::get($post_info['id']);
        if($teacher == null || $teacher->role == 'student'){
            return abort(400, 'user does not exist or is not a teacher');
        }
        $my_lives = $teacher->myCreatedLives;
        $items_per_page = $post_info['itemsPerPage'];
        $start_index = ($post_info['currentPage'] - 1) * $items_per_page;
        $all_count = count($my_lives);
        if($start_index >= $all_count && $start_index != 0){
            return abort(400, 'no data in that page');
        }
        $videos = array();
        for($i = $start_index; $i < $start_index+$items_per_page && $i < $all_count; $i++){
            $video = $my_lives[$i];
            $videos[] = [
                'name' => $video->title,
                'hostName' => $teacher->real_name,
                'info' => $video->introdution,
                'imgUrl' => $video->preface_url,
                'videoID' => $video->room_id,
                'videoUrl' => $this->request->root(true).'/enter_live/'.$video->room_id,
                'joinCode' => $video->student_code,
                'joinCodeForTeacher' => $video->teacher_code,
                'startTime' => $video->start_time,
                'endTime' => $video->end_time,
                'length' => $video->end_time - $video->start_time
            ];
        }
        $data = [
            'total' => $all_count,
            'thisTime' => count($videos),
            'pageNumber' => $post_info['currentPage'],
            'videos' => $videos
        ];
        return Funcs::rtnFormat($data);
    }
}