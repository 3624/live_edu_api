<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 17/12/06
 * Time: 21:06
 */

namespace app\api\controller;
use app\api\model\LiveNow;
use app\api\model\LivePast;
use app\api\model\UsersInfo as UserModel;
use app\api\model\Video;
use think\Controller;
use think\Db;
use think\exception\DbException;
use think\Session;

define('APP_HOOK',true);

class User extends Controller {
    public function sign_up(){
        $post_info = $this->request->post();
        $check_user = UserModel::get($post_info['id']);
        //检查数据库中是否已经有相同id的用户信息
        if($check_user == null){
            //没有相同id的用户，则创建新用户
            /*
                warning：
                    这里默认认为所有数据都是必填的，而且在前端已经做了有效性检查：
                        1、传来的密码是进过加密的密码
                        2、邮箱的格式已在前端检查过了。
                    有时间的话感觉还是要在后台添加检查有效性的代码。

                    另外，有时间的话或许可以另外定一个接口，用于注册的时候异步确定用户名是否存在。
            */
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
            //登陆时传来的密码也是加密过的密码
            return abort(404, 'password error');
        }else{
            $data =['username' => $find_user->user_id,
                'realname' => $find_user->real_name,
                'identity' => $find_user->role];
            //设置session记录用户的用户名和角色
            Session::set('username', $find_user->user_id);
            Session::set('role', $find_user->role);
            header("Access-Control-Allow-Origin: *");

            return json(Funcs::rtnFormat($data));
        }
    }

    //更新回放信息
    public function update_playback(){
        $play_back_parm = [
            'partner_id' => Funcs::$partner_id,
            'page' => 1,
            'page_size' => 999,
            'timestamp' => time(),
        ];
        $play_back_sign = Funcs::getSign($play_back_parm);
        $play_back_parm['sign'] = $play_back_sign;
        $url = 'https://api.baijiayun.com/openapi/playback/getList';
        $result = json_decode(Funcs::send_post($url, $play_back_parm), true);
        if($result['code'] != 0){   //百家云返回的状态码为0表示成功
            abort(502, $result['msg'].'[code]:' . $result['code']);
        }
        $result_data = $result['data'];
        //dump($result_data);
        $list_playback = $result_data['list'];
        foreach($list_playback as $playback){
            //dump($playback);
            if(LivePast::get($playback['video_id']) == null && $playback['status'] == 100){
                //??如果直播房间已删除，则不更新回放信息到live_past中？
                $live_now = LiveNow::get($playback['room_id']);
                if($live_now == null){
                    continue;
                }
                $live_past = new LivePast;
                $live_past->video_id = $playback['video_id'];
                $live_past->room_id = $playback['room_id'];
                $live_past->name = $playback['name'];
                $live_past->status = $playback['status'];
                $live_past->create_time = $playback['create_time'];
                $live_past->length = $playback['length'];
                $live_past->play_url = $playback['play_url'];
                $live_past->preface_url = $playback['preface_url'];
                $live_past->session_id = $playback['session_id'];
                $live_past->owner_id = $live_now->owner_id;
                $live_now->has_playback = 1;
                if(!$live_now->save() || !$live_past->save()){
                    abort(502, $live_now->getError() . $live_past->getError());
                }
            }
        }
    }

