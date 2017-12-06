<?php

namespace app\index\model;
use think\Model;
class User extends Model{
    protected $table = 'think_user';
    protected $type = [
        // 设置birthday为时间戳类型（整型）在读取的时候会自动转为datatime类型，在写入的时候会自动转换为时间戳类型（如果需要转换的话）
        'birthday' => 'timestamp:Y/m/d',
    ];
}