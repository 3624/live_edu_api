<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 17/12/12
 * Time: 23:57
 */

namespace app\api\model;
use think\Model;


class LivePast extends Model{
    protected $table = 'live_past';
    public function myCreatedTeachers(){
        return $this->belongsToMany('UsersInfo', 'teachers_create_lives', 'room_id', 'room_id');
    }
}