    public function delete_operation($mode='history'){
        $post_info = $this->request->post();
        //dump($post_info); //2017年12月27日18:22:16 lhz删除，原因：不注释掉的话返回数据不合规范
        $user = UserModel::get($post_info['id']);
        if($user == null){
            return abort(400, 'user does not exist');
        }
        if($mode == 'history'){ //删除history相当于退出课程/视频。
            switch ($post_info['deleteType']){
                case 'live':
                    $room = LiveNow::get($post_info['videoId']);
                    if($room ==null){
                        return abort(400, 'cannot find the live');
                    }else{
                        $user->myJoinedLives()->detach($room);
                    }
                    break;
                case 'video':
                    $video = Video::get($post_info['videoId']);
                    if($video ==null){
                        return abort(400, 'cannot find the video');
                    }else{
                        //$user->myJoinedLives()->detach($video); //2017-12-26 21:48:35   lhz删除，应为下面那句
                        $user->myJoinedVideos()->detach($video);
                    }
                    break;
                default:
                    return abort(400, "deleteType cannot be ".$post_info['deleteType']);
            }
        }elseif ($mode == 'data'){
            if($user->role == 'student'){
                return abort(400, 'only teacher can delete data');
            }
            switch ($post_info['deleteType']){
                case 'live':
                    $room = LiveNow::get($post_info['videoId']);
                    if($room ==null){
                        return abort(400, 'cannot find the live');
                    }else{
                        //删除所有观看记录
                        Db::execute('delete from users_join_lives where room_id = ? ',[$post_info['videoId']]);
                        //如果有回放的话删除回放
                        if($room->has_playback == 1){
                            $playback = LivePast::getByRoomId($post_info['videoId']);
                            //删除百家云服务器的回放数据
                            $parm = [
                                'partner_id' => Funcs::$partner_id,
                                'video_id' => $playback->video_id,
                                'timestamp' => time()
                            ];
                            $sign = Funcs::getSign($parm);
                            $parm['sign'] = $sign;
                            $result_str = Funcs::send_post('https://api.baijiayun.com/openapi/video/delete', $parm);
                            if($result_str == null){
                                return abort(502, 'request remote api error');
                            }
                            $result_json = json_decode($result_str, true);
                            if($result_json['code'] != 0){
                                return abort(502, $result_json['msg'].'[code]:' . $result_json['code']);
                            }
                            //删除本地数据
                            $playback->delete();
                        }
                        //删除百家云服务器的数据
                        $parm = [
                            'partner_id' => Funcs::$partner_id,
                            'room_id' => $post_info['videoId'],
                            'timestamp' => time()
                        ];
                        $sign = Funcs::getSign($parm);
                        $parm['sign'] = $sign;
                        $result_str = Funcs::send_post('https://api.baijiayun.com/openapi/room/delete', $parm);
                        if($result_str == null){
                            return abort(502, 'request remote api error');
                        }
                        $result_json = json_decode($result_str, true);
                        if($result_json['code'] != 0){
                            return abort(502, $result_json['msg'].'[code]:' . $result_json['code']);
                        }
                        //删除本地的数据
                        $room->delete();
                    }
                    break;
                case 'video':
                    $video = Video::get($post_info['videoId']);
                    if($video ==null){
                        return abort(400, 'cannot find the video');
                    }else{
                        //删除所有观看记录。
                        Db::execute('delete from users_join_videos where video_id = ? ',[$post_info['videoId']]);
                        //删除百家云服务器的数据
                        $parm = [
                            'partner_id' => Funcs::$partner_id,
                            'video_id' => $post_info['videoId'],
                            'timestamp' => time()
                        ];
                        $sign = Funcs::getSign($parm);
                        $parm['sign'] = $sign;
                        $result_str = Funcs::send_post('https://api.baijiayun.com/openapi/video/delete', $parm);
                        if($result_str == null){
                            return abort(502, 'request remote api error');
                        }
                        $result_json = json_decode($result_str, true);
                        if($result_json['code'] != 0){
                            return abort(502, $result_json['msg'].'[code]:' . $result_json['code']);
                        }
                        //删除本地的数据
                        $video->delete();
                    }
                    break;
                default:
                    return abort(400, "deleteType cannot be ".$post_info['deleteType']);
            }
        }
        return Funcs::rtnFormat(null);
    }

