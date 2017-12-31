<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 17/12/12
 * Time: 23:57
 */

namespace app\api\model;
use think\Model;


class Video extends Model{
    protected $table = 'video';
    //创建我的老师
    public function myCreatedTeacher(){

        return $this->belongsTo('UsersInfo', 'owner_id');
    }
}