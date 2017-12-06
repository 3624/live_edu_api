<?php
namespace app\index\controller;

use think\Controller;

class HelloWorld extends Controller
{
    public function hello($name = 'thinkphp')
    {
        $this->assign('name', $name);
        return $this->fetch();
    }
}