    //type: 0->live 1->playback 2-> video
    private function get_live_datafmt($lives, $base_url, $items_per_page, $current_page, $type=0){
        $start_index = ($current_page - 1) * $items_per_page;
        $all_count = count($lives);
        /*if($start_index >= $all_count && $start_index != 0){
            return abort(400, 'no data in that page');
        }*/
        $videos = array();
        //dump($videos);
        for($i = $start_index; $i < $start_index+$items_per_page && $i < $all_count; $i++){
            $video = $lives[$i];
            if($type == 0){
                $playback_url = '';
                //如果有回放的话设置回放地址
                if($video->has_playback == 1){
                    //$playback_url = $this->request->root(true).'/enter/playback/'.$video->room_id;
                    $playback_url = $base_url.'/enter/playback/'.$video->room_id;
                }
                $videos[] = [
                    'name' => $video->title,
                    //'hostName' => $teacher->real_name,
                    //'hostName' => UserModel::where('user_id', $video->owner_id)->value('real_name'),
                    'hostName' => $video->myCreatedTeacher->real_name,
                    'info' => $video->introdution,
                    'imgUrl' => $video->preface_url,
                    'videoID' => $video->room_id,
                    'videoUrl' => $base_url.'/enter/live/'.$video->room_id,
                    'joinCode' => $video->student_code,
                    'joinCodeForTeacher' => $video->teacher_code,
                    'startTime' => $video->start_time,
                    'endTime' => $video->end_time,
                    'length' => $video->end_time - $video->start_time,
                    'hasPlayBack' => $video->has_playback,
                    'playBackUrl' => $playback_url,
                ];
            }elseif ($type == 1){
                $playback = LivePast::getByRoomId($video->room_id);
                if($playback == null){
                    return abort(400, 'playback not found');
                }
                $videos[] = [
                    'name' => $video->title,
                    //'hostName' => $teacher->real_name,
                    //'hostName' => UserModel::where('user_id', $video->owner_id)->value('real_name'),
                    'hostName' => $video->myCreatedTeacher->real_name,
                    'info' => $video->introdution,
                    'imgUrl' => $video->preface_url,
                    'videoID' => $playback->room_id,
                    'videoUrl' => $base_url.'/enter/playback/'.$playback->room_id,
                    'startTime' => $video->start_time,
                    'endTime' => $video->end_time,
                    'length' => $playback->length,
                ];
            }elseif ($type == 2){
                //TODO
            }

        }
        $data = [
            'total' => $all_count,
            'thisTime' => count($videos),
            'pageNumber' => $current_page,
            'videos' => $videos
        ];

        return $data;
    }

    public function my_created_lives(){
        $post_info = $this->request->post();
        $teacher = UserModel::get($post_info['id']);
        if($teacher == null || $teacher->role == 'student'){
            return abort(400, 'user does not exist or is not a teacher');
        }
        //dump('start_update');
        //首先要更新一下回放列表，才能够判断视频是否有回放。
        if(Funcs::check_fresh()){
            $this->update_playback();
        }
        //dump('update_ok');
        $my_lives = $teacher->myCreatedLives;
        $data = $this->get_live_datafmt($my_lives, $this->request->root(true),
                                        $post_info['itemsPerPage'], $post_info['currentPage']);
        return Funcs::rtnFormat($data);
    }

    public function main_page_videos(){
        $post_info = $this->request->post();
        $base_url = $this->request->root(true);
        return $this->get_videos($post_info, $base_url, false);
    }

    public function video_history(){
        $post_info = $this->request->post();
        $base_url = $this->request->root(true);
        return $this->get_videos($post_info, $base_url, true);
    }

    //主页 获取 直播/视频信息 和 个人中心 获取直播/视频信息 都是用这个函数来进行获取
    private function get_videos($post_info, $base_url, $is_history){
        if($is_history){
            $user = UserModel::get($post_info['id']);
            if($user == null){
                return abort(400, 'user does not exist');
            }
        }
        //首先要更新一下回放列表，才能够判断视频是否有回放。
        if(Funcs::check_fresh()){
            $this->update_playback();
        }
        switch ($post_info['videoType']){
            case 'live':
                $live_now = $is_history ? $user->myJoinedLives : LiveNow::all();
                $rt_lives = array();
                //过滤已经结束的直播,判断结束条件是 超过结束时间 或者 拥有回放
                foreach ($live_now as $live_item){
                    if($live_item->end_time > time() && $live_item->has_playback == 0){
                        $rt_lives[] = $live_item;
                    }
                }
                $data = $this->get_live_datafmt($rt_lives, $base_url,
                                                $post_info['itemsPerPage'], $post_info['currentPage'], 0);
                return Funcs::rtnFormat($data);
                break;
            case 'playback':
                $live_now = $is_history ? $user->myJoinedLives : LiveNow::all();
                $rt_lives = array();
                //过滤有回放的直播
                foreach ($live_now as $live_item){
                    if($live_item->has_playback == 1){
                        $rt_lives[] = $live_item;
                    }
                }
                //$this->request->root(true)
                $data = $this->get_live_datafmt($rt_lives, $base_url,
                                                $post_info['itemsPerPage'], $post_info['currentPage'], 1);
                return Funcs::rtnFormat($data);
                break;

            case 'video ':
                //TODO
                break;
            default:
                return abort(400, 'videoType cannot be'.$post_info['videoType']);
        }
    }


}