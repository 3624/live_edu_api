<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 17/12/12
 * Time: 23:57
 */

namespace app\api\model;
use think\Model;


class LiveNow extends Model{
    protected $table = 'live_now';
    public function myCreatedTeachers(){
        // 用户 BELONGS_TO_MANY 角色
        return $this->belongsToMany('UsersInfo', 'teachers_create_lives', 'room_id');
    }
}