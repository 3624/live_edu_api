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
    public function myCreatedTeacher(){
        // 用户 BELONGS_TO_MANY 角色
        return $this->belongsTo('UsersInfo', 'owner_id');
    }
}