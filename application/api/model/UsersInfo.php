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
        return $this->hasMany('LiveNow', 'owner_id', 'user_id');
    }

    public function myCreatedLives_past()
    {
        // 用户 BELONGS_TO_MANY 角色
        return $this->hasMany('LivePast', 'owner_id', 'user_id');
    }

    public function myCreatedVideos()
    {
        // 用户 BELONGS_TO_MANY 角色
        return $this->hasMany('Video', 'owner_id', 'user_id');
    }


}