<?php

namespace app\api\model;
use think\Model;

class UsersInfo extends Model{
    protected function getRoleAttr($role){
        $rolemap = [0 => 'student', 1 => 'teacher'];
        return $rolemap[$role];
    }

    protected function setRoleAttr($role){
        $rolemap = ['student' => 0, 'teacher' => 1];
        return $rolemap[$role];
    }

    public function myCreatedLives()
    {
        // 用户 BELONGS_TO_MANY 角色
        return $this->belongsToMany('LiveNow', 'teachers_create_lives', 'user_id');
    }

    public function myCreatedLives_past()
    {
        // 用户 BELONGS_TO_MANY 角色
        return $this->belongsToMany('LivePast', 'teachers_create_lives', 'user_id');
    }


}