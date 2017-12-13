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
        return $this->belongsTo('UsersInfo', 'owner_id');
    }
}