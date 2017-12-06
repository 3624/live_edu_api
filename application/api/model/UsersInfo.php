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

}