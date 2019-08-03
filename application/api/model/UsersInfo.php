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
        return $this->hasMany('LiveNow', 'owner_id', 'user_id');
    }

    public function myCreatedLives_past()
    {
        return $this->hasMany('LivePast', 'owner_id', 'user_id');
    }

    public function myCreatedVideos()
    {
        return $this->hasMany('Video', 'owner_id', 'user_id');
    }

    public function myJoinedLives()
    {
        return $this->belongsToMany('LiveNow', 'users_join_lives', 'room_id', 'user_id');
    }

    public function myJoinedVideos()
    {
        return $this->belongsToMany('Video', 'users_join_videos', 'video_id', 'user_id');
    }

}