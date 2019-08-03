<?php
namespace app\index\controller;

use think\Controller;


class Index extends Controller
{
    public function index()
    {
        //dump('ok');
        return $this->fetch('main');
    }
}