<?php
namespace app\index\controller;

use think\Controller;
use think\Db;
use think\db\exception\DataNotFoundException;
use think\db\exception\ModelNotFoundException;
use think\exception\DbException;

class Index extends Controller
{
    public function index()
    {
        dump('ok');
    }
}