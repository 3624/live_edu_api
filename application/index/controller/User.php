<?php
namespace app\index\controller;
use app\index\model\User as UserModel;
class User
{
// 新增用户数据
    public function add()
    {
        $user = new UserModel;
        $user->nickname = '流年';
        $user->email = 'thinkphp@qq.com';
        $user->birthday = '1977/03/05';
        if ($user->save()) {
            return '用户[ ' . $user->nickname . ':' . $user->id . ' ]新增成功';
        } else {
            return $user->getError();
        }
    }

    public function read($id)
    {
        $user = UserModel::get($id);
        if($user == null){
            echo 'error';
            return;
        }
        echo $user->nickname . '<br/>';
        echo $user->email . '<br/>';
        echo $user->birthday . '<br/>';
        echo $user;
    }


    public function index()
    {
        $list = UserModel::where('status',0)->limit(3)->select(); //select() 返回的是对象数组
//        foreach ($list as $user) {
//            $user->hidden(['update_time']);
//            echo $user->nickname . '<br/>';
//            echo $user->email . '<br/>';
//            echo $user->birthday. '<br/>';
//            echo '----------------------------------<br/>';
//        }
        $array = ['info' => 'ok', 'code' => 123, 'result' => $list];
        $out = json_encode($array);
        return $out;
    }

    public function update($id)
    {
        $user = UserModel::get($id);
        $user->nickname = '刘晨';
        $user->email = 'liu21st@gmail.com';
        if (false !== $user->save()) {
            return '更新用户成功';
        } else {
            return $user->getError();
        }
    }

    public function delete($id)
    {
        $user = UserModel::get($id);
        if ($user) {
            $user->delete();
            return '删除用户成功';
        } else {
            return '删除的用户不存在';
        }
    }
}